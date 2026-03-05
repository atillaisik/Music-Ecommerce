import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { Category } from '../types/product';
import { toast } from 'sonner';

export interface CategoryWithCount extends Category {
    product_count: number;
}

export const useCategories = (onlyActive = false) => {
    return useQuery({
        queryKey: ['categories', { onlyActive }],
        queryFn: async () => {
            let query = supabase
                .from('categories')
                .select('*')
                .order('display_order', { ascending: true });

            if (onlyActive) {
                query = query.eq('is_active', true);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data as Category[];
        }
    });
};

export const useCategoriesWithCount = () => {
    return useQuery({
        queryKey: ['categories', 'with-count'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('categories')
                .select('*, product_count:products(count)');

            if (error) throw error;

            return (data as any[]).map(cat => ({
                ...cat,
                product_count: cat.product_count?.[0]?.count || 0
            })) as CategoryWithCount[];
        }
    });
};

export const useCategory = (id: string | undefined) => {
    return useQuery({
        queryKey: ['category', id],
        queryFn: async () => {
            if (!id) return null;
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Category;
        },
        enabled: !!id
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (categoryData: Partial<Category>) => {
            // Generate slug if not provided
            if (!categoryData.slug && categoryData.name) {
                categoryData.slug = categoryData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }

            const { data, error } = await supabase
                .from('categories')
                .insert([categoryData])
                .select()
                .single();

            if (error) throw error;
            return data as Category;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category created successfully');
        },
        onError: (error: any) => {
            toast.error(`Error creating category: ${error.message}`);
        }
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<Category> }) => {
            const { error } = await supabase
                .from('categories')
                .update(data)
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['categories', 'with-count'] });
            queryClient.invalidateQueries({ queryKey: ['category', variables.id] });
            toast.success('Category updated successfully');
        },
        onError: (error: any) => {
            toast.error(`Error updating category: ${error.message}`);
        }
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category deleted successfully');
        },
        onError: (error: any) => {
            toast.error(`Error deleting category: ${error.message}`);
        }
    });
};

export const useReorderCategories = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updates: { id: string; display_order: number }[]) => {
            const promises = updates.map(update =>
                supabase
                    .from('categories')
                    .update({ display_order: update.display_order })
                    .eq('id', update.id)
            );

            const results = await Promise.all(promises);
            const error = results.find(r => r.error)?.error;
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: (error: any) => {
            toast.error(`Error reordering categories: ${error.message}`);
        }
    });
};
