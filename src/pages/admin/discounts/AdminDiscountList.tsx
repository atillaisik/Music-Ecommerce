import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    CheckCircle2,
    XCircle,
    Ticket,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Hash,
    Clock
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
import { useDiscountCodes, useDeleteDiscountCode, useUpdateDiscountCode } from '@/lib/discountAPI';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const AdminDiscountList = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const pageSize = 10;

    const { data: coupons, isLoading } = useDiscountCodes();
    const deleteCoupon = useDeleteDiscountCode();
    const updateCoupon = useUpdateDiscountCode();

    const filteredCoupons = coupons?.filter(c =>
        c.code.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id: string) => {
        deleteCoupon.mutate(id, {
            onSuccess: () => setDeletingId(null)
        });
    };

    // Pagination
    const totalPages = Math.ceil((filteredCoupons?.length || 0) / pageSize);
    const paginatedCoupons = filteredCoupons?.slice((page - 1) * pageSize, page * pageSize);

    const isExpired = (expiryDate?: string) => {
        if (!expiryDate) return false;
        return new Date(expiryDate) < new Date();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground/90 font-sans">Discount Codes</h1>
                    <p className="text-muted-foreground text-sm font-medium mt-1">Manage promotional offers and coupons.</p>
                </div>
                <Button asChild className="gap-2 shadow-lg shadow-primary/20 h-9 rounded-lg font-bold">
                    <Link to="/admin/discounts/add">
                        <Plus className="h-4 w-4" />
                        Add Discount
                    </Link>
                </Button>
            </div>

            {/* Filter */}
            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-border/50 backdrop-blur-sm shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                <div className="relative group max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by code..."
                        className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all rounded-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="border border-border/50 rounded-xl overflow-hidden bg-white/30 dark:bg-black/10 backdrop-blur-sm shadow-xl ring-1 ring-black/5 dark:ring-white/5">
                <Table>
                    <TableHeader className="bg-muted/40 font-medium font-sans">
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Coupon Code</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Type & Value</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Usage</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Expiry</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold text-center">Status</TableHead>
                            <TableHead className="w-[100px] text-right uppercase tracking-widest text-[10px] font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-border/40">
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16 mx-auto rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : paginatedCoupons?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2 opacity-50">
                                        <Ticket className="h-10 w-10" />
                                        <p className="text-lg font-medium font-sans">No discount codes found</p>
                                        <p className="text-sm">Create a new one to get started.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedCoupons?.map((coupon) => (
                                <TableRow key={coupon.id} className="hover:bg-primary/5 transition-colors border-border/40 group">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                                                <Ticket className="h-4 w-4" />
                                            </div>
                                            <span className="font-mono font-bold tracking-wider group-hover:text-primary transition-colors">{coupon.code}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Badge variant="outline" className="font-bold border-primary/20 text-primary bg-primary/5">
                                                {coupon.type === 'Percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                                            </Badge>
                                            <span className="text-[10px] uppercase font-black opacity-50 tracking-tighter">
                                                {coupon.type === 'Percentage' ? 'OFF' : 'Discount'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center gap-1.5 text-xs font-bold font-sans">
                                                <Hash className="h-3 w-3 opacity-50" />
                                                0 / {coupon.usage_limit || '∞'}
                                            </div>
                                            <p className="text-[9px] uppercase font-black opacity-40">Total Uses</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {coupon.expiry_date ? (
                                            <div className="flex flex-col gap-0.5">
                                                <div className={`flex items-center gap-1.5 text-xs font-bold font-sans ${isExpired(coupon.expiry_date) ? 'text-destructive' : ''}`}>
                                                    <Calendar className="h-3 w-3 opacity-50" />
                                                    {new Date(coupon.expiry_date).toLocaleDateString()}
                                                </div>
                                                {isExpired(coupon.expiry_date) && (
                                                    <p className="text-[9px] uppercase font-black text-destructive/80">Expired</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-xs font-bold font-sans opacity-40 uppercase tracking-widest">Never</p>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="hover:bg-transparent h-fit p-0 group/badge transition-transform active:scale-95"
                                            onClick={() => updateCoupon.mutate({ id: coupon.id, is_active: !coupon.is_active })}
                                        >
                                            {coupon.is_active && !isExpired(coupon.expiry_date) ? (
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider group-hover/badge:bg-emerald-500/20 transition-colors">
                                                    <CheckCircle2 className="h-3 w-3" /> Active
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-500/10 text-slate-600 border border-slate-500/20 text-[10px] font-bold uppercase tracking-wider group-hover/badge:bg-slate-500/20 transition-colors">
                                                    <XCircle className="h-3 w-3" /> {isExpired(coupon.expiry_date) ? 'Expired' : 'Inactive'}
                                                </div>
                                            )}
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 overflow-hidden rounded-xl border-border/50 shadow-2xl animate-in fade-in zoom-in-95">
                                                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Coupon Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 focus:text-primary font-bold">
                                                    <Link to={`/admin/discounts/edit/${coupon.id}`} className="flex items-center gap-2 w-full">
                                                        <Edit className="h-4 w-4" />
                                                        Edit Coupon
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-bold"
                                                    onClick={() => setDeletingId(coupon.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Coupon
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
                    Showing <span className="text-foreground font-bold">{paginatedCoupons?.length || 0}</span> of <span className="text-foreground font-bold">{filteredCoupons?.length || 0}</span> coupons
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

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
                <AlertDialogContent className="rounded-2xl border-border/50 shadow-2xl">
                    <AlertDialogHeader>
                        <div className="h-12 w-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                            <Trash2 className="h-6 w-6" />
                        </div>
                        <AlertDialogTitle className="text-xl font-bold font-sans">Delete Discount Code</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium">
                            Are you absolutely sure? This will remove the discount code permanently. Customers will no longer be able to use it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8">
                        <AlertDialogCancel className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Back</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deletingId && handleDelete(deletingId)}
                            className="bg-destructive text-white hover:bg-destructive/90 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                        >
                            Delete Forever
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdminDiscountList;
