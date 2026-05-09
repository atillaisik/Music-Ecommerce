import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { Article, ArticleFormData } from '@/lib/articleAPI';

const articleSchema = z.object({
    slug: z.string().min(2, 'Slug must be at least 2 characters'),
    title: z.string().min(3, 'Title must be at least 3 characters'),
    excerpt: z.string().optional().nullable(),
    body: z.string().optional().nullable(),
    image_url: z.string().url('Invalid URL').or(z.literal('')).optional().nullable(),
    category: z.string().optional().nullable(),
    read_time_minutes: z.coerce.number().int().min(0).optional().nullable(),
    is_published: z.boolean().default(true),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

interface ArticleFormProps {
    initial?: Partial<Article>;
    onSubmit: (values: ArticleFormData) => void | Promise<void>;
    submitting?: boolean;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ initial, onSubmit, submitting }) => {
    const form = useForm<ArticleFormValues>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            slug: initial?.slug ?? '',
            title: initial?.title ?? '',
            excerpt: initial?.excerpt ?? '',
            body: initial?.body ?? '',
            image_url: initial?.image_url ?? '',
            category: initial?.category ?? '',
            read_time_minutes: initial?.read_time_minutes ?? null,
            is_published: initial?.is_published ?? true,
        },
    });

    useEffect(() => {
        if (initial) {
            form.reset({
                slug: initial.slug ?? '',
                title: initial.title ?? '',
                excerpt: initial.excerpt ?? '',
                body: initial.body ?? '',
                image_url: initial.image_url ?? '',
                category: initial.category ?? '',
                read_time_minutes: initial.read_time_minutes ?? null,
                is_published: initial.is_published ?? true,
            });
        }
    }, [initial, form]);

    return (
        <form
            onSubmit={form.handleSubmit((values) =>
                onSubmit({
                    ...values,
                    excerpt: values.excerpt || null,
                    body: values.body || null,
                    image_url: values.image_url || null,
                    category: values.category || null,
                    read_time_minutes: values.read_time_minutes ?? null,
                })
            )}
            className="space-y-6 max-w-3xl"
        >
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" {...form.register('title')} />
                    {form.formState.errors.title && (
                        <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" {...form.register('slug')} placeholder="how-to-tune-a-guitar" />
                    {form.formState.errors.slug && (
                        <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" rows={2} {...form.register('excerpt')} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="body">Body (Markdown supported)</Label>
                <Textarea id="body" rows={10} {...form.register('body')} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="image_url">Cover image URL</Label>
                    <Input id="image_url" {...form.register('image_url')} placeholder="https://..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" {...form.register('category')} placeholder="Tutorial" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="read_time_minutes">Read time (min)</Label>
                    <Input
                        id="read_time_minutes"
                        type="number"
                        min={0}
                        {...form.register('read_time_minutes')}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Switch
                    id="is_published"
                    checked={form.watch('is_published')}
                    onCheckedChange={(v) => form.setValue('is_published', v)}
                />
                <Label htmlFor="is_published" className="cursor-pointer">
                    Published
                </Label>
            </div>

            <div className="flex gap-3">
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving…' : 'Save article'}
                </Button>
            </div>
        </form>
    );
};

export default ArticleForm;
