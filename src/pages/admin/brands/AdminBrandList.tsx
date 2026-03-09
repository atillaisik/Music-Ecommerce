import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Building2,
    Globe
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
import { useBrands, useDeleteBrand, useUpdateBrand } from '@/lib/brandAPI';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const AdminBrandList = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const pageSize = 10;

    const { data: brands, isLoading } = useBrands();
    const deleteBrand = useDeleteBrand();
    const updateBrand = useUpdateBrand();

    const filteredBrands = brands?.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.slug.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id: string) => {
        deleteBrand.mutate(id, {
            onSuccess: () => setDeletingId(null)
        });
    };

    // Pagination
    const totalPages = Math.ceil((filteredBrands?.length || 0) / pageSize);
    const paginatedBrands = filteredBrands?.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Brand Management</h1>
                    <p className="text-muted-foreground">Manage the brands and manufacturers in your store.</p>
                </div>
                <Button asChild className="gap-2 shadow-lg shadow-primary/20 h-9 rounded-lg font-bold">
                    <Link to="/admin/brands/add">
                        <Plus className="h-4 w-4" />
                        Add Brand
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-border/50 backdrop-blur-sm shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search brands..."
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
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead>Brand</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-border/40">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-10 w-10 rounded-md" />
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-6 w-16 mx-auto rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : paginatedBrands?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2 opacity-50">
                                        <Building2 className="h-10 w-10" />
                                        <p className="text-lg font-medium">No brands found</p>
                                        <p className="text-sm">Try adjusting your search criteria.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedBrands?.map((brand) => (
                                <TableRow key={brand.id} className="hover:bg-primary/5 transition-colors border-border/40 group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-md bg-muted overflow-hidden border border-border/50 group-hover:scale-105 transition-transform flex items-center justify-center">
                                                {brand.logo_url ? (
                                                    <img src={brand.logo_url} alt={brand.name} className="h-full w-full object-contain p-1" />
                                                ) : (
                                                    <Building2 className="h-5 w-5 text-muted-foreground" />
                                                )}
                                            </div>
                                            <span className="font-semibold group-hover:text-primary transition-colors">{brand.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                            <Globe className="h-3 w-3" />
                                            {brand.slug}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm truncate max-w-[300px] opacity-70">
                                            {brand.description || 'No description provided.'}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="hover:bg-transparent h-fit p-0 group/badge transition-transform active:scale-95"
                                            onClick={() => updateBrand.mutate({ id: brand.id, is_active: !brand.is_active })}
                                        >
                                            {brand.is_active ? (
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider group-hover/badge:bg-emerald-500/20 transition-colors">
                                                    <CheckCircle2 className="h-3 w-3" /> Active
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-500/10 text-slate-600 border border-slate-500/20 text-[10px] font-bold uppercase tracking-wider group-hover/badge:bg-slate-500/20 transition-colors">
                                                    <XCircle className="h-3 w-3" /> Inactive
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
                                                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                                                    <Link to={`/admin/brands/edit/${brand.id}`} className="flex items-center gap-2 w-full">
                                                        <Edit className="h-4 w-4" />
                                                        Edit Brand
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-bold"
                                                    onClick={() => setDeletingId(brand.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Brand
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
                    Showing <span className="text-foreground font-bold">{paginatedBrands?.length || 0}</span> of <span className="text-foreground font-bold">{filteredBrands?.length || 0}</span> brands
                </p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-all"
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
                        className="rounded-lg h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary transition-all"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || totalPages === 0}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the brand. If there are products associated with this brand, you may need to reassign them first to avoid errors.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deletingId && handleDelete(deletingId)}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            Delete Brand
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdminBrandList;
