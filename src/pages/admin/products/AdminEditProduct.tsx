import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, ChevronLeft, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductForm from '@/components/admin/products/ProductForm';
import { useProduct, useUpdateProduct } from '@/lib/productAPI';
import { ProductFormData } from '@/types/product';
import { motion } from 'framer-motion';

const AdminEditProduct = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: product, isLoading: loadingProduct, error } = useProduct(id);
    const updateProduct = useUpdateProduct(id || '');

    const onSubmit = (data: ProductFormData) => {
        updateProduct.mutate(data, {
            onSuccess: () => {
                navigate('/admin/products');
            },
        });
    };

    if (loadingProduct) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Loading Instrument Data...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 max-w-md mx-auto text-center border-2 border-dashed border-border/50 rounded-3xl p-12 bg-muted/20">
                <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-lg shadow-destructive/20 ring-1 ring-destructive/20">
                    <AlertTriangle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black uppercase tracking-tight italic">Error Loading Instrument</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">The instrument you are trying to edit doesn't exist or there was a system error. Please verify the ID or contact support.</p>
                </div>
                <Button onClick={() => navigate('/admin/products')} variant="outline" className="h-12 px-8 uppercase font-bold tracking-widest hover:bg-black/5 active:scale-95 transition-all">
                    Back to Inventory
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-1">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group mb-2"
                    >
                        <ChevronLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                        Back to Inventory
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary shadow-lg shadow-primary/20 ring-1 ring-primary/20 hover:scale-105 transition-transform duration-300">
                            <Package className="h-6 w-6" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                            Edit {product.name}
                        </h1>
                    </div>
                </div>
            </header>

            <ProductForm initialData={product} onSubmit={onSubmit} isLoading={updateProduct.isPending} />
        </div>
    );
};

export default AdminEditProduct;
