import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

/**
 * Public storefront realtime subscriptions. Listens for catalog-only changes
 * that any visitor cares about. Admin-only events live in
 * `useAdminRealTimeSubscriptions`.
 */
export const useRealTimeSubscriptions = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const productsSubscription = supabase
            .channel('public-products-realtime')
            .on(
                'postgres_changes',
                { event: '*', table: 'products', schema: 'public', filter: 'is_active=eq.true' },
                (payload) => {
                    queryClient.invalidateQueries({ queryKey: ['products'] });
                    const newData = payload.new as any;
                    if (newData?.id) {
                        queryClient.invalidateQueries({ queryKey: ['product', newData.id] });
                    }
                }
            )
            .subscribe();

        const categoriesSubscription = supabase
            .channel('public-categories-realtime')
            .on(
                'postgres_changes',
                { event: '*', table: 'categories', schema: 'public', filter: 'is_active=eq.true' },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['categories'] });
                }
            )
            .subscribe();

        const brandsSubscription = supabase
            .channel('public-brands-realtime')
            .on(
                'postgres_changes',
                { event: '*', table: 'brands', schema: 'public', filter: 'is_active=eq.true' },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['brands'] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(productsSubscription);
            supabase.removeChannel(categoriesSubscription);
            supabase.removeChannel(brandsSubscription);
        };
    }, [queryClient]);
};
