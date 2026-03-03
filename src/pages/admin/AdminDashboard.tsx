import React from 'react';
import {
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    TrendingDown as TrendingDownIcon,
    ShoppingBag,
    CreditCard,
    Layers,
    Activity,
    ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { motion } from 'framer-motion';

const data = [
    { name: 'Mon', revenue: 4000, orders: 24, customers: 12 },
    { name: 'Tue', revenue: 3000, orders: 18, customers: 15 },
    { name: 'Wed', revenue: 2000, orders: 15, customers: 10 },
    { name: 'Thu', revenue: 2780, orders: 20, customers: 18 },
    { name: 'Fri', revenue: 1890, orders: 12, customers: 9 },
    { name: 'Sat', revenue: 2390, orders: 16, customers: 22 },
    { name: 'Sun', revenue: 3490, orders: 22, customers: 24 },
];

const stats = [
    {
        title: "Total Revenue",
        value: "$45,231.89",
        change: "+20.1% from last month",
        icon: CreditCard,
        trend: "up",
        color: "primary"
    },
    {
        title: "Total Orders",
        value: "+2350",
        change: "+180.1% from last month",
        icon: ShoppingBag,
        trend: "up",
        color: "emerald"
    },
    {
        title: "Total Products",
        value: "142",
        change: "+12 new this week",
        icon: Package,
        trend: "up",
        color: "indigo"
    },
    {
        title: "Total Customers",
        value: "+12,234",
        change: "-4.1% from last month",
        icon: Users,
        trend: "down",
        color: "amber"
    },
];

const AdminDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground/90 font-sans">Dashboard Overiew</h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Welcome back. Here's what's happening today at ARASOUNDS.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9 px-4 rounded-full border-border/50 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-white/5 transition-all active:scale-95 text-xs font-semibold">
                        <Activity className="h-3.5 w-3.5 mr-2" />
                        Live Activity
                    </Button>
                    <Button size="sm" className="h-9 px-4 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-95 text-xs font-bold">
                        Download Reports
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
                    >
                        <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-sm">
                            <div className={`absolute top-0 left-0 w-1 h-full bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'} opacity-30`} />
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">{stat.title}</CardTitle>
                                <div className={`p-2 rounded-xl bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 text-${stat.color === 'primary' ? 'primary' : stat.color + '-600'} group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="text-2xl font-bold tracking-tight font-sans">{stat.value}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className={`text-[10px] font-bold flex items-center ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {stat.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                        {stat.change}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4 border-border/40 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Revenue Analytics</CardTitle>
                                <CardDescription className="text-xs font-medium mt-0.5">Performance tracking for the past 7 days</CardDescription>
                            </div>
                            <Badge variant="outline" className="px-2 py-0 h-6 border-primary/20 text-primary font-bold bg-primary/5 text-[10px] uppercase">Weekly View</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pl-2 pt-4">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        fontWeight="bold"
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        fontWeight="bold"
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <ChartTooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between pt-4 border-t border-border/20">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Average Daily</span>
                                <span className="text-sm font-bold">$2,864.28</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Total Period</span>
                                <span className="text-sm font-bold">$20,050.00</span>
                            </div>
                        </div>
                        <Button variant="link" className="text-xs h-7 px-0 font-bold group">
                            Full analytics report
                            <ArrowUpRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="lg:col-span-3 border-border/40 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                    <CardHeader>
                        <CardTitle>Live Feed</CardTitle>
                        <CardDescription className="text-xs font-medium mt-0.5">Recent system activity and orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-start gap-3 group">
                                    <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300 ${i % 2 === 0 ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' : 'bg-primary/10 border-primary/20 text-primary'
                                        }`}>
                                        {i % 2 === 0 ? <Users className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <p className="text-xs font-semibold leading-tight group-hover:text-primary transition-colors cursor-pointer">
                                            {i % 2 === 0 ? 'New customer registered' : 'Order #12334 placed'}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 font-medium leading-relaxed">
                                            {i % 2 === 0 ? 'sarah.jones@example.com signed up' : 'Aras Sounds Jazz Bass - $1,299.00'}
                                        </p>
                                    </div>
                                    <span className="text-[9px] text-muted-foreground/60 font-bold whitespace-nowrap mt-1 uppercase">2m ago</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-border/20">
                        <Button size="sm" variant="ghost" className="w-full text-xs font-bold gap-2 text-muted-foreground hover:text-foreground active:scale-95 transition-all">
                            View all activity
                            <ChevronRight className="h-3 w-3" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-300 bg-white/50 backdrop-blur-sm group cursor-pointer overflow-hidden p-6">
                    <div className="mb-4 w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center border border-indigo-500/20 group-hover:scale-110 transition-transform">
                        <Package className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-indigo-600 transition-colors">Inventory Status</h3>
                    <p className="text-xs text-muted-foreground font-medium mb-4">Monitor stock levels and warehouse distribution.</p>
                    <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500/20 text-emerald-600 border-none text-[10px] hover:bg-emerald-500/30">Stable</Badge>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">Updated 4h ago</span>
                    </div>
                </Card>
                <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-300 bg-white/50 backdrop-blur-sm group cursor-pointer overflow-hidden p-6">
                    <div className="mb-4 w-12 h-12 rounded-2xl bg-fuchsia-500/10 text-fuchsia-600 flex items-center justify-center border border-fuchsia-500/20 group-hover:scale-110 transition-transform">
                        <Layers className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-fuchsia-600 transition-colors">Category Insights</h3>
                    <p className="text-xs text-muted-foreground font-medium mb-4">Detailed views on category performance and growth.</p>
                    <div className="flex items-center gap-2">
                        <Badge className="bg-primary/20 text-primary border-none text-[10px] hover:bg-primary/30">Growing</Badge>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">98% coverage</span>
                    </div>
                </Card>
                <Card className="border-border/40 shadow-sm hover:shadow-md transition-all duration-300 bg-white/50 backdrop-blur-sm group cursor-pointer overflow-hidden p-6">
                    <div className="mb-4 w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                        <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-emerald-600 transition-colors">Customer Metrics</h3>
                    <p className="text-xs text-muted-foreground font-medium mb-4">Retention, acquisition and churn rate analytics.</p>
                    <div className="flex items-center gap-2">
                        <Badge className="bg-amber-500/20 text-amber-600 border-none text-[10px] hover:bg-amber-500/30">Active</Badge>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">12.4k tracked</span>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
