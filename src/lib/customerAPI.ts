import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { Customer } from '../types/customer';

export const useCustomers = () => {
    return useQuery({
        queryKey: ['customers'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('customer_email, customer_name, total_amount, created_at')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching customer data from orders:', error);
                return [] as Customer[];
            }

            // Group by email
            const customerMap = new Map<string, Customer>();

            data.forEach(order => {
                const email = order.customer_email;
                if (!customerMap.has(email)) {
                    customerMap.set(email, {
                        email: email,
                        name: order.customer_name,
                        total_orders: 1,
                        total_spent: Number(order.total_amount),
                        last_order_date: order.created_at,
                        // Using the first order date as registration date since we don't have a users table
                        created_at: order.created_at
                    });
                } else {
                    const customer = customerMap.get(email)!;
                    customer.total_orders += 1;
                    customer.total_spent += Number(order.total_amount);
                    // Update registration date to the earliest order
                    if (new Date(order.created_at) < new Date(customer.created_at!)) {
                        customer.created_at = order.created_at;
                    }
                }
            });

            return Array.from(customerMap.values());
        }
    });
};

export const useCustomerDetail = (email: string | undefined) => {
    return useQuery({
        queryKey: ['customer', email],
        queryFn: async () => {
            if (!email) return null;

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('customer_email', email)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching customer orders:', error);
                throw error;
            }

            if (data.length === 0) return null;

            const customer = {
                email: email,
                name: data[0].customer_name,
                total_orders: data.length,
                total_spent: data.reduce((sum, order) => sum + Number(order.total_amount), 0),
                last_order_date: data[0].created_at,
                created_at: data[data.length - 1].created_at,
                orders: data
            };

            return customer;
        },
        enabled: !!email
    });
};
