import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layers, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryForm, { CategoryFormData } from '@/components/admin/categories/CategoryForm';
import { useCategory, useUpdateCategory } from '@/lib/categoryAPI';

const AdminEditCategory = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: category, isLoading: isFetching } = useCategory(id);
    const updateCategory = useUpdateCategory();

    const onSubmit = (data: CategoryFormData) => {
        if (!id) return;
        updateCategory.mutate({ id, data }, {
            onSuccess: () => {
                navigate('/admin/categories');
            },
        });
    };

    if (isFetching) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
                <p className="text-[10px] uppercase font-black tracking-widest opacity-40 italic">Syncing taxonomy data...</p>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <p className="text-xl font-black uppercase italic">Category Not Found</p>
                <Button variant="outline" onClick={() => navigate('/admin/categories')}>Back to Hierarchy</Button>
            </div>
        );
    }

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
                        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-2xl shadow-primary/20 ring-1 ring-primary/30 -rotate-3">
                            <Layers className="h-6 w-6" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic drop-shadow-sm">Modify Taxonomy: {category.name}</h1>
                    </div>
                </div>
            </header>

            <CategoryForm
                initialData={category}
                onSubmit={onSubmit}
                isLoading={updateCategory.isPending}
                onCancel={() => navigate('/admin/categories')}
            />
        </div>
    );
};

export default AdminEditCategory;
