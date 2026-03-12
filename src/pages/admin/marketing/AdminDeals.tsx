import React, { useState, useEffect } from 'react';
import { 
    Save, 
    RefreshCw, 
    Tag, 
    Layout, 
    Info, 
    AlertCircle,
    Package,
    ArrowUpRight,
    Search,
    Plus,
    X,
    TrendingDown,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { siteContentAPI } from '@/lib/siteContentAPI';
import { useProducts, useUpdateProduct } from '@/lib/productAPI';
import { BannerContent } from '@/types/siteContent';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';

const AdminDeals = () => {
    const [banner, setBanner] = useState<BannerContent>({
        badge: '',
        title: '',
        subtitle: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isDealDialogOpen, setIsDealDialogOpen] = useState(false);
    const [salePrice, setSalePrice] = useState('');

    const { data: products, isLoading: isLoadingProducts, refetch: refetchProducts } = useProducts();
    const updateProduct = useUpdateProduct(selectedProduct?.id || '');

    const saleProducts = products?.filter(p => p.original_price && p.original_price > p.price) || [];
    const nonSaleProducts = products?.filter(p => !p.original_price || p.original_price <= p.price) || [];
    
    const searchResults = productSearch.trim() === '' 
        ? [] 
        : nonSaleProducts.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).slice(0, 5);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                setIsLoading(true);
                const data = await siteContentAPI.getContent('deals', 'banner');
                if (data && data.content) {
                    setBanner(data.content as BannerContent);
                }
            } catch (error) {
                console.error('Error fetching deals banner:', error);
                toast.error('Failed to load banner content');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanner();
    }, []);

    const handleSaveBanner = async () => {
        try {
            setIsSaving(true);
            await siteContentAPI.updateContent('deals', 'banner', banner);
            toast.success('Deals banner updated successfully');
        } catch (error: any) {
            console.error('Error updating deals banner:', error);
            toast.error('Failed to update banner content', {
                description: error.message || 'Please check your permissions and try again.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenAddDeal = (product: Product) => {
        setSelectedProduct(product);
        setSalePrice((product.price * 0.8).toFixed(2)); // Default to 20% off
        setIsDealDialogOpen(true);
    };

    const handleAddDeal = async () => {
        if (!selectedProduct) return;
        
        const priceNum = parseFloat(salePrice);
        if (isNaN(priceNum) || priceNum <= 0) {
            toast.error('Please enter a valid sale price');
            return;
        }

        if (priceNum >= selectedProduct.price) {
            toast.error('Sale price must be lower than current price');
            return;
        }

        try {
            const formData = {
                name: selectedProduct.name,
                brand_id: selectedProduct.brand_id,
                category_id: selectedProduct.category_id,
                price: priceNum,
                original_price: selectedProduct.price,
                stock_quantity: selectedProduct.stock_quantity,
                description: selectedProduct.description,
                badge: selectedProduct.badge || 'SALE',
                is_active: selectedProduct.is_active,
                images: selectedProduct.images?.map(img => ({
                    url: img.image_url,
                    is_primary: img.is_primary,
                    display_order: img.display_order
                })) || []
            };

            await updateProduct.mutateAsync(formData);
            toast.success('Deal added successfully!');
            setIsDealDialogOpen(false);
            setProductSearch('');
            setSelectedProduct(null);
            refetchProducts();
        } catch (error) {
            console.error('Error adding deal:', error);
        }
    };

    const handleRemoveDeal = async (product: Product) => {
        try {
            toast.info('Removing deal...');
            const { error } = await supabase
                .from('products')
                .update({ 
                    original_price: null,
                    price: product.original_price || product.price,
                    badge: product.badge === 'SALE' ? null : product.badge
                })
                .eq('id', product.id);
            
            if (error) throw error;
            toast.success('Deal removed');
            refetchProducts();
        } catch (error) {
            console.error('Error removing deal:', error);
            toast.error('Failed to remove deal');
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-64" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase italic text-primary drop-shadow-sm flex items-center gap-3">
                        <Tag className="h-8 w-8" />
                        Deals Management
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">Configure the Deals page appearance and manage your active offers.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        asChild
                        variant="outline" 
                        className="gap-2 border-primary/20 hover:bg-primary/5 text-primary rounded-xl font-bold uppercase tracking-widest text-xs h-10"
                    >
                        <Link to="/deals" target="_blank">
                            View Page <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Banner Configuration */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Add New Deal Section */}
                    <Card className="border-border/50 bg-white/30 dark:bg-black/10 backdrop-blur-md shadow-2xl rounded-2xl overflow-visible ring-1 ring-black/5 dark:ring-white/5 relative z-20">
                        <CardHeader className="border-b border-border/10 bg-primary/5 text-primary">
                            <div className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                <CardTitle className="text-xl font-bold uppercase italic tracking-tight">Add New Deal</CardTitle>
                            </div>
                            <CardDescription className="text-primary/60">Search for a product to mark it as a deal.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input 
                                    placeholder="Search by product name..."
                                    value={productSearch}
                                    onChange={(e) => setProductSearch(e.target.value)}
                                    className="pl-12 bg-accent/30 border-none h-14 rounded-2xl focus-visible:ring-primary/30 font-bold text-lg"
                                />
                                {productSearch && (
                                    <button 
                                        onClick={() => setProductSearch('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded-full transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            <AnimatePresence>
                                {searchResults.length > 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute left-6 right-6 top-[calc(100%-8px)] bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-border/10"
                                    >
                                        {searchResults.map(product => (
                                            <div 
                                                key={product.id} 
                                                className="p-4 hover:bg-primary/5 flex items-center justify-between gap-4 transition-colors group cursor-pointer"
                                                onClick={() => handleOpenAddDeal(product)}
                                            >
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden border border-border/50">
                                                        {product.images && product.images[0] ? (
                                                            <img src={product.images[0].image_url} alt={product.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <Package className="h-6 w-6 m-auto text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{product.name}</h4>
                                                        <p className="text-xs text-muted-foreground font-medium">${product.price}</p>
                                                    </div>
                                                </div>
                                                <Button size="sm" className="rounded-xl h-9 px-4 font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-primary/10">
                                                    <TrendingDown className="h-3 w-3" /> Add Deal
                                                </Button>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {productSearch && searchResults.length === 0 && (
                                <div className="mt-4 p-4 text-center text-muted-foreground text-sm italic">
                                    No non-deal products found for "{productSearch}"
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-white/30 dark:bg-black/10 backdrop-blur-md shadow-2xl overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/5">
                        <CardHeader className="border-b border-border/10 bg-muted/20">
                            <div className="flex items-center gap-2">
                                <Layout className="h-5 w-5 text-primary" />
                                <CardTitle className="text-xl font-bold uppercase italic tracking-tight">Main Banner</CardTitle>
                            </div>
                            <CardDescription>Update the header section of the Deals page.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Badge Text</label>
                                <Input 
                                    value={banner.badge}
                                    onChange={(e) => setBanner({ ...banner, badge: e.target.value })}
                                    placeholder="e.g. Limited Time"
                                    className="bg-accent/30 border-none h-12 rounded-xl focus-visible:ring-primary/30 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Main Title</label>
                                <Input 
                                    value={banner.title}
                                    onChange={(e) => setBanner({ ...banner, title: e.target.value })}
                                    placeholder="e.g. Season's Best Deals"
                                    className="bg-accent/30 border-none h-12 rounded-xl focus-visible:ring-primary/30 font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">Subtitle / Description</label>
                                <Textarea 
                                    value={banner.subtitle}
                                    onChange={(e) => setBanner({ ...banner, subtitle: e.target.value })}
                                    placeholder="Enter a compelling description for your deals..."
                                    className="bg-accent/30 border-none min-h-[100px] rounded-xl focus-visible:ring-primary/30 resize-none font-medium leading-relaxed"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/10 border-t border-border/10 p-6 flex justify-end">
                            <Button 
                                onClick={handleSaveBanner}
                                disabled={isSaving}
                                className="gap-2 bg-primary shadow-lg shadow-primary/20 h-11 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all min-w-[150px]"
                            >
                                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save changes
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Preview Section */}
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1 flex items-center gap-2">
                            <Info className="h-3 w-3" /> Live Preview
                        </label>
                        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-10 text-center shadow-inner overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            <Badge className="bg-primary text-primary-foreground mb-3 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black shadow-lg shadow-primary/30">
                                {banner.badge || 'BADGE'}
                            </Badge>
                            <h2 className="font-display text-4xl font-black uppercase tracking-tighter italic text-foreground mb-3">
                                {banner.title || 'YOUR TITLE HERE'}
                            </h2>
                            <p className="max-w-md mx-auto text-muted-foreground font-medium italic">
                                {banner.subtitle || 'Your subtitle or descriptive text will appear here to entice customers.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="border-border/50 bg-white/30 dark:bg-black/10 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden ring-1 ring-black/5">
                        <CardHeader className="pb-3 border-b border-border/5 bg-primary/5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <TrendingDown className="h-4 w-4" />
                                Active Deals ({saleProducts.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                {isLoadingProducts ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <Skeleton className="h-10 w-10 rounded-lg" />
                                            <div className="space-y-1 flex-1">
                                                <Skeleton className="h-3 w-2/3" />
                                                <Skeleton className="h-2 w-1/3" />
                                            </div>
                                        </div>
                                    ))
                                ) : saleProducts.length > 0 ? (
                                    saleProducts.map(product => (
                                        <div key={product.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent/50 transition-colors group">
                                            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border/50 group-hover:border-primary/30 transition-colors shrink-0">
                                                {product.images && product.images[0] ? (
                                                    <img src={product.images[0].image_url} alt={product.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Package className="h-5 w-5 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold truncate group-hover:text-primary transition-colors">{product.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-primary">${product.price}</span>
                                                    <span className="text-[10px] text-muted-foreground line-through">${product.original_price}</span>
                                                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-[8px] h-4 font-black uppercase">
                                                        -{Math.round((1 - product.price / (product.original_price || product.price)) * 100)}%
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                onClick={() => handleRemoveDeal(product)}
                                                title="Remove Deal"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center border-2 border-dashed border-border/50 rounded-xl">
                                        <p className="text-xs italic text-muted-foreground">No active deals found.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        {saleProducts.length > 0 && (
                            <CardFooter className="pt-2 pb-4">
                                <Button variant="link" className="text-[10px] font-black uppercase tracking-widest text-primary p-0 h-auto mx-auto" asChild>
                                    <Link to="/admin/products">Manage All Products</Link>
                                </Button>
                            </CardFooter>
                        )}
                    </Card>

                    <Card className="bg-primary/5 border-primary/20 rounded-2xl overflow-hidden shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" /> Tip
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-[11px] leading-relaxed italic text-muted-foreground">
                                Setting a deal will move the current price to <strong>Original Price</strong> and update the <strong>Price</strong> to your sale value. Removing a deal will restore the original price.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Set Deal Price Dialog */}
            <Dialog open={isDealDialogOpen} onOpenChange={setIsDealDialogOpen}>
                <AnimatePresence>
                    {isDealDialogOpen && (
                        <DialogContent className="sm:max-w-md rounded-3xl border-border/50 shadow-2xl backdrop-blur-xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-primary flex items-center gap-2">
                                    <TrendingDown className="h-6 w-6" />
                                    Create Deal
                                </DialogTitle>
                                <DialogDescription>
                                    Set the new sale price for <strong>{selectedProduct?.name}</strong>.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-6 space-y-6">
                                <div className="flex items-center justify-center gap-8 p-6 rounded-2xl bg-accent/30 border border-border/10">
                                    <div className="text-center">
                                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Current</p>
                                        <p className="text-2xl font-black italic opacity-50 relative">
                                            ${selectedProduct?.price}
                                            <span className="absolute inset-x-0 top-1/2 h-0.5 bg-destructive/50 -rotate-12" />
                                        </p>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <ArrowUpRight className="h-5 w-5 text-primary rotate-90" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] uppercase font-black text-primary tracking-widest mb-1">New Deal</p>
                                        <div className="relative">
                                            <span className="absolute left-1 top-1/2 -translate-y-1/2 text-primary font-black">$</span>
                                            <Input 
                                                value={salePrice}
                                                onChange={(e) => setSalePrice(e.target.value)}
                                                className="bg-transparent border-none border-b-2 border-primary/50 rounded-none h-10 w-24 text-2xl font-black p-0 pl-5 focus-visible:ring-0 focus-visible:border-primary transition-all text-center"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 px-4">
                                    <div className="flex-1 h-px bg-border/20" />
                                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 font-black px-3 py-1 italic">
                                        {selectedProduct && salePrice ? `${Math.round((1 - parseFloat(salePrice) / selectedProduct.price) * 100)}% OFF` : '0% OFF'}
                                    </Badge>
                                    <div className="flex-1 h-px bg-border/20" />
                                </div>
                            </div>
                            <DialogFooter className="sm:justify-between gap-4">
                                <Button 
                                    variant="ghost" 
                                    onClick={() => setIsDealDialogOpen(false)}
                                    className="rounded-xl font-bold uppercase tracking-widest text-[10px]"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleAddDeal}
                                    disabled={updateProduct.isPending}
                                    className="gap-2 bg-primary shadow-lg shadow-primary/20 h-11 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all px-8"
                                >
                                    {updateProduct.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                    Confirm Deal
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    )}
                </AnimatePresence>
            </Dialog>
        </div>
    );
};

export default AdminDeals;
