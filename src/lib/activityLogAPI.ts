import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { mapSupabaseError } from './apiErrors';

export type ActivityActionType = 'order_status' | 'inventory' | 'review';

export interface ActivityLogEntry {
    id: string;
    action: ActivityActionType;
    entity: string;
    entity_id: string | null;
    summary: string;
    timestamp: string;
}

const ORDER_LIMIT = 50;
const INVENTORY_LIMIT = 50;
const REVIEW_LIMIT = 25;

export const useActivityLog = () => {
    return useQuery({
        queryKey: ['activity-log'],
        queryFn: async (): Promise<ActivityLogEntry[]> => {
            const [orders, inventory, reviews] = await Promise.all([
                supabase
                    .from('order_status_history')
                    .select('id, order_id, status, created_at')
                    .order('created_at', { ascending: false })
                    .limit(ORDER_LIMIT),
                supabase
                    .from('inventory_logs')
                    .select('id, product_id, old_quantity, new_quantity, created_at')
                    .order('created_at', { ascending: false })
                    .limit(INVENTORY_LIMIT),
                supabase
                    .from('product_reviews')
                    .select('id, product_id, user_name, rating, created_at')
                    .order('created_at', { ascending: false })
                    .limit(REVIEW_LIMIT),
            ]);

            if (orders.error) throw mapSupabaseError(orders.error);
            if (inventory.error) throw mapSupabaseError(inventory.error);
            if (reviews.error) throw mapSupabaseError(reviews.error);

            const orderEntries: ActivityLogEntry[] = (orders.data ?? []).map((row: any) => ({
                id: `order-${row.id}`,
                action: 'order_status',
                entity: 'order',
                entity_id: row.order_id,
                summary: `Order #${String(row.order_id).substring(0, 8)} → ${row.status}`,
                timestamp: row.created_at,
            }));

            const inventoryEntries: ActivityLogEntry[] = (inventory.data ?? []).map((row: any) => ({
                id: `inv-${row.id}`,
                action: 'inventory',
                entity: 'product',
                entity_id: row.product_id,
                summary: `Stock changed: ${row.old_quantity} → ${row.new_quantity}`,
                timestamp: row.created_at,
            }));

            const reviewEntries: ActivityLogEntry[] = (reviews.data ?? []).map((row: any) => ({
                id: `rev-${row.id}`,
                action: 'review',
                entity: 'product_review',
                entity_id: row.product_id,
                summary: `${row.user_name} left a ${row.rating}★ review`,
                timestamp: row.created_at,
            }));

            return [...orderEntries, ...inventoryEntries, ...reviewEntries].sort((a, b) =>
                b.timestamp.localeCompare(a.timestamp),
            );
        },
    });
};
