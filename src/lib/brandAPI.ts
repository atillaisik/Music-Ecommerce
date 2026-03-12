import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { Brand } from '../types/product';
import { toast } from 'sonner';

export const useBrands = (onlyActive = false) => {
    return useQuery({
        queryKey: ['brands', { onlyActive }],
        queryFn: async () => {
            let query = supabase
                .from('brands')
                .select('*')
                .order('name', { ascending: true });

            if (onlyActive) {
                query = query.eq('is_active', true);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching brands:', error);
                return [] as Brand[];
            }

            return data as Brand[];
        }
    });
};

export const useBrand = (id: string | undefined) => {
    return useQuery({
        queryKey: ['brand', id],
        queryFn: async () => {
            if (!id) return null;

            const { data, error } = await supabase
                .from('brands')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching brand:', error);
                throw error;
            }

            return data as Brand;
        },
        enabled: !!id
    });
};

export const useCreateBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (brand: Partial<Brand>) => {
            const { data, error } = await supabase
                .from('brands')
                .insert([brand])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
            toast.success('Brand created successfully');
        },
        onError: (error: any) => {
            toast.error(`Failed to create brand: ${error.message}`);
        }
    });
};

export const useUpdateBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...brand }: Partial<Brand> & { id: string }) => {
            const { data, error } = await supabase
                .from('brands')
                .update(brand)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
            queryClient.invalidateQueries({ queryKey: ['brand', data.id] });
            toast.success('Brand updated successfully');
        },
        onError: (error: any) => {
            toast.error(`Failed to update brand: ${error.message}`);
        }
    });
};

export const useDeleteBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error, count } = await supabase
                .from('brands')
                .delete({ count: 'exact' })
                .eq('id', id);

            if (error) throw error;
            
            // If RLS blocked the delete or the ID doesn't exist, count will be 0
            if (count === 0) {
                throw new Error('Permission denied or brand not found');
            }
            
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
            toast.success('Brand deleted successfully');
        },
        onError: (error: any) => {
            console.error('Delete brand error:', error);
            
            let message = error.message;
            
            // Handle specific PostgreSQL error codes
            if (error.code === '23503') {
                message = "The brand cannot be deleted because it is still linked to one or more products.";
            }
            
            toast.error(`Failed to delete brand: ${message}`);
        }
    });
};
