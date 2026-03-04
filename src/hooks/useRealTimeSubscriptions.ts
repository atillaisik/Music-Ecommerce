import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

/**
 * Hook to set up real-time subscriptions for key tables.
 * This automatically invalidates React Query caches when data changes in the database.
 */
export const useRealTimeSubscriptions = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        // 1. Subscribe to Orders
        const ordersSubscription = supabase
            .channel('orders-realtime')
            .on(
                'postgres_changes',
                { event: '*', table: 'orders', schema: 'public' },
                (payload) => {
                    console.log('Order change received:', payload);
                    queryClient.invalidateQueries({ queryKey: ['orders'] });
                    queryClient.invalidateQueries({ queryKey: ['order-stats'] });

                    const newOrder = payload.new as any;
                    if (payload.eventType === 'INSERT' && newOrder) {
                        toast.info('New order received!', {
                            description: `Order #${newOrder.id.substring(0, 8)} has been placed.`,
                        });
                    }
                }
            )
            .subscribe();

        // 2. Subscribe to Products
        const productsSubscription = supabase
            .channel('products-realtime')
            .on(
                'postgres_changes',
                { event: '*', table: 'products', schema: 'public' },
                (payload) => {
                    console.log('Product change received:', payload);
                    queryClient.invalidateQueries({ queryKey: ['products'] });
                    const newData = payload.new as any;
                    if (newData?.id) {
                        queryClient.invalidateQueries({ queryKey: ['product', newData.id] });
                    }
                }
            )
            .subscribe();

        // 3. Subscribe to Categories
        const categoriesSubscription = supabase
            .channel('categories-realtime')
            .on(
                'postgres_changes',
                { event: '*', table: 'categories', schema: 'public' },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['categories'] });
                }
            )
            .subscribe();

        // 4. Subscribe to Inventory (Products table stock_quantity)
        // This is handled by the productsSubscription but we could add specific toast for low stock
        const inventorySubscription = supabase
            .channel('inventory-realtime')
            .on(
                'postgres_changes',
                { event: 'UPDATE', table: 'products', schema: 'public' },
                (payload) => {
                    const newData = payload.new as any;
                    const oldData = payload.old as any;
                    if (newData && oldData && newData.stock_quantity <= 5 && oldData.stock_quantity > 5) {
                        toast.warning('Low stock alert!', {
                            description: `${newData.name} is running low (${newData.stock_quantity} left).`,
                        });
                    }
                }
            )
            .subscribe();

        // Cleanup
        return () => {
            supabase.removeChannel(ordersSubscription);
            supabase.removeChannel(productsSubscription);
            supabase.removeChannel(categoriesSubscription);
            supabase.removeChannel(inventorySubscription);
        };
    }, [queryClient]);
};
