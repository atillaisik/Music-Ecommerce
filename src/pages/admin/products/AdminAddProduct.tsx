import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductForm from '@/components/admin/products/ProductForm';
import { useCreateProduct } from '@/lib/productAPI';
import { ProductFormData } from '@/types/product';
import ErrorBoundary from '@/components/ErrorBoundary';

const AdminAddProduct = () => {
    const navigate = useNavigate();
    const createProduct = useCreateProduct();

    const onSubmit = (data: ProductFormData) => {
        createProduct.mutate(data, {
            onSuccess: () => {
                navigate('/admin/products');
            },
        });
    };

    return (
        <ErrorBoundary>
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
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary shadow-lg shadow-primary/20 ring-1 ring-primary/20">
                                <Package className="h-6 w-6" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter uppercase italic">Add New Instrument</h1>
                        </div>
                    </div>
                </header>

                <ProductForm onSubmit={onSubmit} isLoading={createProduct.isPending} />
            </div>
        </ErrorBoundary>
    );
};

export default AdminAddProduct;
