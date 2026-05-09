import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { mapSupabaseError } from './apiErrors';
import { toast } from 'sonner';

export interface Article {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    body: string | null;
    image_url: string | null;
    category: string | null;
    read_time_minutes: number | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export type ArticleFormData = Omit<Article, 'id' | 'created_at' | 'updated_at' | 'published_at'> & {
    published_at?: string | null;
};

export const useArticles = (onlyPublished = true) => {
    return useQuery({
        queryKey: ['articles', { onlyPublished }],
        queryFn: async () => {
            let query = supabase
                .from('articles')
                .select('*')
                .order('published_at', { ascending: false });

            if (onlyPublished) query = query.eq('is_published', true);

            const { data, error } = await query;
            if (error) throw mapSupabaseError(error);
            return (data ?? []) as Article[];
        },
    });
};

export const useArticle = (id: string | undefined) => {
    return useQuery({
        queryKey: ['article', id],
        queryFn: async () => {
            if (!id) return null;
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw mapSupabaseError(error);
            return data as Article;
        },
        enabled: !!id,
    });
};

export const useCreateArticle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: ArticleFormData) => {
            const { data, error } = await supabase
                .from('articles')
                .insert([{ ...input, published_at: input.is_published ? new Date().toISOString() : null }])
                .select()
                .single();

            if (error) throw mapSupabaseError(error);
            return data as Article;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            toast.success('Article created');
        },
        onError: (error: any) => {
            toast.error(`Failed to create article: ${error?.message ?? 'unknown error'}`);
        },
    });
};

export const useUpdateArticle = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: Partial<ArticleFormData>) => {
            const payload: Partial<Article> = { ...input };
            if (input.is_published === true) {
                payload.published_at = new Date().toISOString();
            }
            const { data, error } = await supabase
                .from('articles')
                .update(payload)
                .eq('id', id)
                .select()
                .single();

            if (error) throw mapSupabaseError(error);
            return data as Article;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            queryClient.invalidateQueries({ queryKey: ['article', id] });
            toast.success('Article updated');
        },
        onError: (error: any) => {
            toast.error(`Failed to update article: ${error?.message ?? 'unknown error'}`);
        },
    });
};

export const useDeleteArticle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('articles').delete().eq('id', id);
            if (error) throw mapSupabaseError(error);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['articles'] });
            toast.success('Article deleted');
        },
        onError: (error: any) => {
            toast.error(`Failed to delete article: ${error?.message ?? 'unknown error'}`);
        },
    });
};
