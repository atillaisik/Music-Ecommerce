import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { DiscountCode, DiscountFormData } from '../types/discount';
import { toast } from 'sonner';
import { mapSupabaseError } from './apiErrors';

const normalizeForDb = (input: DiscountFormData) => ({
    code: input.code.toUpperCase().trim(),
    discount_type: input.discount_type,
    discount_value: Number(input.discount_value),
    usage_limit: input.usage_limit ?? null,
    expiry_date: input.expiry_date ?? null,
    is_active: input.is_active,
});

export const useDiscountCodes = () => {
    return useQuery({
        queryKey: ['discount_codes'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('discount_codes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw mapSupabaseError(error);
            return (data ?? []) as DiscountCode[];
        },
    });
};

export const useDiscountCode = (id: string | undefined) => {
    return useQuery({
        queryKey: ['discount_code', id],
        queryFn: async () => {
            if (!id) return null;

            const { data, error } = await supabase
                .from('discount_codes')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw mapSupabaseError(error);
            return data as DiscountCode;
        },
        enabled: !!id,
    });
};

export const useCreateDiscountCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: DiscountFormData) => {
            const { data, error } = await supabase
                .from('discount_codes')
                .insert([normalizeForDb(input)])
                .select()
                .single();

            if (error) throw mapSupabaseError(error);
            return data as DiscountCode;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['discount_codes'] });
            toast.success('Discount code created successfully');
        },
        onError: (error: any) => {
            toast.error(`Failed to create discount code: ${error?.message ?? 'unknown error'}`);
        },
    });
};

export const useUpdateDiscountCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...input }: Partial<DiscountFormData> & { id: string }) => {
            const payload: Record<string, unknown> = { ...input };
            if (typeof input.code === 'string') payload.code = input.code.toUpperCase().trim();
            if (typeof input.discount_value !== 'undefined') payload.discount_value = Number(input.discount_value);

            const { data, error } = await supabase
                .from('discount_codes')
                .update(payload)
                .eq('id', id)
                .select()
                .single();

            if (error) throw mapSupabaseError(error);
            return data as DiscountCode;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['discount_codes'] });
            queryClient.invalidateQueries({ queryKey: ['discount_code', data.id] });
            toast.success('Discount code updated successfully');
        },
        onError: (error: any) => {
            toast.error(`Failed to update discount code: ${error?.message ?? 'unknown error'}`);
        },
    });
};

export const useDeleteDiscountCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('discount_codes').delete().eq('id', id);
            if (error) throw mapSupabaseError(error);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['discount_codes'] });
            toast.success('Discount code deleted successfully');
        },
        onError: (error: any) => {
            toast.error(`Failed to delete discount code: ${error?.message ?? 'unknown error'}`);
        },
    });
};

export interface DiscountValidation {
    ok: boolean;
    error: string | null;
    discount_id: string | null;
    discount_amount: number;
}

export const validateDiscountCode = async (
    code: string,
    subtotal: number,
): Promise<DiscountValidation> => {
    const { data, error } = await supabase
        .rpc('validate_discount', { p_code: code, p_subtotal: subtotal })
        .single();

    if (error) {
        return { ok: false, error: error.message, discount_id: null, discount_amount: 0 };
    }

    const row = data as { ok: boolean; error: string | null; discount_id: string | null; discount_amount: number | string };
    return {
        ok: row.ok,
        error: row.error,
        discount_id: row.discount_id,
        discount_amount: Number(row.discount_amount ?? 0),
    };
};
