import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { Order, OrderStatus } from '../types/order';
import { toast } from 'sonner';
import { mapSupabaseError } from './apiErrors';
import { sendTransactionalEmail } from './transactionalEmail';

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
                query = query.or(`customer_email.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%`);
            }

            if (filters.sort) {
                const [column, order] = filters.sort.split(':');
                query = query.order(column, { ascending: order === 'asc' });
            } else {
                query = query.order('created_at', { ascending: false });
            }

            const { data, error } = await query;
            if (error) throw mapSupabaseError(error);
            return (data ?? []) as Order[];
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

            if (error) throw mapSupabaseError(error);
            return data as Order;
        },
        enabled: !!id
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            id,
            status,
            tracking_number,
            carrier,
        }: {
            id: string;
            status: OrderStatus;
            tracking_number?: string;
            carrier?: string;
        }) => {
            const { data, error } = await supabase
                .from('orders')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw mapSupabaseError(error);
            return { ...data, _ctx: { tracking_number, carrier } };
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order', data.id] });
            toast.success(`Order status updated to ${data.status}`);
            // Trigger transactional email if applicable.
            if (data.status === 'completed' && data._ctx?.tracking_number) {
                void sendTransactionalEmail({
                    type: 'shipping_notification',
                    order_id: data.id,
                    tracking_number: data._ctx.tracking_number,
                    carrier: data._ctx.carrier ?? 'Anlaşmalı kargo',
                });
            }
        },
        onError: (error: any) => {
            toast.error(`Failed to update order status: ${error.message ?? 'unknown error'}`);
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

            if (error) throw mapSupabaseError(error);

            return {
                pending: data.filter(o => o.status === 'pending').length,
                completed: data.filter(o => o.status === 'completed').length,
                cancelled: data.filter(o => o.status === 'cancelled').length,
                total: data.length,
            };
        }
    });
};

export const useUserOrders = (email: string | undefined) => {
    return useQuery({
        queryKey: ['orders', 'user', email],
        queryFn: async () => {
            if (!email) return [] as Order[];

            const { data: { session } } = await supabase.auth.getSession();
            let query = supabase
                .from('orders')
                .select('*, order_items(*, product:products(*))')
                .order('created_at', { ascending: false });

            if (session?.user) {
                query = query.or(`user_id.eq.${session.user.id},customer_email.eq.${email}`);
            } else {
                query = query.eq('customer_email', email);
            }

            const { data, error } = await query;
            if (error) throw mapSupabaseError(error);
            return (data ?? []) as Order[];
        },
        enabled: !!email
    });
};

export interface CreateOrderInput {
    customer_name: string;
    customer_email: string;
    total_amount: number;
    shipping_address: string;
    items: { product_id: string; quantity: number; price_at_purchase: number }[];
    payment_method?: string;
    discount_code?: string;
}

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: CreateOrderInput) => {
            if (!input.customer_email?.trim()) throw new Error('customer_email is required');
            if (!input.customer_name?.trim()) throw new Error('customer_name is required');
            if (!input.shipping_address?.trim()) throw new Error('shipping_address is required');
            if (!input.items?.length) throw new Error('Cart is empty');

            const { data: { session } } = await supabase.auth.getSession();
            const user_id = session?.user?.id ?? null;

            const { data, error } = await supabase.rpc('create_order', {
                payload: {
                    user_id,
                    customer_name: input.customer_name.trim(),
                    customer_email: input.customer_email.trim(),
                    total_amount: input.total_amount,
                    shipping_address: input.shipping_address.trim(),
                    payment_method: input.payment_method ?? 'Credit Card',
                    items: input.items,
                    discount_code: input.discount_code?.trim() || null,
                },
            });

            if (error) throw mapSupabaseError(error);
            if (!data) throw new Error('create_order returned no order id');
            return { id: data as string };
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order-stats'] });
            // Fire order confirmation email (non-blocking)
            void sendTransactionalEmail({ type: 'order_confirmation', order_id: data.id });
        },
    });
};
