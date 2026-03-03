import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandForm from '@/components/admin/brands/BrandForm';
import { useBrand, useUpdateBrand } from '@/lib/brandAPI';
import { Brand } from '@/types/product';

const AdminEditBrand = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: brand, isLoading, isError } = useBrand(id);
    const updateBrand = useUpdateBrand();

    const handleSubmit = (data: Partial<Brand>) => {
        if (!id) return;
        updateBrand.mutate({ id, ...data }, {
            onSuccess: () => {
                navigate('/admin/brands');
            }
        });
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Loading Brand Data...</p>
            </div>
        );
    }

    if (isError || !brand) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                    <AlertCircle className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold">Brand Not Found</h2>
                <p className="text-muted-foreground max-w-md text-center">We couldn't find the brand you're looking for or there was an error loading it.</p>
                <Button onClick={() => navigate('/admin/brands')} className="mt-4 font-bold uppercase tracking-widest">Back to Brands</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/brands')} className="h-10 w-10 rounded-full border border-border/50 bg-white/50 backdrop-blur-sm">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Brand</h1>
                    <p className="text-muted-foreground">Modify brand details for {brand.name}.</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto">
                <BrandForm
                    initialData={brand}
                    onSubmit={handleSubmit}
                    isLoading={updateBrand.isPending}
                />
            </div>
        </div>
    );
};

export default AdminEditBrand;
