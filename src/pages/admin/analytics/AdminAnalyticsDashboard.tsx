import React, { useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    Package,
    ShoppingCart,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Download,
    Filter,
    AlertTriangle,
    ChevronRight,
    Search
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';
import {
    useAnalyticsMetrics,
    useSalesData,
    useCategoryPerformance,
    useTopProducts,
    useInventoryStatus,
    useLowStockProducts
} from '@/lib/analyticsAPI';
import { formatCurrency } from '@/lib/utils';
import { exportToCSV } from '@/lib/exportUtils';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

const AdminAnalyticsDashboard = () => {
    const [timeRange, setTimeRange] = useState('7d');

    const { data: metrics, isLoading: metricsLoading } = useAnalyticsMetrics();
    const { data: salesData, isLoading: salesLoading } = useSalesData(timeRange);
    const { data: categoryData, isLoading: categoryLoading } = useCategoryPerformance();
    const { data: topProducts, isLoading: topProductsLoading } = useTopProducts();
    const { data: inventoryStatus, isLoading: inventoryLoading } = useInventoryStatus();
    const { data: lowStockProducts, isLoading: lowStockLoading } = useLowStockProducts();

    const handleExport = () => {
        if (salesData) {
            exportToCSV(salesData, `sales_report_${timeRange}_${new Date().toISOString().split('T')[0]}`);
        }
    };

    const formatMetricsValue = (key: string, value: number) => {
        if (key === 'totalRevenue' || key === 'totalInventoryValue' || key === 'averageOrderValue') {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        }
        if (key === 'conversionRate') {
            return `${value}%`;
        }
        return value.toLocaleString();
    };

    if (metricsLoading || salesLoading || categoryLoading || topProductsLoading || inventoryLoading || lowStockLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground/90 font-sans">Analytics Hub</h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Comprehensive performance insights for your music store.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[160px] h-10 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-border/50 rounded-xl">
                            <Calendar className="h-4 w-4 mr-2 opacity-50" />
                            <SelectValue placeholder="Select Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="90d">Last 3 months</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        className="h-10 px-4 rounded-xl border-border/50 bg-white/50 dark:bg-black/20 backdrop-blur-sm shadow-sm hover:shadow-md transition-all active:scale-95"
                        onClick={handleExport}
                        disabled={!salesData}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {metrics && [
                    { title: 'Total Revenue', value: metrics.totalRevenue, icon: DollarSign, color: 'emerald', trend: '+12.5%' },
                    { title: 'Orders', value: metrics.totalOrders, icon: ShoppingCart, color: 'indigo', trend: '+8.2%' },
                    { title: 'Inventory Value', value: metrics.totalInventoryValue, icon: Package, color: 'amber', trend: '+3.1%' },
                    { title: 'Avg Order Value', value: metrics.averageOrderValue, icon: ArrowUpRight, color: 'primary', trend: '+5.4%' }
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="overflow-hidden border-border/40 bg-white/60 dark:bg-white/5 backdrop-blur-md shadow-sm transition-all hover:shadow-lg group">
                            <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform`}>
                                <stat.icon size={80} className={`text-${stat.color}-500`} />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">{stat.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-extrabold tracking-tight font-sans">
                                    {formatMetricsValue(stat.title === 'Avg Order Value' ? 'averageOrderValue' : stat.title.toLowerCase().replace(' ', ''), stat.value)}
                                </div>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <Badge variant="outline" className={`h-5 border-none bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 text-${stat.color === 'primary' ? 'primary' : stat.color + '-600'} text-[10px] font-bold px-1.5`}>
                                        {stat.trend}
                                    </Badge>
                                    <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase">vs last period</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Sales Performance Chart */}
                <Card className="lg:col-span-2 border-border/40 bg-white/50 dark:bg-white/5 backdrop-blur-sm shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Sales Performance</CardTitle>
                            <CardDescription>Revenue and order volume trends</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Revenue</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 600 }}
                                    tickFormatter={(val) => `$${val / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                        fontSize: '11px',
                                        fontWeight: 'bold'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Category Performance */}
                <Card className="border-border/40 bg-white/50 dark:bg-white/5 backdrop-blur-sm shadow-sm">
                    <CardHeader>
                        <CardTitle>Category Insights</CardTitle>
                        <CardDescription>Revenue distribution by category</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="revenue"
                                    nameKey="categoryName"
                                >
                                    {categoryData?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full px-4">
                            {categoryData?.slice(0, 4).map((cat, idx) => (
                                <div key={cat.categoryName} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase truncate flex-1">{cat.categoryName}</span>
                                    <span className="text-[10px] font-bold">{Math.round((cat.revenue / (metrics?.totalRevenue || 1)) * 100)}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Top Products */}
                <Card className="border-border/40 bg-white/50 dark:bg-white/5 backdrop-blur-sm shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Bestselling Products</CardTitle>
                            <CardDescription>Top performing instruments this period</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs font-bold gap-1 transition-all active:scale-95">
                            Full List
                            <ChevronRight className="h-3 w-3" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            {topProducts?.slice(0, 5).map((product, idx) => (
                                <div key={product.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold leading-none mb-1 group-hover:text-primary transition-colors cursor-pointer">{product.name}</p>
                                            <p className="text-[10px] text-muted-foreground font-semibold uppercase">{product.unitsSold} units sold</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-extrabold">{formatCurrency(product.revenue)}</p>
                                        <div className={`flex items-center justify-end gap-1 ${product.trend === 'up' ? 'text-emerald-500' : product.trend === 'down' ? 'text-rose-500' : 'text-amber-500'}`}>
                                            {product.trend === 'up' ? <ArrowUpRight size={12} /> : product.trend === 'down' ? <ArrowDownRight size={12} /> : null}
                                            <span className="text-[10px] font-bold uppercase">{product.trend === 'stable' ? 'Stable' : product.trend}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Inventory Alerts */}
                <Card className="border-border/40 bg-white/50 dark:bg-white/5 backdrop-blur-sm shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                Inventory Alerts
                            </CardTitle>
                            <CardDescription>Products running low on stock</CardDescription>
                        </div>
                        <Badge variant="outline" className="h-6 border-amber-500/30 bg-amber-500/10 text-amber-600 font-bold px-2 uppercase text-[10px]">
                            {lowStockProducts?.length || 0} Critical
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {lowStockProducts && lowStockProducts.length > 0 ? (
                                lowStockProducts.slice(0, 5).map((p) => (
                                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-black/10 border border-border/20 group hover:border-amber-500/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${p.stock_quantity === 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                <Package size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold mb-0.5">{p.name}</p>
                                                <p className="text-[10px] text-muted-foreground font-medium uppercase">{(p.category as any)?.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <Badge className={`${p.stock_quantity === 0 ? 'bg-rose-500/20 text-rose-600' : 'bg-amber-500/20 text-amber-600'} border-none text-[10px] font-extrabold h-5`}>
                                                {p.stock_quantity} Left
                                            </Badge>
                                            <button className="text-[9px] font-bold uppercase text-primary mt-1 hover:underline">Quick Restock</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                                        <Package size={24} />
                                    </div>
                                    <p className="text-sm font-bold">All stock healthy</p>
                                    <p className="text-xs text-muted-foreground mt-1">No low stock alerts at this time.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-border/20">
                        <Button variant="ghost" className="w-full text-xs font-bold text-muted-foreground hover:text-foreground active:scale-95 transition-all h-8">
                            View Inventory Management
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default AdminAnalyticsDashboard;
