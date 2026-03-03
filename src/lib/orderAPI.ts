import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { Order, OrderStatus } from '../types/order';
import { toast } from 'sonner';

export const useOrders = (filters: {
    status?: OrderStatus;
    search?: string;
    sort?: string;
} = {}) => {
    return useQuery({
        queryKey: ['orders', filters],
        queryFn: async () => {
            let query = supabase
                .from('orders')
                .select('*');

            if (filters.status) {
                query = query.eq('status', filters.status);
            }

            if (filters.search) {
                // Search by email or name
                query = query.or(`customer_email.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%`);
            }

            if (filters.sort) {
                const [column, order] = filters.sort.split(':');
                query = query.order(column, { ascending: order === 'asc' });
            } else {
                query = query.order('created_at', { ascending: false });
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching orders:', error);
                // Fallback to empty array if table doesn't exist yet or other error
                return [] as Order[];
            }

            return data as Order[];
        }
    });
};

export const useOrder = (id: string | undefined) => {
    return useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            if (!id) return null;

            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*, product:products(*))')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching order details:', error);
                throw error;
            }

            return data as Order;
        },
        enabled: !!id
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
            const { data, error } = await supabase
                .from('orders')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order', data.id] });
            toast.success(`Order status updated to ${data.status}`);
        },
        onError: (error: any) => {
            toast.error(`Failed to update order status: ${error.message}`);
        }
    });
};

export const useOrderStats = () => {
    return useQuery({
        queryKey: ['order-stats'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('status');

            if (error) {
                return {
                    pending: 0,
                    completed: 0,
                    cancelled: 0,
                    total: 0
                };
            }

            const stats = {
                pending: data.filter(o => o.status === 'pending').length,
                completed: data.filter(o => o.status === 'completed').length,
                cancelled: data.filter(o => o.status === 'cancelled').length,
                total: data.length
            };

            return stats;
        }
    });
};
