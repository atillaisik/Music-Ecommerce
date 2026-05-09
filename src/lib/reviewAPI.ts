import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { toast } from 'sonner';
import { mapSupabaseError } from './apiErrors';

export interface ProductReview {
    id: string;
    product_id: string;
    user_id: string | null;
    user_name: string;
    reviewer_email: string | null;
    rating: number;
    comment: string;
    created_at: string;
    updated_at: string;
}

export interface AddReviewInput {
    product_id: string;
    rating: number;
    comment: string;
    reviewer_name: string;
    reviewer_email?: string;
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

            if (error) throw mapSupabaseError(error);
            return (data ?? []) as ProductReview[];
        },
        enabled: !!productId,
    });
};

export const useUserReviews = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['reviews', 'user', userId],
        queryFn: async () => {
            if (!userId) return [];
            const { data, error } = await supabase
                .from('product_reviews')
                .select('*, product:products(id, name, product_images(image_url, is_primary))')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw mapSupabaseError(error);
            return (data ?? []) as (ProductReview & { product?: { id: string; name: string; product_images?: { image_url: string; is_primary: boolean }[] } })[];
        },
        enabled: !!userId,
    });
};

export const useAddReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: AddReviewInput) => {
            const reviewerName = input.reviewer_name?.trim();
            if (!reviewerName) throw new Error('Reviewer name is required.');
            if (!input.comment?.trim()) throw new Error('Review comment is required.');
            if (input.rating < 1 || input.rating > 5) throw new Error('Rating must be between 1 and 5.');

            const { data: { session } } = await supabase.auth.getSession();
            const user_id = session?.user?.id ?? null;

            const row = {
                product_id: input.product_id,
                user_id,
                user_name: reviewerName,
                reviewer_email: user_id ? null : (input.reviewer_email?.trim() || null),
                rating: input.rating,
                comment: input.comment.trim(),
            };

            if (!user_id && !row.reviewer_email) {
                throw new Error('Email is required for guest reviews.');
            }

            const { data, error } = await supabase
                .from('product_reviews')
                .insert([row])
                .select()
                .single();

            if (error) throw mapSupabaseError(error);
            return data as ProductReview;
        },
        onMutate: async (input) => {
            await queryClient.cancelQueries({ queryKey: ['reviews', input.product_id] });
            const previous = queryClient.getQueryData<ProductReview[]>(['reviews', input.product_id]);

            const optimistic: ProductReview = {
                id: `optimistic-${Date.now()}`,
                product_id: input.product_id,
                user_id: null,
                user_name: input.reviewer_name,
                reviewer_email: input.reviewer_email ?? null,
                rating: input.rating,
                comment: input.comment,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            queryClient.setQueryData<ProductReview[]>(
                ['reviews', input.product_id],
                (old) => [optimistic, ...(old ?? [])]
            );

            return { previous };
        },
        onError: (error: any, input, context) => {
            if (context?.previous) {
                queryClient.setQueryData(['reviews', input.product_id], context.previous);
            }
            toast.error(`Failed to submit review: ${error?.message ?? 'unknown error'}`);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['reviews', data.product_id] });
            queryClient.invalidateQueries({ queryKey: ['product', data.product_id] });
            toast.success('Review submitted successfully');
        },
    });
};
