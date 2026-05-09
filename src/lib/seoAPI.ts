import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { mapSupabaseError } from './apiErrors';
import { toast } from 'sonner';

export interface SEOMeta {
    path: string;
    title: string;
    description: string;
    keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    canonical?: string;
    robots?: string; // e.g. "index, follow" / "noindex, nofollow"
    schema_jsonld?: string; // raw JSON-LD string for the page
}

const PAGE = 'seo';

export const KNOWN_SEO_ROUTES: { path: string; label: string; description: string }[] = [
    { path: '/', label: 'Anasayfa', description: 'Site açılış sayfası' },
    { path: '/shop', label: 'Mağaza', description: 'Tüm ürünler katalogu' },
    { path: '/instruments', label: 'Enstrümanlar', description: 'Kategori liste sayfası' },
    { path: '/brands', label: 'Markalar', description: 'Marka liste sayfası' },
    { path: '/deals', label: 'Fırsatlar', description: 'İndirimli ürünler' },
    { path: '/learn', label: 'Öğren', description: 'Editöryel makaleler' },
    { path: '/contact', label: 'İletişim', description: 'İletişim sayfası' },
    { path: '/faqs', label: 'SSS', description: 'Sıkça sorulan sorular' },
];

const isAllowedKey = (k: string) => /^[\/a-zA-Z0-9_\-]+$/.test(k);

export const useSEOMetaList = () => {
    return useQuery({
        queryKey: ['seo-meta-list'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('site_content')
                .select('section_name, content, updated_at')
                .eq('page_name', PAGE);
            if (error) throw mapSupabaseError(error);
            const map: Record<string, SEOMeta> = {};
            (data ?? []).forEach((row: any) => {
                map[row.section_name] = { ...(row.content as SEOMeta), path: row.section_name };
            });
            return map;
        },
    });
};

export const useSEOMeta = (path: string | undefined) => {
    return useQuery({
        queryKey: ['seo-meta', path],
        queryFn: async (): Promise<SEOMeta | null> => {
            if (!path || !isAllowedKey(path)) return null;
            const { data, error } = await supabase
                .from('site_content')
                .select('content')
                .eq('page_name', PAGE)
                .eq('section_name', path)
                .maybeSingle();
            if (error) throw mapSupabaseError(error);
            if (!data?.content) return null;
            return { ...(data.content as SEOMeta), path };
        },
        enabled: !!path,
        staleTime: 5 * 60 * 1000,
    });
};

export const useUpdateSEOMeta = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (meta: SEOMeta): Promise<SEOMeta> => {
            if (!isAllowedKey(meta.path)) {
                throw new Error('Invalid path key');
            }
            const { content, ...rest } = meta as any;
            void content;
            void rest;
            const { error } = await supabase
                .from('site_content')
                .upsert(
                    {
                        page_name: PAGE,
                        section_name: meta.path,
                        content: meta,
                    },
                    { onConflict: 'page_name,section_name' },
                );
            if (error) throw mapSupabaseError(error);
            return meta;
        },
        onSuccess: (meta) => {
            queryClient.invalidateQueries({ queryKey: ['seo-meta-list'] });
            queryClient.invalidateQueries({ queryKey: ['seo-meta', meta.path] });
            toast.success('SEO ayarları güncellendi');
        },
        onError: (error: any) => {
            toast.error(`Güncelleme başarısız: ${error?.message ?? 'unknown error'}`);
        },
    });
};
