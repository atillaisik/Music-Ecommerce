import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrandForm from '@/components/admin/brands/BrandForm';
import { useCreateBrand } from '@/lib/brandAPI';
import { Brand } from '@/types/product';

const AdminAddBrand = () => {
    const navigate = useNavigate();
    const createBrand = useCreateBrand();

    const handleSubmit = (data: Partial<Brand>) => {
        createBrand.mutate(data, {
            onSuccess: () => {
                navigate('/admin/brands');
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/brands')} className="h-10 w-10 rounded-full border border-border/50 bg-white/50 backdrop-blur-sm">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Add New Brand</h1>
                    <p className="text-muted-foreground">Define a new brand or manufacturer for your product catalog.</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto">
                <BrandForm
                    onSubmit={handleSubmit}
                    isLoading={createBrand.isPending}
                />
            </div>
        </div>
    );
};

export default AdminAddBrand;
