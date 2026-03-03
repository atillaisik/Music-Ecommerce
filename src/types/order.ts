import { Product } from './product';

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Order {
    id: string;
    customer_email: string;
    customer_name: string;
    total_amount: number;
    status: OrderStatus;
    payment_method?: string;
    shipping_address?: string;
    created_at: string;
    updated_at: string;
    // Joined data
    order_items?: OrderItem[];
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price_at_purchase: number;
    created_at: string;
    // Joined data
    product?: Product;
}
