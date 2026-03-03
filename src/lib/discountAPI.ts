import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { DiscountCode, DiscountFormData } from '../types/discount';
import { toast } from 'sonner';

export const useDiscountCodes = () => {
    return useQuery({
        queryKey: ['discount_codes'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('discount_codes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching discount codes:', error);
                return [] as DiscountCode[];
            }

            return data as DiscountCode[];
        }
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

            if (error) {
                console.error('Error fetching discount code:', error);
                throw error;
            }

            return data as DiscountCode;
        },
        enabled: !!id
    });
};

export const useCreateDiscountCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (discount: DiscountFormData) => {
            const { data, error } = await supabase
                .from('discount_codes')
                .insert([discount])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['discount_codes'] });
            toast.success('Discount code created successfully');
        },
        onError: (error: any) => {
            toast.error(`Failed to create discount code: ${error.message}`);
        }
    });
};

export const useUpdateDiscountCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...discount }: Partial<DiscountFormData> & { id: string }) => {
            const { data, error } = await supabase
                .from('discount_codes')
                .update(discount)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['discount_codes'] });
            queryClient.invalidateQueries({ queryKey: ['discount_code', data.id] });
            toast.success('Discount code updated successfully');
        },
        onError: (error: any) => {
            toast.error(`Failed to update discount code: ${error.message}`);
        }
    });
};

export const useDeleteDiscountCode = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('discount_codes')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['discount_codes'] });
            toast.success('Discount code deleted successfully');
        },
        onError: (error: any) => {
            toast.error(`Failed to delete discount code: ${error.message}`);
        }
    });
};
