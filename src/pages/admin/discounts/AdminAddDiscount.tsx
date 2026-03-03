import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DiscountForm from '@/components/admin/discounts/DiscountForm';
import { useCreateDiscountCode } from '@/lib/discountAPI';
import { DiscountFormData } from '@/types/discount';

const AdminAddDiscount = () => {
    const navigate = useNavigate();
    const createDiscount = useCreateDiscountCode();

    const handleSubmit = (data: DiscountFormData) => {
        createDiscount.mutate(data, {
            onSuccess: () => {
                navigate('/admin/discounts');
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/discounts')} className="h-10 w-10 rounded-full border border-border/50 bg-white/50 backdrop-blur-sm">
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create Discount</h1>
                    <p className="text-muted-foreground">Setup a new promotional offer or coupon code.</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <DiscountForm
                    onSubmit={handleSubmit}
                    isLoading={createDiscount.isPending}
                />
            </div>
        </div>
    );
};

export default AdminAddDiscount;
