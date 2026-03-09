import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    ArrowUpDown,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Package,
    Download,
    Upload
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
import { Checkbox } from "@/components/ui/checkbox";
import { useProducts, useCategories, useBrands, useDeleteProduct, useBulkDeleteProducts, useBulkUpdateProducts, useImportProducts, useUpdateProduct } from '@/lib/productAPI';
import Papa from 'papaparse';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const AdminProductList = () => {
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState<string>('all');
    const [brandId, setBrandId] = useState<string>('all');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<string>('created_at:desc');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const pageSize = 10;

    const { data: categories } = useCategories();
    const { data: brands } = useBrands();
    const { data: products, isLoading } = useProducts({
        search,
        category_id: categoryId === 'all' ? undefined : categoryId,
        brand_id: brandId === 'all' ? undefined : brandId,
        sort,
    });

    const deleteProduct = useDeleteProduct();
    const bulkDelete = useBulkDeleteProducts();
    const bulkUpdate = useBulkUpdateProducts();
    const importProducts = useImportProducts();

    const handleClearFilters = () => {
        setSearch('');
        setCategoryId('all');
        setBrandId('all');
        setSort('created_at:desc');
        setPage(1);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked && products) {
            setSelectedIds(products.map(p => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(i => i !== id));
        }
    };

    const handleDelete = (id: string) => {
        deleteProduct.mutate(id, {
            onSuccess: () => setDeletingId(null)
        });
    };

    const handleBulkDelete = () => {
        bulkDelete.mutate(selectedIds, {
            onSuccess: () => setSelectedIds([])
        });
    };

    const handleExportCSV = () => {
        if (!products) return;
        const headers = ['ID', 'Name', 'Brand', 'Category', 'Price', 'Original Price', 'Stock', 'Status', 'Badge', 'Description', 'Images'];
        const rows = products.map(p => [
            p.id,
            p.name,
            p.brand?.name || 'N/A',
            p.category?.name || 'N/A',
            p.price,
            p.original_price || '',
            p.stock_quantity,
            p.is_active ? 'Active' : 'Inactive',
            p.badge || '',
            p.description || '',
            p.images?.map(img => img.image_url).join(",") || ''
        ]);

        const csvContent = [headers, ...rows].map(e => {
            return e.map(value => {
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            }).join(",");
        }).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "arasounds_products.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const rows = results.data;
                if (rows.length === 0) {
                    toast.error("No data found in CSV");
                    return;
                }

                // Check for required columns
                const headers = results.meta.fields || [];
                if (!headers.includes('Name')) {
                    toast.error("CSV must contain a 'Name' column");
                    return;
                }

                toast.promise(importProducts.mutateAsync(rows), {
                    loading: 'Importing products...',
                    success: 'Successfully imported products',
                    error: 'Error importing products'
                });

                // Clear input
                e.target.value = '';
            },
            error: (error) => {
                toast.error(`Error parsing CSV: ${error.message}`);
            }
        });
    };

    // Pagination (mocked client-side for now)
    const totalPages = Math.ceil((products?.length || 0) / pageSize);
    const paginatedProducts = products?.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Product Management</h1>
                    <p className="text-muted-foreground">Manage your store's inventory and product details.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2 h-9 rounded-lg font-bold border-border/50 hover:bg-black/5">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 h-9 rounded-lg font-bold border-border/50 hover:bg-black/5"
                            onClick={() => document.getElementById('csv-import')?.click()}
                        >
                            <Upload className="h-4 w-4" />
                            Import
                        </Button>
                        <input id="csv-import" type="file" className="hidden" accept=".csv" onChange={handleImportCSV} />
                    </div>
                    <Button asChild className="gap-2 shadow-lg shadow-primary/20 h-9 rounded-lg font-bold">
                        <Link to="/admin/products/add">
                            <Plus className="h-4 w-4" />
                            Add Product
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col lg:flex-row gap-4 bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-border/50 backdrop-blur-sm shadow-sm ring-1 ring-black/5 dark:ring-white/5">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search products..."
                        className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/20 transition-all rounded-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-3">
                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-[160px] bg-background/50 border-border/50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="h-3 w-3" />
                                <SelectValue placeholder="Sort" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="created_at:desc">Newest First</SelectItem>
                            <SelectItem value="created_at:asc">Oldest First</SelectItem>
                            <SelectItem value="price:asc">Price: Low to High</SelectItem>
                            <SelectItem value="price:desc">Price: High to Low</SelectItem>
                            <SelectItem value="name:asc">Name: A-Z</SelectItem>
                            <SelectItem value="stock_quantity:asc">Stock: Low to High</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger className="w-[180px] bg-background/50 border-border/50 rounded-lg">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories?.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={brandId} onValueChange={setBrandId}>
                        <SelectTrigger className="w-[180px] bg-background/50 border-border/50 rounded-lg">
                            <SelectValue placeholder="Brand" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Brands</SelectItem>
                            {brands?.map(b => (
                                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-2 animate-in fade-in zoom-in-95">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 h-10 rounded-lg font-bold border-green-500/30 text-green-600 hover:bg-green-500/10"
                                onClick={() => bulkUpdate.mutate({ ids: selectedIds, data: { is_active: true } })}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Activate
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 h-10 rounded-lg font-bold border-orange-500/30 text-orange-600 hover:bg-orange-500/10"
                                onClick={() => bulkUpdate.mutate({ ids: selectedIds, data: { is_active: false } })}
                            >
                                <XCircle className="h-4 w-4" />
                                Deactivate
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="gap-2 shadow-lg shadow-destructive/20 rounded-lg h-10">
                                        <Trash2 className="h-4 w-4" />
                                        Delete ({selectedIds.length})
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogTitle>Delete Products</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete {selectedIds.length} products? This action cannot be undone.
                                    </AlertDialogDescription>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-white">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}

                    {(search || categoryId !== 'all' || brandId !== 'all' || sort !== 'created_at:desc') && (
                        <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-[10px] uppercase tracking-widest font-bold opacity-60 hover:opacity-100 h-10">
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="border border-border/50 rounded-xl overflow-hidden bg-white/30 dark:bg-black/10 backdrop-blur-sm shadow-xl ring-1 ring-black/5 dark:ring-white/5">
                <Table>
                    <TableHeader className="bg-muted/40 font-medium">
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={products && selectedIds.length === products.length}
                                    onCheckedChange={handleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-center">Stock</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-border/40">
                                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-10 w-10 rounded-md" />
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-20" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                                    <TableCell className="text-center"><Skeleton className="h-6 w-16 mx-auto rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : paginatedProducts?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2 opacity-50">
                                        <Package className="h-10 w-10" />
                                        <p className="text-lg font-medium">No products found</p>
                                        <p className="text-sm">Try adjusting your filters or search.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedProducts?.map((product) => (
                                <TableRow key={product.id} className="hover:bg-primary/5 transition-colors border-border/40 group">
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedIds.includes(product.id)}
                                            onCheckedChange={(checked) => handleSelectOne(product.id, !!checked)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-md bg-muted overflow-hidden border border-border/50 group-hover:scale-105 transition-transform">
                                                {product.images?.[0]?.image_url ? (
                                                    <img src={product.images[0].image_url} alt={product.name} className="h-full w-full object-contain" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                                        <Package className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="font-semibold truncate max-w-[200px] group-hover:text-primary transition-colors">{product.name}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">ID: {product.id.substring(0, 8)}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary/70 font-medium">
                                            {product.category?.name || 'N/A'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium opacity-80">{product.brand?.name || 'N/A'}</span>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-base tracking-tight">
                                        ${product.price.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center">
                                            <span className={`text-sm font-bold ${product.stock_quantity < 5 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
                                                {product.stock_quantity}
                                            </span>
                                            {product.stock_quantity < 5 && (
                                                <span className="text-[9px] uppercase font-black text-destructive/80 leading-none">Low Stock</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="hover:bg-transparent h-fit p-0 group/badge transition-transform active:scale-95"
                                            onClick={() => bulkUpdate.mutate({ ids: [product.id], data: { is_active: !product.is_active } })}
                                        >
                                            {product.is_active ? (
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
                                                <Button variant="ghost" size="icon" className="group/btn h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 overflow-hidden rounded-xl border-border/50 shadow-2xl animate-in fade-in zoom-in-95">
                                                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                                                    <Link to={`/admin/products/edit/${product.id}`} className="flex items-center gap-2 w-full">
                                                        <Edit className="h-4 w-4" />
                                                        Edit Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer focus:bg-primary/10 focus:text-primary">
                                                    <a href={`/product/${product.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full">
                                                        <ExternalLink className="h-4 w-4" />
                                                        View on Site
                                                    </a>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-bold"
                                                    onClick={() => setDeletingId(product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Product
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
                    Showing <span className="text-foreground font-bold">{paginatedProducts?.length || 0}</span> of <span className="text-foreground font-bold">{products?.length || 0}</span> products
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

            {/* Individual Delete Confirmation */}
            <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the product from the catalog. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deletingId && handleDelete(deletingId)}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            Delete Product
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdminProductList;
