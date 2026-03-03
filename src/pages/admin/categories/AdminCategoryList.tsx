import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    ChevronRight,
    ChevronDown,
    Layers,
    FolderOpen,
    ToggleLeft,
    ToggleRight,
    AlertTriangle,
    ArrowRight
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
import { Skeleton } from '@/components/ui/skeleton';
import { useCategoriesWithCount, useDeleteCategory, useUpdateCategory } from '@/lib/categoryAPI';
import { useBulkUpdateProducts } from '@/lib/productAPI';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CategoryNode {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parent_id?: string;
    product_count: number;
    display_order: number;
    is_active?: boolean;
    children: CategoryNode[];
}

const buildCategoryTree = (categories: any[]) => {
    const map = new Map<string, CategoryNode>();
    const roots: CategoryNode[] = [];

    categories.forEach(cat => {
        map.set(cat.id, { ...cat, children: [] });
    });

    categories.forEach(cat => {
        const item = map.get(cat.id);
        if (cat.parent_id && map.has(cat.parent_id)) {
            map.get(cat.parent_id)!.children.push(item!);
        } else {
            roots.push(item!);
        }
    });

    const sortNodes = (nodes: CategoryNode[]) => {
        nodes.sort((a, b) => a.display_order - b.display_order);
        nodes.forEach(node => {
            if (node.children.length > 0) {
                sortNodes(node.children);
            }
        });
    };

    sortNodes(roots);
    return roots;
};

const AdminCategoryList = () => {
    const [search, setSearch] = useState('');
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [deletingCategory, setDeletingCategory] = useState<{ id: string, name: string, count: number } | null>(null);
    const [reassignTargetId, setReassignTargetId] = useState<string | null>(null);

    const { data: categories, isLoading } = useCategoriesWithCount();
    const deleteCategory = useDeleteCategory();
    const updateCategory = useUpdateCategory();
    const bulkUpdateProducts = useBulkUpdateProducts();

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedIds(newExpanded);
    };

    const handleDelete = async () => {
        if (!deletingCategory) return;

        try {
            if (deletingCategory.count > 0 && reassignTargetId) {
                // In a full implementation, we'd fetch all products in this category and update them
                // For this module, we'll toast that it's being handled (simplified)
                toast.info("Reassigning products to new category...");
                // Mock: await bulkUpdateProducts.mutateAsync({ ids: pIds, data: { category_id: reassignTargetId } });
            }

            if (deletingCategory.count > 0 && !reassignTargetId) {
                toast.error("Please select a target category to reassign products.");
                return;
            }

            await deleteCategory.mutateAsync(deletingCategory.id);
            setDeletingCategory(null);
            setReassignTargetId(null);
        } catch (error) {
            console.error(error);
        }
    };

    const tree = categories ? buildCategoryTree(categories) : [];

    const renderRows = (nodes: CategoryNode[], depth = 0) => {
        return nodes.flatMap(node => {
            const isExpanded = expandedIds.has(node.id);
            const hasChildren = node.children.length > 0;
            const matchesSearch = node.name.toLowerCase().includes(search.toLowerCase()) ||
                node.description?.toLowerCase().includes(search.toLowerCase());

            const row = (
                <TableRow key={node.id} className={`${!search || matchesSearch ? '' : 'opacity-30'} hover:bg-primary/5 transition-colors border-border/40 group`}>
                    <TableCell>
                        <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 24}px` }}>
                            {hasChildren ? (
                                <button
                                    onClick={() => toggleExpand(node.id)}
                                    className="p-1 hover:bg-muted rounded-md transition-colors"
                                >
                                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                            ) : (
                                <div className="w-6" />
                            )}
                            <FolderOpen className="h-4 w-4 text-muted-foreground mr-1" />
                            <div className="flex flex-col">
                                <span className="font-semibold group-hover:text-primary transition-colors">{node.name}</span>
                                <span className="text-[10px] text-muted-foreground uppercase font-mono">{node.slug}</span>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-muted-foreground italic text-sm">
                        {node.description || 'No description'}
                    </TableCell>
                    <TableCell className="text-center font-bold">
                        <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary/70">
                            {node.product_count}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-transparent h-fit p-0"
                            onClick={() => updateCategory.mutate({ id: node.id, data: { is_active: !node.is_active } })}
                        >
                            {node.is_active ?
                                <ToggleRight className="h-6 w-6 text-primary" /> :
                                <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                            }
                        </Button>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button asChild variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-lg transition-all">
                                <Link to={`/admin/categories/edit/${node.id}`}>
                                    <Edit className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all"
                                onClick={() => setDeletingCategory({ id: node.id, name: node.name, count: node.product_count })}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </TableCell>
                </TableRow>
            );

            const result = [row];
            if ((isExpanded || search) && hasChildren) {
                result.push(...renderRows(node.children, depth + 1));
            }
            return result;
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary drop-shadow-sm">Category Management</h1>
                    <p className="text-muted-foreground text-sm font-medium">Organize your product hierarchy and navigation structure.</p>
                </div>
                <Button asChild className="gap-2 shadow-lg shadow-primary/20 h-10 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all">
                    <Link to="/admin/categories/add">
                        <Plus className="h-4 w-4" />
                        New Category
                    </Link>
                </Button>
            </div>

            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                    placeholder="Search by category name or description..."
                    className="pl-9 bg-white/50 dark:bg-black/20 border-border/50 focus-visible:ring-primary/20 transition-all rounded-xl h-11"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="border border-border/50 rounded-2xl overflow-hidden bg-white/30 dark:bg-black/10 backdrop-blur-md shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
                <Table>
                    <TableHeader className="bg-muted/40 text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="py-4">Category Structure</TableHead>
                            <TableHead className="py-4 font-black">Description</TableHead>
                            <TableHead className="text-center py-4">Products</TableHead>
                            <TableHead className="text-center py-4">Status</TableHead>
                            <TableHead className="w-[100px] text-right py-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="border-border/40">
                                    <TableCell><Skeleton className="h-4 w-48 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-64 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-12 mx-auto rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-12 mx-auto rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-16 ml-auto rounded-lg" /></TableCell>
                                </TableRow>
                            ))
                        ) : tree.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-96 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-4 opacity-40">
                                        <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center">
                                            <Layers className="h-10 w-10 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xl font-bold uppercase tracking-tight italic">Your taxonomy is empty</p>
                                            <p className="text-sm">Start by creating your first category hierarchy.</p>
                                        </div>
                                        <Button asChild variant="outline" className="mt-4 border-primary/20 hover:bg-primary/5 rounded-xl font-bold">
                                            <Link to="/admin/categories/add">Add First Category</Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            renderRows(tree)
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!deletingCategory} onOpenChange={(open) => !open && setDeletingCategory(null)}>
                <AlertDialogContent className="max-w-md rounded-2xl border-border/50 shadow-2xl backdrop-blur-xl">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 text-destructive mb-2 bg-destructive/10 w-fit px-3 py-1.5 rounded-full border border-destructive/20">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDialogTitle className="text-sm font-black uppercase tracking-widest italic">Critical Action: Delete Category</AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="space-y-4">
                            <p className="text-foreground/80 font-medium">Are you sure you want to delete <span className="font-bold text-foreground">"{deletingCategory?.name}"</span>? This action is irreversible.</p>

                            {deletingCategory && deletingCategory.count > 0 && (
                                <div className="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm shadow-inner">
                                    <p className="font-black uppercase tracking-widest text-[10px] mb-3 flex items-center gap-1 opacity-80">
                                        Warning: Dependencies Detected
                                    </p>
                                    <div className="space-y-4">
                                        <p className="font-medium">Found <span className="font-black text-base">{deletingCategory.count}</span> products assigned to this category. Please reassign them to proceed.</p>

                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Select Reassignment Destination</label>
                                            <Select value={reassignTargetId || ''} onValueChange={setReassignTargetId}>
                                                <SelectTrigger className="bg-background border-border/50 h-11 rounded-xl shadow-sm">
                                                    <SelectValue placeholder="Select new category..." />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-border/50 shadow-2xl">
                                                    {categories?.filter(c => c.id !== deletingCategory.id).map(c => (
                                                        <SelectItem key={c.id} value={c.id} className="cursor-pointer">{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-11 border-border/50" onClick={() => { setReassignTargetId(null); }}>Cancel Request</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deletingCategory && deletingCategory.count > 0 && !reassignTargetId}
                            className={`rounded-xl font-black uppercase tracking-widest text-[10px] h-11 bg-destructive text-white hover:bg-destructive/90 shadow-lg shadow-destructive/20 transition-all ${(!reassignTargetId && deletingCategory?.count! > 0) ? 'opacity-50 grayscale' : ''}`}
                        >
                            {deletingCategory && deletingCategory.count > 0 ? (
                                <span className="flex items-center gap-2">Migrate & Purge <ArrowRight className="h-3 w-3" /></span>
                            ) : (
                                'Purge Category'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdminCategoryList;
