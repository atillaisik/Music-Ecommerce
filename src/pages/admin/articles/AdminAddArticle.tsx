import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArticleForm from '@/components/admin/articles/ArticleForm';
import { useCreateArticle } from '@/lib/articleAPI';

const AdminAddArticle = () => {
    const navigate = useNavigate();
    const createArticle = useCreateArticle();

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/admin/articles')}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
                <ChevronLeft className="h-3 w-3" />
                All articles
            </button>

            <div>
                <h1 className="text-3xl font-bold tracking-tight">New article</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Publish a new entry to the Learn page.
                </p>
            </div>

            <ArticleForm
                onSubmit={(values) =>
                    createArticle.mutate(values, {
                        onSuccess: () => navigate('/admin/articles'),
                    })
                }
                submitting={createArticle.isPending}
            />
        </div>
    );
};

export default AdminAddArticle;
