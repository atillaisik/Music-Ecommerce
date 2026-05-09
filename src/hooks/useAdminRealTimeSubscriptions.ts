import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { useAdminStore } from '@/lib/adminStore';

/**
 * Admin-only realtime subscriptions: orders, inventory low-stock alerts,
 * audit-trail invalidations. Mounted inside the `/admin/*` subtree so
 * end customers never see "New order received!" toasts or low-stock warnings.
 */
export const useAdminRealTimeSubscriptions = () => {
    const queryClient = useQueryClient();
    const isAdmin = useAdminStore((s) => s.isAuthenticated);

    useEffect(() => {
        if (!isAdmin) return;

        const ordersSubscription = supabase
            .channel('admin-orders-realtime')
            .on(
                'postgres_changes',
                { event: '*', table: 'orders', schema: 'public' },
                (payload) => {
                    queryClient.invalidateQueries({ queryKey: ['orders'] });
                    queryClient.invalidateQueries({ queryKey: ['order-stats'] });

                    const newOrder = payload.new as any;
                    if (payload.eventType === 'INSERT' && newOrder?.id) {
                        toast.info('New order received', {
                            description: `Order #${String(newOrder.id).substring(0, 8)} has been placed.`,
                        });
                    }
                }
            )
            .subscribe();

        const inventorySubscription = supabase
            .channel('admin-inventory-realtime')
            .on(
                'postgres_changes',
                { event: 'UPDATE', table: 'products', schema: 'public' },
                (payload) => {
                    const newData = payload.new as any;
                    const oldData = payload.old as any;
                    if (
                        newData &&
                        oldData &&
                        newData.stock_quantity <= 5 &&
                        oldData.stock_quantity > 5
                    ) {
                        toast.warning('Low stock alert', {
                            description: `${newData.name} is running low (${newData.stock_quantity} left).`,
                        });
                    }
                }
            )
            .subscribe();

        const inventoryLogsSubscription = supabase
            .channel('admin-inventory-logs-realtime')
            .on(
                'postgres_changes',
                { event: 'INSERT', table: 'inventory_logs', schema: 'public' },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['inventory-logs'] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(ordersSubscription);
            supabase.removeChannel(inventorySubscription);
            supabase.removeChannel(inventoryLogsSubscription);
        };
    }, [queryClient, isAdmin]);
};
