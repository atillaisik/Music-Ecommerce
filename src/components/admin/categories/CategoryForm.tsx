import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Category } from '@/types/product';
import { useCategories } from '@/lib/categoryAPI';
import { Loader2, Save, X, Image as ImageIcon, LayoutGrid, Globe } from 'lucide-react';

const categorySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    slug: z.string().min(2, 'Slug must be at least 2 characters'),
    description: z.string().optional(),
    parent_id: z.string().nullable().optional(),
    display_order: z.number().int().default(0),
    image_url: z.string().url('Invalid image URL').or(z.literal('')).optional(),
    is_active: z.boolean().default(true),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
    initialData?: Category;
    onSubmit: (data: CategoryFormData) => void;
    isLoading?: boolean;
    onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    onSubmit,
    isLoading,
    onCancel
}) => {
    const { data: categories } = useCategories();

    // Filter out the current category and its children from parent list to avoid cycles
    const parentOptions = categories?.filter(c => c.id !== initialData?.id) || [];

    const form = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: initialData ? {
            name: initialData.name,
            slug: initialData.slug,
            description: initialData.description || '',
            parent_id: initialData.parent_id || null,
            display_order: initialData.display_order,
            image_url: initialData.image_url || '',
            is_active: initialData.is_active ?? true,
        } : {
            name: '',
            slug: '',
            description: '',
            parent_id: null,
            display_order: 0,
            image_url: '',
            is_active: true,
        }
    });

    const nameValue = form.watch('name');
    useEffect(() => {
        if (!initialData && nameValue) {
            const slug = nameValue.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            form.setValue('slug', slug);
        }
    }, [nameValue, initialData, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Basic Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white/40 dark:bg-black/20 p-8 rounded-3xl border border-border/50 backdrop-blur-md shadow-2xl space-y-6 ring-1 ring-black/5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <Globe className="h-4 w-4 text-primary" />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight italic">Category Basics</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Category Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Bass Guitars" {...field} className="bg-background/50 border-border/50 focus-visible:ring-primary/20 h-12 rounded-xl font-bold text-lg" />
                                            </FormControl>
                                            <FormMessage className="font-bold text-[10px]" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">URL Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder="bass-guitars" {...field} className="bg-background/30 border-border/50 focus-visible:ring-primary/10 h-12 rounded-xl font-mono text-sm" />
                                            </FormControl>
                                            <FormMessage className="font-bold text-[10px]" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Description & Context</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Brief overview for SEO and interior pages..."
                                                className="min-h-[140px] bg-background/50 border-border/50 focus-visible:ring-primary/20 rounded-2xl resize-none p-6 text-sm font-medium leading-relaxed shadow-inner"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="font-bold text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </section>

                        <section className="bg-white/40 dark:bg-black/20 p-8 rounded-3xl border border-border/50 backdrop-blur-md shadow-2xl space-y-6 ring-1 ring-black/5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <ImageIcon className="h-4 w-4 text-primary" />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight italic">Visual Identity</h2>
                            </div>

                            <FormField
                                control={form.control}
                                name="image_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Thumbnail Image Source</FormLabel>
                                        <div className="flex gap-4">
                                            <div className="relative group/img flex-1">
                                                <FormControl>
                                                    <Input placeholder="https://source.unsplash.com/..." {...field} className="bg-background/50 border-border/50 focus-visible:ring-primary/20 h-12 rounded-xl" />
                                                </FormControl>
                                            </div>
                                            <div className="h-12 w-12 rounded-xl bg-muted flex-shrink-0 border-2 border-primary/20 overflow-hidden shadow-2xl transition-transform hover:scale-110">
                                                {field.value ? (
                                                    <img src={field.value} alt="Preview" className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground opacity-20">
                                                        <ImageIcon className="h-6 w-6" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <FormDescription className="text-[9px] font-bold uppercase tracking-widest opacity-40 mt-1">High-quality JPG or WEBP recommended.</FormDescription>
                                        <FormMessage className="font-bold text-[10px]" />
                                    </FormItem>
                                )}
                            />
                        </section>
                    </div>

                    {/* Right Column: Taxonomy */}
                    <div className="space-y-6">
                        <section className="bg-white/40 dark:bg-black/20 p-8 rounded-3xl border border-border/50 backdrop-blur-md shadow-2xl space-y-8 ring-1 ring-black/5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <LayoutGrid className="h-4 w-4 text-primary" />
                                </div>
                                <h2 className="text-xl font-black uppercase tracking-tight italic">Taxonomy</h2>
                            </div>

                            <FormField
                                control={form.control}
                                name="parent_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Parent Layer</FormLabel>
                                        <Select
                                            onValueChange={(val) => field.onChange(val === "none" ? null : val)}
                                            value={field.value || "none"}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-background/50 border-border/50 h-12 rounded-xl font-bold shadow-sm">
                                                    <SelectValue placeholder="Root Level" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-2xl border-border/50 shadow-2xl backdrop-blur-xl">
                                                <SelectItem value="none" className="font-bold cursor-pointer">None (Root Level)</SelectItem>
                                                {parentOptions.map(cat => (
                                                    <SelectItem key={cat.id} value={cat.id} className="cursor-pointer">{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="font-bold text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="display_order"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Display Rank</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                                className="bg-background/50 border-border/50 h-12 rounded-xl font-black"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-[9px] font-black uppercase tracking-widest opacity-40">Lower = Priority</FormDescription>
                                        <FormMessage className="font-bold text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-2xl border border-primary/10 p-5 bg-primary/5 shadow-inner group/switch">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary">Catalog Visibility</FormLabel>
                                            <FormDescription className="text-[8px] font-black tracking-widest opacity-60">Toggle to show on site</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="data-[state=checked]:bg-primary shadow-lg"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </section>

                        <div className="grid grid-cols-1 gap-4">
                            <Button
                                type="submit"
                                className="w-full gap-3 shadow-2xl shadow-primary/30 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.03] active:scale-95 transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {initialData ? 'Update Category' : 'Publish Category'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full gap-3 h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] border-border/50 hover:bg-black/5 dark:hover:bg-white/5 opacity-60 hover:opacity-100 transition-opacity"
                                onClick={onCancel}
                            >
                                <X className="h-4 w-4" />
                                Discard Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default CategoryForm;
