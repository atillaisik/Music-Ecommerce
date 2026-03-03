import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DiscountForm from '@/components/admin/discounts/DiscountForm';
import { useDiscountCode, useUpdateDiscountCode } from '@/lib/discountAPI';
import { DiscountFormData } from '@/types/discount';

const AdminEditDiscount = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: discount, isLoading, isError } = useDiscountCode(id);
    const updateDiscount = useUpdateDiscountCode();

    const handleSubmit = (data: DiscountFormData) => {
        if (!id) return;
        updateDiscount.mutate({ id, ...data }, {
            onSuccess: () => {
                navigate('/admin/discounts');
            }
        });
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Loading Discount Data...</p>
            </div>
        );
    }

    if (isError || !discount) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                    <AlertCircle className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold">Discount Code Not Found</h2>
                <p className="text-muted-foreground max-w-md text-center">We couldn't find the discount code you're looking for.</p>
                <Button onClick={() => navigate('/admin/discounts')} className="mt-4 font-bold uppercase tracking-widest">Back to Discounts</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/discounts')} className="h-10 w-10 rounded-full border border-border/50 bg-white/50 backdrop-blur-sm">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Discount</h1>
                    <p className="text-muted-foreground">Modify settings for code: <span className="text-primary font-mono">{discount.code}</span></p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <DiscountForm
                    initialData={discount}
                    onSubmit={handleSubmit}
                    isLoading={updateDiscount.isPending}
                />
            </div>
        </div>
    );
};

export default AdminEditDiscount;
