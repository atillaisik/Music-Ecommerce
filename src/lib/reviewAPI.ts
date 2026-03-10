import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { toast } from 'sonner';

export interface ProductReview {
    id: string;
    product_id: string;
    user_id: string;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
    updated_at: string;
}

export const useReviews = (productId: string | undefined) => {
    return useQuery({
        queryKey: ['reviews', productId],
        queryFn: async () => {
            if (!productId) return [];
            
            const { data, error } = await supabase
                .from('product_reviews')
                .select('*')
                .eq('product_id', productId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as ProductReview[];
        },
        enabled: !!productId
    });
};

export const useAddReview = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (reviewData: Omit<ProductReview, 'id' | 'created_at' | 'updated_at'>) => {
            const { data, error } = await supabase
                .from('product_reviews')
                .insert([reviewData])
                .select()
                .single();

            if (error) throw error;
            return data as ProductReview;
        },
        onSuccess: (data) => {
            // Invalidate the reviews list for this product
            queryClient.invalidateQueries({ queryKey: ['reviews', data.product_id] });
            // Invalidate the product itself to refetch average rating and total reviews
            queryClient.invalidateQueries({ queryKey: ['product', data.product_id] });
            toast.success('Review submitted successfully');
        },
        onError: (error: any) => {
            toast.error(`Failed to submit review: ${error.message}`);
        }
    });
};
