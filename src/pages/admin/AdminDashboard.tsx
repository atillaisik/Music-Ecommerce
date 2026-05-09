import React from 'react';
import { Link } from 'react-router-dom';
import {
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    ArrowUpRight,
    ShoppingBag,
    CreditCard,
    Layers,
    Activity,
    ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import { motion } from 'framer-motion';
import {
    useAnalyticsMetrics,
    useSalesData,
    useRecentOrdersFeed,
    useInventoryStatus,
} from '@/lib/analyticsAPI';

const formatCurrency = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const formatRelative = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

const AdminDashboard = () => {
    const { data: metrics, isLoading: metricsLoading } = useAnalyticsMetrics();
    const { data: salesData = [], isLoading: salesLoading } = useSalesData('7d');
    const { data: recentOrders = [], isLoading: ordersLoading } = useRecentOrdersFeed(5);
    const { data: inventory } = useInventoryStatus();

    const stats = metrics
        ? [
              {
                  title: 'Total Revenue',
                  value: formatCurrency(metrics.totalRevenue),
                  change: `${metrics.totalOrders} order${metrics.totalOrders === 1 ? '' : 's'} fulfilled`,
                  icon: CreditCard,
                  color: 'primary',
              },
              {
                  title: 'Total Orders',
                  value: metrics.totalOrders.toLocaleString(),
                  change: `Avg ${formatCurrency(metrics.averageOrderValue)} / order`,
                  icon: ShoppingBag,
                  color: 'emerald',
              },
              {
                  title: 'Total Products',
                  value: metrics.totalProducts.toLocaleString(),
                  change: `${formatCurrency(metrics.totalInventoryValue)} inventory value`,
                  icon: Package,
                  color: 'indigo',
              },
              {
                  title: 'Unique Customers',
                  value: (metrics.uniqueCustomers ?? 0).toLocaleString(),
                  change: 'Distinct emails on orders',
                  icon: Users,
                  color: 'amber',
              },
          ]
        : [];

    const periodTotal = salesData.reduce((acc, d) => acc + d.revenue, 0);
    const periodAvg = salesData.length > 0 ? periodTotal / salesData.length : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground/90 font-sans">
                        Dashboard Overview
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">
                        Welcome back. Live data from your Supabase project.
                    </p>
                </div>
                <Button asChild variant="outline" size="sm" className="h-9 px-4 rounded-full text-xs font-semibold">
                    <Link to="/admin/analytics">
                        <Activity className="h-3.5 w-3.5 mr-2" />
                        Full analytics
                    </Link>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {metricsLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                          <Card key={i} className="border-border/40 shadow-sm">
                              <CardContent className="p-6 space-y-3">
                                  <Skeleton className="h-4 w-24" />
                                  <Skeleton className="h-7 w-32" />
                                  <Skeleton className="h-3 w-40" />
                              </CardContent>
                          </Card>
                      ))
                    : stats.map((stat, idx) => (
                          <motion.div
                              key={stat.title}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05, duration: 0.4 }}
                          >
                              <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden bg-card">
                                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                      <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                          {stat.title}
                                      </CardTitle>
                                      <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                          <stat.icon className="h-4 w-4" />
                                      </div>
                                  </CardHeader>
                                  <CardContent className="pt-2">
                                      <div className="text-2xl font-bold tracking-tight font-sans">{stat.value}</div>
                                      <p className="text-[10px] font-bold flex items-center text-muted-foreground mt-1">
                                          <TrendingUp className="h-3 w-3 mr-1" />
                                          {stat.change}
                                      </p>
                                  </CardContent>
                              </Card>
                          </motion.div>
                      ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-border/40 bg-card shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Revenue (last 7 days)</CardTitle>
                                <CardDescription className="text-xs font-medium mt-0.5">
                                    Daily revenue from non-cancelled orders.
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="px-2 py-0 h-6 border-primary/20 text-primary font-bold bg-primary/5 text-[10px] uppercase">
                                Weekly
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-2 pt-4">
                        <div className="h-[300px] w-full">
                            {salesLoading ? (
                                <Skeleton className="h-full w-full rounded-lg" />
                            ) : salesData.every((d) => d.revenue === 0) ? (
                                <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                                    No revenue yet — orders placed in the last 7 days will appear here.
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={salesData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                        <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                                        <ChartTooltip
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: '1px solid hsl(var(--border))',
                                                background: 'hsl(var(--card))',
                                                color: 'hsl(var(--card-foreground))',
                                                fontSize: '11px',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between pt-4 border-t border-border/20">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
                                    Average daily
                                </span>
                                <span className="text-sm font-bold">{formatCurrency(periodAvg)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
                                    Total period
                                </span>
                                <span className="text-sm font-bold">{formatCurrency(periodTotal)}</span>
                            </div>
                        </div>
                        <Button asChild variant="link" className="text-xs h-7 px-0 font-bold group">
                            <Link to="/admin/analytics">
                                Full analytics report
                                <ArrowUpRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="lg:col-span-3 border-border/40 bg-card text-card-foreground shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent orders</CardTitle>
                        <CardDescription className="text-xs font-medium mt-0.5">
                            Latest orders placed across the storefront.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {ordersLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-3 w-3/4" />
                                            <Skeleton className="h-2 w-1/2" />
                                        </div>
                                    </div>
                                ))
                            ) : recentOrders.length === 0 ? (
                                <p className="text-xs text-muted-foreground py-8 text-center">
                                    No orders yet.
                                </p>
                            ) : (
                                recentOrders.map((order: any) => (
                                    <div key={order.id} className="flex items-start gap-3 group">
                                        <div className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 bg-primary/10 border-primary/20 text-primary">
                                            <ShoppingCart className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <Link
                                                to={`/admin/orders/${order.id}`}
                                                className="text-xs font-semibold leading-tight group-hover:text-primary transition-colors truncate"
                                            >
                                                Order #{String(order.id).substring(0, 8)} · {formatCurrency(Number(order.total_amount))}
                                            </Link>
                                            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                                {order.customer_name} · {order.customer_email}
                                            </p>
                                        </div>
                                        <span className="text-[9px] text-muted-foreground/60 font-bold whitespace-nowrap mt-1 uppercase">
                                            {formatRelative(order.created_at)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-border/20">
                        <Button asChild size="sm" variant="ghost" className="w-full text-xs font-bold gap-2">
                            <Link to="/admin/orders">
                                View all orders
                                <ChevronRight className="h-3 w-3" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-border/40 shadow-sm bg-card text-card-foreground p-6">
                    <div className="mb-4 w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center border border-indigo-500/20">
                        <Package className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">Inventory status</h3>
                    <p className="text-xs text-muted-foreground font-medium mb-4">
                        Stock health snapshot.
                    </p>
                    {inventory ? (
                        <div className="flex flex-wrap gap-2">
                            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                {inventory.wellStocked} well stocked
                            </Badge>
                            <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                                {inventory.lowStock} low
                            </Badge>
                            <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                                {inventory.outOfStock} out
                            </Badge>
                        </div>
                    ) : (
                        <Skeleton className="h-5 w-32" />
                    )}
                </Card>
                <Card className="border-border/40 shadow-sm bg-card text-card-foreground p-6">
                    <div className="mb-4 w-12 h-12 rounded-2xl bg-fuchsia-500/10 text-fuchsia-600 flex items-center justify-center border border-fuchsia-500/20">
                        <Layers className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">Category insights</h3>
                    <p className="text-xs text-muted-foreground font-medium mb-4">
                        Drill into per-category performance.
                    </p>
                    <Button asChild variant="outline" size="sm">
                        <Link to="/admin/analytics">View report</Link>
                    </Button>
                </Card>
                <Card className="border-border/40 shadow-sm bg-card text-card-foreground p-6">
                    <div className="mb-4 w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                        <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">Customer list</h3>
                    <p className="text-xs text-muted-foreground font-medium mb-4">
                        Recent buyers + lifetime value.
                    </p>
                    <Button asChild variant="outline" size="sm">
                        <Link to="/admin/customers">Open customers</Link>
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
