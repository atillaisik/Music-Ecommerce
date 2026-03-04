import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ChevronLeft,
    Mail,
    Phone,
    MapPin,
    Package,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    Printer,
    ExternalLink,
    ShoppingBag,
    CreditCard,
    User,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useOrder, useUpdateOrderStatus } from '@/lib/orderAPI';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatus } from '@/types/order';

const AdminOrderDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { data: order, isLoading } = useOrder(id);
    const updateStatus = useUpdateOrderStatus();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-9 w-24 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-64 w-full rounded-xl" />
                        <Skeleton className="h-48 w-full rounded-xl" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-40 w-full rounded-xl" />
                        <Skeleton className="h-64 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold">Order Not Found</h2>
                <p className="text-muted-foreground">The order you are looking for does not exist or has been removed.</p>
                <Button asChild variant="outline">
                    <Link to="/admin/orders">Back to Orders</Link>
                </Button>
            </div>
        );
    }

    const getStatusBadge = (status: OrderStatus) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1.5 font-bold px-3 py-1 uppercase text-[11px] tracking-wider">
                        <Clock className="h-3.5 w-3.5" />
                        Pending Action
                    </Badge>
                );
            case 'completed':
                return (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1.5 font-bold px-3 py-1 uppercase text-[11px] tracking-wider">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Order Completed
                    </Badge>
                );
            case 'cancelled':
                return (
                    <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 gap-1.5 font-bold px-3 py-1 uppercase text-[11px] tracking-wider">
                        <XCircle className="h-3.5 w-3.5" />
                        Order Cancelled
                    </Badge>
                );
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div className="space-y-1">
                    <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground hover:text-primary gap-1 font-bold group">
                        <Link to="/admin/orders">
                            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Orders
                        </Link>
                    </Button>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-black tracking-tight">Order #{order.id.split('-')[0].toUpperCase()}</h1>
                        {getStatusBadge(order.status)}
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">Placed on {new Date(order.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" size="sm" className="h-10 rounded-xl font-bold border-border/50 gap-2 shadow-sm">
                        <Printer className="h-4 w-4" />
                        Print Invoice
                    </Button>
                    <Button variant="outline" size="sm" className="h-10 rounded-xl font-bold border-border/50 gap-2 shadow-sm">
                        <Mail className="h-4 w-4" />
                        Email Customer
                    </Button>
                    <div className="w-[180px]">
                        <Select
                            value={order.status}
                            onValueChange={(val) => updateStatus.mutate({ id: order.id, status: val as OrderStatus })}
                            disabled={updateStatus.isPending}
                        >
                            <SelectTrigger className="h-10 rounded-xl font-bold bg-primary text-primary-foreground border-none shadow-lg shadow-primary/20">
                                <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Order Items */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white/50 dark:bg-black/20 rounded-2xl border border-border/50 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/5">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/30">
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-bold">Ordered Items</h2>
                            </div>
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-black">
                                {order.order_items?.length || 0} ITEMS
                            </Badge>
                        </div>
                        <div className="divide-y divide-border/30">
                            {order.order_items?.map((item) => (
                                <div key={item.id} className="p-6 flex items-center gap-6 group">
                                    <div className="h-20 w-20 rounded-xl bg-muted overflow-hidden border border-border/50 flex-shrink-0 group-hover:scale-105 transition-transform shadow-md">
                                        {item.product?.images?.[0]?.image_url ? (
                                            <img src={item.product.images[0].image_url} alt={item.product.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                                <Package className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <Link to={`/admin/products/edit/${item.product?.id}`} className="font-bold text-lg hover:text-primary transition-colors truncate block">
                                                {item.product?.name || 'Unknown Product'}
                                            </Link>
                                            <span className="font-black text-lg">
                                                ${Number(item.price_at_purchase * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-bold text-foreground bg-muted px-2 py-0.5 rounded text-xs">Qty: {item.quantity}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="opacity-60">Unit Price:</span>
                                                <span className="font-bold text-foreground/80">${Number(item.price_at_purchase).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-muted/20 space-y-3">
                            <div className="flex justify-between text-sm opacity-70">
                                <span>Subtotal</span>
                                <span>${Number(order.total_amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm opacity-70">
                                <span>Shipping</span>
                                <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">Free Shipping</span>
                            </div>
                            <Separator className="my-4 bg-border/50" />
                            <div className="flex justify-between items-baseline pt-2">
                                <span className="text-lg font-black uppercase tracking-wider">Total</span>
                                <span className="text-3xl font-black text-primary tracking-tighter">
                                    ${Number(order.total_amount).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Activity/History Timeline */}
                    <div className="bg-white/50 dark:bg-black/20 rounded-2xl border border-border/50 backdrop-blur-sm p-6 space-y-6 shadow-xl shadow-black/5">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-bold">Order History</h2>
                        </div>
                        <div className="relative space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/50">
                            <div className="relative pl-8 animate-in slide-in-from-left-2 duration-300">
                                <div className="absolute left-0 top-1.5 h-4 w-4 bg-emerald-500 rounded-full border-4 border-background ring-4 ring-emerald-500/10 shadow-lg" />
                                <div className="space-y-1">
                                    <p className="font-bold text-sm">Order {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                                    <p className="text-xs text-muted-foreground">{new Date(order.updated_at).toLocaleString()}</p>
                                    <p className="text-sm opacity-80">The order status was updated to <span className="font-bold">{order.status}</span> by the system.</p>
                                </div>
                            </div>
                            <div className="relative pl-8 animate-in slide-in-from-left-2 duration-500">
                                <div className="absolute left-0 top-1.5 h-4 w-4 bg-primary rounded-full border-4 border-background ring-4 ring-primary/10 shadow-lg" />
                                <div className="space-y-1">
                                    <p className="font-bold text-sm">Order Placed</p>
                                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                                    <p className="text-sm opacity-80">Order was successfully placed by <span className="font-bold">{order.customer_name}</span>.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Content */}
                <div className="space-y-8">
                    {/* Customer Card */}
                    <div className="bg-white/50 dark:bg-black/20 rounded-2xl border border-border/50 backdrop-blur-sm p-6 space-y-6 shadow-xl shadow-black/5">
                        <div className="flex items-center gap-2 mb-2">
                            <User className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-bold">Customer Details</h2>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xl shadow-inner uppercase">
                                {order.customer_name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-lg leading-tight truncate">{order.customer_name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <Badge variant="outline" className="h-5 px-1.5 bg-primary/10 text-primary border-primary/10 text-[9px] font-black uppercase tracking-tighter">Verified Buyer</Badge>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-3 group px-2">
                                <div className="h-9 w-9 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                </div>
                                <div className="flex-1 min-w-0 overflow-hidden">
                                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none mb-1">Email Address</p>
                                    <p className="text-sm font-bold truncate">{order.customer_email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 group px-2">
                                <div className="h-9 w-9 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <Phone className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none mb-1">Phone Number</p>
                                    <p className="text-sm font-bold">+1 (555) 123-4567</p>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full rounded-xl h-10 font-bold border-border/50 group">
                            View Customer History
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white/50 dark:bg-black/20 rounded-2xl border border-border/50 backdrop-blur-sm p-6 space-y-4 shadow-xl shadow-black/5">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-bold">Shipping Address</h2>
                        </div>
                        <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                            <p className="font-bold">{order.customer_name}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed italic">
                                {order.shipping_address || 'No shipping address provided'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-primary/70 pt-2 px-1">
                            <Truck className="h-3.5 w-3.5" />
                            Standard Ground Shipping
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white/50 dark:bg-black/20 rounded-2xl border border-border/50 backdrop-blur-sm p-6 space-y-4 shadow-xl shadow-black/5">
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-bold">Payment Information</h2>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                            <div className="h-10 w-14 bg-white dark:bg-black/50 rounded flex items-center justify-center border border-border/50 shadow-sm">
                                <span className="font-black text-[10px] text-primary italic">VISA</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold">**** **** **** 4242</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{order.payment_method || 'Credit Card'}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 px-1">
                            <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Transaction ID</span>
                            <span className="text-xs font-mono font-bold">tra_82hJ92L0z</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetail;
