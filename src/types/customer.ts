export interface Customer {
    email: string;
    name: string;
    total_orders: number;
    total_spent: number;
    last_order_date: string;
    created_at?: string;
}
