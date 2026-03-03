import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryForm, { CategoryFormData } from '@/components/admin/categories/CategoryForm';
import { useCreateCategory } from '@/lib/categoryAPI';

const AdminAddCategory = () => {
    const navigate = useNavigate();
    const createCategory = useCreateCategory();

    const onSubmit = (data: CategoryFormData) => {
        createCategory.mutate(data, {
            onSuccess: () => {
                navigate('/admin/categories');
            },
        });
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <button
                        onClick={() => navigate('/admin/categories')}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors group mb-2"
                    >
                        <ChevronLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                        Hierarchy Overview
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-2xl shadow-primary/20 ring-1 ring-primary/30 rotate-3">
                            <Layers className="h-6 w-6" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic drop-shadow-sm">Create Taxonomy Layer</h1>
                    </div>
                </div>
            </header>

            <CategoryForm
                onSubmit={onSubmit}
                isLoading={createCategory.isPending}
                onCancel={() => navigate('/admin/categories')}
            />
        </div>
    );
};

export default AdminAddCategory;
