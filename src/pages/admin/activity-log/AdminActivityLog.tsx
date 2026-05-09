import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Activity,
    Search,
    Filter,
    Clock,
    ChevronLeft,
    ChevronRight,
    Database,
    Edit,
    Star,
    ShieldAlert,
    Package,
    ShoppingCart,
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useActivityLog, type ActivityActionType } from '@/lib/activityLogAPI';

const PAGE_SIZE = 15;

const actionIcon = (action: ActivityActionType) => {
    switch (action) {
        case 'order_status':
            return <ShoppingCart className="h-4 w-4" />;
        case 'inventory':
            return <Package className="h-4 w-4" />;
        case 'review':
            return <Star className="h-4 w-4" />;
        default:
            return <Activity className="h-4 w-4" />;
    }
};

const actionBadge = (action: ActivityActionType) => {
    const base = 'text-[9px] uppercase font-black px-2 py-0.5 rounded-full border tracking-widest';
    switch (action) {
        case 'order_status':
            return <Badge className={`${base} bg-blue-500/10 text-blue-600 border-blue-500/20`}>Order</Badge>;
        case 'inventory':
            return <Badge className={`${base} bg-emerald-500/10 text-emerald-600 border-emerald-500/20`}>Stock</Badge>;
        case 'review':
            return <Badge className={`${base} bg-amber-500/10 text-amber-600 border-amber-500/20`}>Review</Badge>;
        default:
            return <Badge className={`${base} bg-slate-500/10 text-slate-600 border-slate-500/20`}>System</Badge>;
    }
};

const AdminActivityLog = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [actionFilter, setActionFilter] = useState<'all' | ActivityActionType>('all');
    const { data: entries = [], isLoading } = useActivityLog();

    const filtered = useMemo(() => {
        return entries.filter((entry) => {
            if (actionFilter !== 'all' && entry.action !== actionFilter) return false;
            if (!search) return true;
            const haystack = `${entry.entity} ${entry.entity_id ?? ''} ${entry.summary}`.toLowerCase();
            return haystack.includes(search.toLowerCase());
        });
    }, [entries, actionFilter, search]);

    const total = filtered.length;
    const start = (page - 1) * PAGE_SIZE;
    const paginated = filtered.slice(start, start + PAGE_SIZE);
    const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground/90 font-sans">
                        System Activity Log
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">
                        Audit trail of order status changes, stock adjustments, and reviews.
                    </p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-sm ring-1 ring-black/5">
                    <ShieldAlert className="h-6 w-6" />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-border/50 backdrop-blur-sm shadow-sm">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Filter by entity, id, or details…"
                        className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all rounded-lg"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <Select
                    value={actionFilter}
                    onValueChange={(v) => {
                        setActionFilter(v as 'all' | ActivityActionType);
                        setPage(1);
                    }}
                >
                    <SelectTrigger className="w-full md:w-[200px] bg-background/50 border-border/50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 opacity-50" />
                            <SelectValue placeholder="Action type" />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50">
                        <SelectItem value="all">All actions</SelectItem>
                        <SelectItem value="order_status">Order status</SelectItem>
                        <SelectItem value="inventory">Inventory</SelectItem>
                        <SelectItem value="review">Reviews</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="border border-border/50 rounded-xl overflow-hidden bg-white/30 dark:bg-black/10 backdrop-blur-sm shadow-xl">
                <Table>
                    <TableHeader className="bg-muted/40 font-medium font-sans">
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Time</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Type</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Entity</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={4}>
                                        <Skeleton className="h-6 w-full" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : paginated.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-12">
                                    <Database className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
                                    <p className="text-sm text-muted-foreground">
                                        No activity yet — actions will appear here as orders, stock, and reviews change.
                                    </p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginated.map((entry) => (
                                <TableRow
                                    key={entry.id}
                                    className="hover:bg-primary/5 transition-colors border-border/40 group"
                                >
                                    <TableCell className="w-[180px]">
                                        <div className="flex items-center gap-2 text-xs font-bold font-sans opacity-60 group-hover:opacity-100 transition-opacity">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span>{new Date(entry.timestamp).toLocaleString()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {actionIcon(entry.action)}
                                            {actionBadge(entry.action)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-black bg-muted/60 px-1.5 py-0.5 rounded border border-border/40 text-muted-foreground w-fit">
                                                {entry.entity}
                                            </span>
                                            {entry.entity_id && (
                                                <span className="text-[10px] font-mono text-primary font-bold mt-1">
                                                    #{String(entry.entity_id).substring(0, 8)}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {entry.action === 'order_status' && entry.entity_id ? (
                                            <Link
                                                to={`/admin/orders/${entry.entity_id}`}
                                                className="text-sm hover:text-primary transition-colors"
                                            >
                                                {entry.summary}
                                            </Link>
                                        ) : entry.action === 'inventory' && entry.entity_id ? (
                                            <Link
                                                to={`/admin/products/edit/${entry.entity_id}`}
                                                className="text-sm hover:text-primary transition-colors"
                                            >
                                                {entry.summary}
                                            </Link>
                                        ) : (
                                            <span className="text-sm">{entry.summary}</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between p-2 bg-white/20 dark:bg-black/10 rounded-xl border border-border/40 backdrop-blur-sm">
                <p className="text-xs text-muted-foreground ml-2 font-medium">
                    Showing <span className="text-foreground font-bold">{paginated.length}</span> of{' '}
                    <span className="text-foreground font-bold">{total}</span> entries
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg h-9 w-9 p-0"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center justify-center min-w-8 h-8 rounded-lg bg-primary/10 text-primary text-xs font-black border border-primary/20">
                        {page} / {pageCount}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg h-9 w-9 p-0"
                        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                        disabled={page >= pageCount}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdminActivityLog;
