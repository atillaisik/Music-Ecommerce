import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
    ChevronLeft,
    User,
    Mail,
    ShoppingBag,
    CreditCard,
    Calendar,
    ArrowUpRight,
    Loader2,
    AlertCircle,
    MapPin,
    Clock,
    BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { useCustomerDetail } from '@/lib/customerAPI';

const AdminCustomerDetail = () => {
    const { email } = useParams<{ email: string }>();
    const navigate = useNavigate();
    const decodedEmail = email ? decodeURIComponent(email) : undefined;
    const { data: customer, isLoading, isError } = useCustomerDetail(decodedEmail);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse font-sans">Compiling Purchase History...</p>
            </div>
        );
    }

    if (isError || !customer) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                    <AlertCircle className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold font-sans">Customer Insights Unavailable</h2>
                <p className="text-muted-foreground max-w-md text-center text-sm">We couldn't retrieve the purchase history for this email address.</p>
                <Button onClick={() => navigate('/admin/customers')} className="mt-4 font-bold uppercase tracking-widest rounded-xl px-10">Return to Grid</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/customers')} className="h-10 w-10 rounded-full border border-border/50 bg-white/50 backdrop-blur-sm shadow-sm ring-1 ring-black/5 hover:bg-white transition-all active:scale-95">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground/90 font-sans">Full History</h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Detailed purchase behavior and interaction data.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <Card className="lg:col-span-1 border-border/40 shadow-xl shadow-black/5 ring-1 ring-black/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm overflow-hidden sticky top-6">
                    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-indigo-500/20" />
                    <CardHeader className="relative pt-12">
                        <div className="h-20 w-20 rounded-2xl bg-white dark:bg-black/40 border-4 border-white dark:border-black/50 shadow-xl flex items-center justify-center text-primary mb-4 mx-auto md:mx-0">
                            <User className="h-10 w-10" />
                        </div>
                        <CardTitle className="text-2xl font-bold font-sans">{customer.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-[10px] uppercase font-black border-primary/20 text-primary bg-primary/5">Elite Customer</Badge>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm font-medium opacity-80 group cursor-pointer hover:text-primary transition-colors">
                                <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                <a href={`mailto:${customer.email}`}>{customer.email}</a>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium opacity-80">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{customer.orders[0]?.shipping_address || 'Address Hidden'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm font-medium opacity-80">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>First seen: {new Date(customer.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-border/20 pt-6">
                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col gap-1 items-center justify-center text-center">
                                <ShoppingBag className="h-4 w-4 text-primary opacity-60 mb-1" />
                                <span className="text-xl font-bold font-sans tracking-tight">{customer.total_orders}</span>
                                <span className="text-[10px] uppercase font-black text-muted-foreground/60 leading-none">Total Orders</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex flex-col gap-1 items-center justify-center text-center">
                                <CreditCard className="h-4 w-4 text-indigo-500 opacity-60 mb-1" />
                                <span className="text-xl font-bold font-sans tracking-tight">${customer.total_spent.toLocaleString()}</span>
                                <span className="text-[10px] uppercase font-black text-muted-foreground/60 leading-none">Total Spent</span>
                            </div>
                        </div>

                        <Button className="w-full rounded-xl h-11 font-bold uppercase tracking-widest text-xs gap-2 shadow-lg shadow-primary/20 shadow-indigo-500/10 group active:scale-95 transition-all">
                            <Mail className="h-4 w-4" />
                            Direct Message
                        </Button>
                    </CardContent>
                </Card>

                {/* Orders History */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border/40 shadow-xl shadow-black/5 ring-1 ring-black/5 bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="font-sans font-bold text-xl">System Interaction Log</CardTitle>
                                    <CardDescription className="text-xs font-semibold mt-1">Detailed list of every transaction performed.</CardDescription>
                                </div>
                                <BarChart3 className="h-5 w-5 text-muted-foreground opacity-30" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30 font-sans">
                                    <TableRow className="border-border/20 px-6">
                                        <TableHead className="uppercase tracking-widest text-[9px] font-black pl-6">Order ID</TableHead>
                                        <TableHead className="uppercase tracking-widest text-[9px] font-black">Date</TableHead>
                                        <TableHead className="uppercase tracking-widest text-[9px] font-black">Total</TableHead>
                                        <TableHead className="uppercase tracking-widest text-[9px] font-black">Status</TableHead>
                                        <TableHead className="w-[80px] text-right pr-6"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customer.orders.map((order) => (
                                        <TableRow key={order.id} className="border-border/10 hover:bg-primary/5 transition-colors group">
                                            <TableCell className="font-mono font-bold text-[10px] opacity-60 pl-6 group-hover:text-primary group-hover:opacity-100 transition-all">
                                                #{order.id.substring(0, 10)}
                                            </TableCell>
                                            <TableCell className="text-xs font-bold font-sans opacity-70">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="h-3 w-3 opacity-50" />
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-black text-sm tracking-tight font-sans">
                                                ${Number(order.total_amount).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                {order.status === 'completed' ? (
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] font-bold uppercase tracking-wider w-fit">
                                                        Delivered
                                                    </div>
                                                ) : order.status === 'pending' ? (
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[9px] font-bold uppercase tracking-wider w-fit">
                                                        Processing
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[9px] font-bold uppercase tracking-wider w-fit">
                                                        Cancelled
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="icon" asChild className="h-8 w-8 rounded-full border border-border/50 hover:bg-primary/10 hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                                                    <Link to={`/admin/orders/${order.id}`}>
                                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Additional Insights Card */}
                    <Card className="border-border/40 shadow-xl shadow-black/5 ring-1 ring-black/5 bg-white/50 backdrop-blur-sm overflow-hidden p-8 border-dashed">
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                            <div className="h-14 w-14 rounded-full bg-primary/5 flex items-center justify-center text-primary/30 mb-4 animate-pulse">
                                <BarChart3 className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-bold font-sans uppercase tracking-widest text-muted-foreground/60">Advanced Metrics Coming Soon</h3>
                            <p className="text-xs text-muted-foreground/40 max-w-[200px] mx-auto mt-2 leading-relaxed">
                                Retention analysis, behavioral segments, and lifetime value predictions.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminCustomerDetail;
