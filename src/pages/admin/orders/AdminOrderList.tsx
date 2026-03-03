import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    Download,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    ShoppingBag,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    Mail,
    Printer
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useOrders, useUpdateOrderStatus, useOrderStats } from '@/lib/orderAPI';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { OrderStatus } from '@/types/order';

const AdminOrderList = () => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<string>('created_at:desc');
    const pageSize = 10;

    const { data: orders, isLoading } = useOrders({
        search,
        status: status === 'all' ? undefined : status as OrderStatus,
        sort,
    });

    const { data: stats } = useOrderStats();
    const updateStatus = useUpdateOrderStatus();

    const handleClearFilters = () => {
        setSearch('');
        setStatus('all');
        setSort('created_at:desc');
        setPage(1);
    };

    const handleExportCSV = () => {
        if (!orders) return;
        const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Date', 'Total', 'Status', 'Payment Method'];
        const rows = orders.map(o => [
            o.id,
            o.customer_name,
            o.customer_email,
            new Date(o.created_at).toLocaleDateString(),
            `$${o.total_amount}`,
            o.status,
            o.payment_method || 'N/A'
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `arasounds_orders_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Orders exported to CSV');
    };

    const getStatusBadge = (status: OrderStatus) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1 font-bold uppercase text-[10px] tracking-wider">
                        <Clock className="h-3 w-3" />
                        Pending
                    </Badge>
                );
            case 'completed':
                return (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1 font-bold uppercase text-[10px] tracking-wider">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                    </Badge>
                );
            case 'cancelled':
                return (
                    <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20 gap-1 font-bold uppercase text-[10px] tracking-wider">
                        <XCircle className="h-3 w-3" />
                        Cancelled
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Pagination
    const totalPages = Math.ceil((orders?.length || 0) / pageSize);
    const paginatedOrders = orders?.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
                    <p className="text-muted-foreground">Monitor and process customer orders.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2 h-9 rounded-lg font-bold border-border/50 hover:bg-black/5 shadow-sm">
                        <Download className="h-4 w-4" />
                        Export Orders
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Orders', value: stats?.total || 0, icon: ShoppingBag, color: 'primary' },
                    { label: 'Pending', value: stats?.pending || 0, icon: Clock, color: 'amber' },
                    { label: 'Completed', value: stats?.completed || 0, icon: CheckCircle2, color: 'emerald' },
                    { label: 'Cancelled', value: stats?.cancelled || 0, icon: XCircle, color: 'rose' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-border/50 backdrop-blur-sm shadow-sm flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center bg-${stat.color}-500/10 text-${stat.color === 'primary' ? 'primary' : stat.color + '-600'}`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                            <p className="text-xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col lg:flex-row gap-4 bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-border/50 backdrop-blur-sm shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by customer or order ID..."
                        className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all rounded-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-[180px] bg-background/50 border-border/50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="h-3 w-3" />
                                <SelectValue placeholder="Sort Orders" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="created_at:desc">Newest First</SelectItem>
                            <SelectItem value="created_at:asc">Oldest First</SelectItem>
                            <SelectItem value="total_amount:desc">Amount: High to Low</SelectItem>
                            <SelectItem value="total_amount:asc">Amount: Low to High</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[180px] bg-background/50 border-border/50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Filter className="h-3 w-3" />
                                <SelectValue placeholder="Filter Status" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>

                    {(search || status !== 'all' || sort !== 'created_at:desc') && (
                        <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-[10px] uppercase tracking-widest font-bold opacity-60 hover:opacity-100 h-10">
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>

            {/* Orders Table */}
            <div className="border border-border/50 rounded-xl overflow-hidden bg-white/30 dark:bg-black/10 backdrop-blur-sm shadow-xl ring-1 ring-black/5 dark:ring-white/5">
                <Table>
                    <TableHeader className="bg-muted/40 font-medium">
                        <TableRow className="hover:bg-transparent border-border/50 text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
                            <TableHead>Order Info</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-border/40">
                                    <TableCell>
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-40" />
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : paginatedOrders?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2 opacity-50">
                                        <ShoppingBag className="h-10 w-10" />
                                        <p className="text-lg font-medium">No orders found</p>
                                        <p className="text-sm">Try adjusting your filters or search.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedOrders?.map((order) => (
                                <TableRow key={order.id} className="hover:bg-primary/5 transition-colors border-border/40 group">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">#{order.id.split('-')[0].toUpperCase()}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">ID: {order.id.substring(0, 8)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{order.customer_name}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {order.customer_email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm opacity-80">
                                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                            <span className="text-[10px] uppercase font-bold text-muted-foreground">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-black text-base tracking-tighter">
                                        ${Number(order.total_amount).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {getStatusBadge(order.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 transition-all rounded-lg">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-52 rounded-xl border-border/50 shadow-2xl animate-in fade-in zoom-in-95">
                                                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Manage Order</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10">
                                                    <Link to={`/admin/orders/${order.id}`} className="flex items-center gap-2 w-full">
                                                        <Eye className="h-4 w-4" />
                                                        View Order Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer focus:bg-primary/10">
                                                    <div className="flex items-center gap-2 w-full">
                                                        <Printer className="h-4 w-4" />
                                                        Print Invoice
                                                    </div>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Update Status</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    disabled={order.status === 'pending'}
                                                    onClick={() => updateStatus.mutate({ id: order.id, status: 'pending' })}
                                                    className="cursor-pointer focus:bg-amber-500/10 focus:text-amber-600"
                                                >
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    Mark as Pending
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    disabled={order.status === 'completed'}
                                                    onClick={() => updateStatus.mutate({ id: order.id, status: 'completed' })}
                                                    className="cursor-pointer focus:bg-emerald-500/10 focus:text-emerald-600"
                                                >
                                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                                    Mark as Completed
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    disabled={order.status === 'cancelled'}
                                                    onClick={() => updateStatus.mutate({ id: order.id, status: 'cancelled' })}
                                                    className="cursor-pointer focus:bg-rose-500/10 focus:text-rose-600"
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Mark as Cancelled
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-2 bg-white/20 dark:bg-black/10 rounded-xl border border-border/40 backdrop-blur-sm shadow-sm">
                <p className="text-xs text-muted-foreground ml-2 font-medium">
                    Showing <span className="text-foreground font-bold">{paginatedOrders?.length || 0}</span> of <span className="text-foreground font-bold">{orders?.length || 0}</span> orders
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary active:scale-90 transition-all font-bold"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center justify-center min-w-8 h-8 rounded-lg bg-primary/10 text-primary text-xs font-black border border-primary/20">
                        {page}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary active:scale-90 transition-all font-bold"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || totalPages === 0}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderList;
