import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    MoreVertical,
    User,
    ShoppingBag,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    CreditCard,
    ExternalLink,
    Mail
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCustomers } from '@/lib/customerAPI';
import { Skeleton } from '@/components/ui/skeleton';

const AdminCustomerList = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<string>('spent:desc');
    const pageSize = 10;

    const { data: customers, isLoading } = useCustomers();

    const filteredCustomers = customers?.filter(c =>
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => {
        if (sort === 'spent:desc') return b.total_spent - a.total_spent;
        if (sort === 'spent:asc') return a.total_spent - b.total_spent;
        if (sort === 'orders:desc') return b.total_orders - a.total_orders;
        if (sort === 'name:asc') return a.name.localeCompare(b.name);
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil((filteredCustomers?.length || 0) / pageSize);
    const paginatedCustomers = filteredCustomers?.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground/90 font-sans">Customer Insights</h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Monitor customer behavior and purchase history.</p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex flex-col lg:flex-row gap-4 bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-border/50 backdrop-blur-sm shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search customers by name or email..."
                        className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all rounded-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="border border-border/50 rounded-xl overflow-hidden bg-white/30 dark:bg-black/10 backdrop-blur-sm shadow-xl ring-1 ring-black/5 dark:ring-white/5">
                <Table>
                    <TableHeader className="bg-muted/40 font-medium">
                        <TableRow className="hover:bg-transparent border-border/50 font-sans">
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Customer</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Orders</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Total Spent</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Last Order</TableHead>
                            <TableHead className="w-[100px] text-right uppercase tracking-widest text-[10px] font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-border/40">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : paginatedCustomers?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2 opacity-50">
                                        <User className="h-10 w-10" />
                                        <p className="text-lg font-medium font-sans">No customers found</p>
                                        <p className="text-sm">We couldn't find any customers from your order history.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedCustomers?.map((customer) => (
                                <TableRow key={customer.email} className="hover:bg-primary/5 transition-colors border-border/40 group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold group-hover:text-primary transition-colors">{customer.name}</span>
                                                <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                                    <Mail className="h-2.5 w-2.5" />
                                                    {customer.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 font-bold font-sans">
                                            <ShoppingBag className="h-3.5 w-3.5 opacity-50" />
                                            {customer.total_orders}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 font-black text-sm tracking-tight font-sans">
                                            <CreditCard className="h-3.5 w-3.5 opacity-50" />
                                            ${customer.total_spent.toLocaleString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-xs font-bold font-sans opacity-70">
                                            <Calendar className="h-3.5 w-3.5 opacity-50" />
                                            {new Date(customer.last_order_date).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 overflow-hidden rounded-xl border-border/50 shadow-2xl animate-in fade-in zoom-in-95">
                                                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Insight Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 focus:text-primary font-bold">
                                                    <Link to={`/admin/customers/${encodeURIComponent(customer.email)}`} className="flex items-center gap-2 w-full">
                                                        <ExternalLink className="h-4 w-4" />
                                                        View Full History
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer focus:bg-primary/10 focus:text-primary font-bold">
                                                    <a href={`mailto:${customer.email}`} className="flex items-center gap-2 w-full">
                                                        <Mail className="h-4 w-4" />
                                                        Contact Customer
                                                    </a>
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
            <div className="flex items-center justify-between p-2 bg-white/20 dark:bg-black/10 rounded-xl border border-border/40 backdrop-blur-sm">
                <p className="text-xs text-muted-foreground ml-2 font-medium">
                    Showing <span className="text-foreground font-bold">{paginatedCustomers?.length || 0}</span> of <span className="text-foreground font-bold">{filteredCustomers?.length || 0}</span> customers
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-all font-bold"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center justify-center min-w-8 h-8 rounded-lg bg-primary/10 text-primary text-xs font-black border border-primary/20 font-sans">
                        {page}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-all font-bold"
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

export default AdminCustomerList;
