import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { mapSupabaseError } from './apiErrors';
import {
    AnalyticsMetrics,
    SalesData,
    CategoryPerformance,
    TopProduct,
    InventoryStatus,
} from '../types/analytics';

const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
};

const formatDay = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const useAnalyticsMetrics = () => {
    return useQuery({
        queryKey: ['analytics-metrics'],
        queryFn: async (): Promise<AnalyticsMetrics> => {
            const [{ data: products, error: productsError }, { data: orders, error: ordersError }] =
                await Promise.all([
                    supabase.from('products').select('price, stock_quantity'),
                    supabase.from('orders').select('total_amount, customer_email').neq('status', 'cancelled'),
                ]);

            if (productsError) throw mapSupabaseError(productsError);
            if (ordersError) throw mapSupabaseError(ordersError);

            const totalProducts = products?.length ?? 0;
            const totalInventoryValue = (products ?? []).reduce(
                (acc, p) => acc + Number(p.price) * Number(p.stock_quantity || 0),
                0,
            );

            const orderRows = orders ?? [];
            const totalOrders = orderRows.length;
            const totalRevenue = orderRows.reduce((acc, o) => acc + Number(o.total_amount), 0);
            const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
            const uniqueCustomers = new Set(orderRows.map((o) => o.customer_email).filter(Boolean)).size;

            return {
                totalProducts,
                totalInventoryValue,
                totalOrders,
                totalRevenue,
                averageOrderValue,
                conversionRate: 0,
                uniqueCustomers,
            } as AnalyticsMetrics & { uniqueCustomers: number };
        },
    });
};

export const useSalesData = (timeRange: '7d' | '30d' | '90d' = '7d') => {
    return useQuery({
        queryKey: ['sales-data', timeRange],
        queryFn: async (): Promise<SalesData[]> => {
            const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
            const since = startOfDay(new Date(Date.now() - days * 24 * 60 * 60 * 1000));

            const { data, error } = await supabase
                .from('orders')
                .select('created_at, total_amount, status')
                .gte('created_at', since.toISOString())
                .neq('status', 'cancelled');

            if (error) throw mapSupabaseError(error);

            const buckets: Record<string, { revenue: number; orders: number }> = {};
            for (let i = days; i >= 0; i--) {
                const d = startOfDay(new Date(Date.now() - i * 24 * 60 * 60 * 1000));
                buckets[d.toISOString()] = { revenue: 0, orders: 0 };
            }

            (data ?? []).forEach((row) => {
                const key = startOfDay(new Date(row.created_at)).toISOString();
                if (!buckets[key]) buckets[key] = { revenue: 0, orders: 0 };
                buckets[key].revenue += Number(row.total_amount);
                buckets[key].orders += 1;
            });

            return Object.entries(buckets)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([iso, b]) => ({
                    date: formatDay(new Date(iso)),
                    revenue: Math.round(b.revenue * 100) / 100,
                    orders: b.orders,
                }));
        },
    });
};

export const useCategoryPerformance = () => {
    return useQuery({
        queryKey: ['category-performance'],
        queryFn: async (): Promise<CategoryPerformance[]> => {
            const { data, error } = await supabase
                .from('order_items')
                .select(
                    'quantity, price_at_purchase, product:products(category:categories(id, name))',
                );

            if (error) throw mapSupabaseError(error);

            const totals: Record<string, { categoryName: string; revenue: number; unitsSold: number }> = {};
            (data ?? []).forEach((row: any) => {
                const cat = row.product?.category;
                if (!cat) return;
                const key = cat.id;
                if (!totals[key]) totals[key] = { categoryName: cat.name, revenue: 0, unitsSold: 0 };
                totals[key].revenue += Number(row.price_at_purchase) * Number(row.quantity);
                totals[key].unitsSold += Number(row.quantity);
            });

            return Object.values(totals).sort((a, b) => b.revenue - a.revenue);
        },
    });
};

export const useTopProducts = () => {
    return useQuery({
        queryKey: ['top-products'],
        queryFn: async (): Promise<TopProduct[]> => {
            const { data, error } = await supabase
                .from('order_items')
                .select('quantity, price_at_purchase, product:products(id, name)');

            if (error) throw mapSupabaseError(error);

            const totals: Record<string, { id: string; name: string; unitsSold: number; revenue: number }> = {};
            (data ?? []).forEach((row: any) => {
                const product = row.product;
                if (!product) return;
                const key = product.id;
                if (!totals[key]) totals[key] = { id: product.id, name: product.name, unitsSold: 0, revenue: 0 };
                totals[key].unitsSold += Number(row.quantity);
                totals[key].revenue += Number(row.price_at_purchase) * Number(row.quantity);
            });

            return Object.values(totals)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 10)
                .map((p) => ({ ...p, trend: 'stable' as const }));
        },
    });
};

export const useInventoryStatus = () => {
    return useQuery({
        queryKey: ['inventory-status'],
        queryFn: async (): Promise<InventoryStatus> => {
            const { data, error } = await supabase
                .from('products')
                .select('stock_quantity');

            if (error) throw mapSupabaseError(error);

            const products = data ?? [];
            const lowStock = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 5).length;
            const outOfStock = products.filter((p) => (p.stock_quantity || 0) <= 0).length;
            const wellStocked = products.filter((p) => p.stock_quantity > 5).length;

            return { lowStock, outOfStock, wellStocked };
        },
    });
};

export const useLowStockProducts = () => {
    return useQuery({
        queryKey: ['low-stock-products'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*, category:categories(name)')
                .lte('stock_quantity', 5)
                .order('stock_quantity', { ascending: true });

            if (error) throw mapSupabaseError(error);
            return data ?? [];
        },
    });
};

export const useRecentOrdersFeed = (limit = 5) => {
    return useQuery({
        queryKey: ['recent-orders-feed', limit],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('id, customer_email, customer_name, total_amount, status, created_at')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw mapSupabaseError(error);
            return data ?? [];
        },
    });
};
