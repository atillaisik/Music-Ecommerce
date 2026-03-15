import { supabase } from './supabaseClient';
import { Product } from '@/types/product';
import { Product as MockProduct } from '@/data/mock';

export interface WishlistItem {
    id: string;
    user_id: string;
    product_id: string;
    created_at: string;
    product?: (Product | MockProduct);
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

        // Format the products to match our internal Product/MockProduct type
        return data.map((item: any) => {
            const product = item.product;
            if (!product) return null;

            return {
                ...product,
                images: product.product_images || [],
                // Ensure price is a number
                price: Number(product.price),
                original_price: product.original_price ? Number(product.original_price) : undefined,
            };
        }).filter(Boolean) as (Product | MockProduct)[];
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

        if (error) {
            console.error('Error adding to wishlist:', error);
            throw error;
        }
    },

    async removeFromWishlist(productId: string) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { error } = await supabase
            .from('wishlist_items')
            .delete()
            .eq('user_id', session.user.id)
            .eq('product_id', productId);

        if (error) {
            console.error('Error removing from wishlist:', error);
            throw error;
        }
    },

    async syncWishlist(productIds: string[]) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || productIds.length === 0) return;

        const items = productIds.map(productId => ({
            user_id: session.user.id,
            product_id: productId
        }));

        const { error } = await supabase
            .from('wishlist_items')
            .upsert(items, { onConflict: 'user_id, product_id' });

        if (error) {
            console.error('Error syncing wishlist:', error);
            throw error;
        }
    }
};
