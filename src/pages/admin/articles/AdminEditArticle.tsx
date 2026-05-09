import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import ArticleForm from '@/components/admin/articles/ArticleForm';
import { useArticle, useUpdateArticle } from '@/lib/articleAPI';

const AdminEditArticle = () => {
    const navigate = useNavigate();
    const { id = '' } = useParams<{ id: string }>();
    const { data: article, isLoading } = useArticle(id);
    const updateArticle = useUpdateArticle(id);

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
                <h1 className="text-3xl font-bold tracking-tight">Edit article</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Update content shown on the public Learn page.
                </p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
                </div>
            ) : article ? (
                <ArticleForm
                    initial={article}
                    onSubmit={(values) =>
                        updateArticle.mutate(values, {
                            onSuccess: () => navigate('/admin/articles'),
                        })
                    }
                    submitting={updateArticle.isPending}
                />
            ) : (
                <p className="text-muted-foreground">Article not found.</p>
            )}
        </div>
    );
};

export default AdminEditArticle;
