import { supabase } from './supabaseClient';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { mapSupabaseError } from './apiErrors';

export interface WishlistItem {
    id: string;
    user_id: string;
    product_id: string;
    created_at: string;
    product?: (Product);
}

export const wishlistAPI = {
    async getWishlist() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];

        const { data, error } = await supabase
            .from('wishlist_items')
            .select('*, product:products(*, product_images(*))')
            .eq('user_id', session.user.id);

        if (error) {
            console.error('Error fetching wishlist:', error);
            return [];
        }

        let droppedCount = 0;
        const deadIds: string[] = [];
        const items = data
            .map((item: any) => {
                const product = item.product;
                if (!product) {
                    droppedCount += 1;
                    deadIds.push(item.product_id);
                    return null;
                }
                return {
                    ...product,
                    images: product.product_images || [],
                    price: Number(product.price),
                    original_price: product.original_price ? Number(product.original_price) : undefined,
                };
            })
            .filter(Boolean) as (Product)[];

        if (droppedCount > 0 && deadIds.length > 0) {
            // Best-effort cleanup of orphaned wishlist rows so the toast doesn't repeat.
            await supabase
                .from('wishlist_items')
                .delete()
                .eq('user_id', session.user.id)
                .in('product_id', deadIds);

            toast.info(
                `${droppedCount} item${droppedCount === 1 ? '' : 's'} removed from your wishlist (no longer available)`
            );
        }

        return items;
    },

    async addToWishlist(productId: string) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { error } = await supabase
            .from('wishlist_items')
            .upsert({
                user_id: session.user.id,
                product_id: productId
            }, { onConflict: 'user_id, product_id' });

        if (error) throw mapSupabaseError(error);
    },

    async removeFromWishlist(productId: string) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { error } = await supabase
            .from('wishlist_items')
            .delete()
            .eq('user_id', session.user.id)
            .eq('product_id', productId);

        if (error) throw mapSupabaseError(error);
    },

    async syncWishlist(productIds: string[]) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || productIds.length === 0) return;

        const items = productIds.map(productId => ({
            user_id: session.user.id,
            product_id: productId
        }));

        try {
            const { error } = await supabase
                .from('wishlist_items')
                .upsert(items, { onConflict: 'user_id, product_id' });

            if (error) throw error;
        } catch (error) {
            console.warn('Batch wishlist sync failed, trying individual items:', error);
            
            // If batch fails, try individual items to persist what we can
            for (const item of items) {
                try {
                    const { error } = await supabase
                        .from('wishlist_items')
                        .upsert(item, { onConflict: 'user_id, product_id' });
                    if (error) {
                        console.error(`Failed to sync item ${item.product_id}:`, error);
                    }
                } catch (itemError) {
                    console.error(`Unexpected error syncing item ${item.product_id}:`, itemError);
                }
            }
        }
    }
};
