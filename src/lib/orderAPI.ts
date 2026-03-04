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

export const useUserOrders = (email: string | undefined) => {
    return useQuery({
        queryKey: ['orders', 'user', email],
        queryFn: async () => {
            if (!email) return [] as Order[];

            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*, product:products(*))')
                .eq('customer_email', email)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching user orders:', error);
                return [] as Order[];
            }

            return data as Order[];
        },
        enabled: !!email
    });
};

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (orderData: {
            customer_name: string;
            customer_email: string;
            total_amount: number;
            shipping_address: string;
            items: { product_id: string; quantity: number; price_at_purchase: number }[];
            payment_method?: string;
            user_id?: string;
        }) => {
            // 1. Create the order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    customer_name: orderData.customer_name,
                    customer_email: orderData.customer_email,
                    total_amount: orderData.total_amount,
                    shipping_address: orderData.shipping_address,
                    payment_method: orderData.payment_method || 'Credit Card',
                    status: 'pending',
                    user_id: orderData.user_id // Added user_id
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create order items
            const orderItems = orderData.items.map(item => ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price_at_purchase: item.price_at_purchase
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            return order;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order-stats'] });
        }
    });
};

