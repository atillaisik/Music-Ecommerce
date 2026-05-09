import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useArticles, useDeleteArticle } from '@/lib/articleAPI';

const AdminArticleList = () => {
    const navigate = useNavigate();
    const { data: articles = [], isLoading } = useArticles(false);
    const deleteArticle = useDeleteArticle();

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Editorial content shown on the public Learn page.
                    </p>
                </div>
                <Button onClick={() => navigate('/admin/articles/add')}>
                    <Plus className="h-4 w-4 mr-2" />
                    New article
                </Button>
            </header>

            <div className="rounded-xl border bg-card divide-y">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-4">
                            <Skeleton className="h-5 w-1/2 mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ))
                ) : articles.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        No articles yet. Create the first one.
                    </div>
                ) : (
                    articles.map((article) => (
                        <div key={article.id} className="p-4 flex items-center justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/admin/articles/edit/${article.id}`}
                                        className="font-bold hover:text-primary truncate"
                                    >
                                        {article.title}
                                    </Link>
                                    {article.is_published ? (
                                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                            Published
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">Draft</Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                    {article.slug} · {article.category ?? 'Uncategorized'} · {article.read_time_minutes ?? '—'} min read
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                                    aria-label="Edit"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" aria-label="Delete">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete article?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                "{article.title}" will be permanently removed.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => deleteArticle.mutate(article.id)}
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminArticleList;
