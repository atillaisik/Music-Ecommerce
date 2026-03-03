export interface AnalyticsMetrics {
    totalProducts: number;
    totalInventoryValue: number;
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    conversionRate: number;
}

export interface SalesData {
    date: string;
    revenue: number;
    orders: number;
}

export interface CategoryPerformance {
    categoryName: string;
    revenue: number;
    unitsSold: number;
}

export interface TopProduct {
    id: string;
    name: string;
    unitsSold: number;
    revenue: number;
    trend: 'up' | 'down' | 'stable';
}

export interface BrandPerformance {
    brandName: string;
    revenue: number;
    inventoryLevel: number;
}

export interface InventoryStatus {
    lowStock: number;
    outOfStock: number;
    wellStocked: number;
}
