import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Image as ImageIcon,
    Upload,
    X,
    Globe,
    Type,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Brand } from '@/types/product';
import { uploadImage } from '@/lib/imageUploader';

const brandSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    slug: z.string().min(2, 'Slug must be at least 2 characters'),
    description: z.string().optional(),
    logo_url: z.string().optional(),
    is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof brandSchema>;

interface BrandFormProps {
    initialData?: Brand;
    onSubmit: (data: Partial<Brand>) => void;
    isLoading: boolean;
}

const BrandForm: React.FC<BrandFormProps> = ({ initialData, onSubmit, isLoading }) => {
    const [uploading, setUploading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(brandSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            slug: initialData.slug,
            description: initialData.description || '',
            logo_url: initialData.logo_url || '',
            is_active: initialData.is_active,
        } : {
            name: '',
            slug: '',
            description: '',
            logo_url: '',
            is_active: true,
        },
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadImage(file);
            if (url) {
                form.setValue('logo_url', url);
            }
        } finally {
            setUploading(false);
        }
    };

    const handleFormSubmit = (values: FormValues) => {
        onSubmit(values);
    };

    const nameValue = form.watch('name');
    React.useEffect(() => {
        if (!initialData && nameValue) {
            const slug = nameValue.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            form.setValue('slug', slug);
        }
    }, [nameValue, form, initialData]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-border/50 shadow-xl shadow-black/5 overflow-hidden">
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Brand Name</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                        <Input placeholder="e.g. Fender" {...field} className="h-11 pl-10 bg-background border-border/50 focus-visible:ring-primary/20" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Slug</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                        <Input placeholder="e.g. fender" {...field} className="h-11 pl-10 bg-background border-border/50 focus-visible:ring-primary/20" />
                                                    </div>
                                                </FormControl>
                                                <FormDescription className="text-[10px]">Unique URL-friendly identifier</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Description</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50" />
                                                    <Textarea
                                                        placeholder="Describe the brand heritage and specialties..."
                                                        className="min-h-[150px] pl-10 bg-background border-border/50 focus-visible:ring-primary/20 resize-none leading-relaxed"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-border/50 shadow-xl shadow-black/5 ring-1 ring-black/5 bg-primary/[0.02]">
                            <CardContent className="p-6 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between rounded-lg border border-border/50 p-4 bg-background/50">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-xs font-bold uppercase tracking-widest">Active Status</FormLabel>
                                                <FormDescription className="text-[10px]">Show brand in filters</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 shadow-xl shadow-black/5 ring-1 ring-black/5">
                            <CardContent className="p-6 space-y-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" />
                                    Brand Logo
                                </h3>

                                <div
                                    className="relative aspect-video border-2 border-dashed border-border/50 rounded-xl transition-all hover:border-primary/40 hover:bg-primary/5 cursor-pointer flex flex-col items-center justify-center gap-2 group overflow-hidden"
                                    onClick={() => document.getElementById('logo-upload')?.click()}
                                >
                                    {form.watch('logo_url') ? (
                                        <>
                                            <img src={form.watch('logo_url')} alt="Logo Preview" className="absolute inset-0 w-full h-full object-contain p-4" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button type="button" variant="secondary" size="sm" className="h-8 text-[10px] font-black uppercase">Change Logo</Button>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    form.setValue('logo_url', '');
                                                }}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Upload className="h-5 w-5 text-primary" />
                                            </div>
                                            <p className="text-[10px] font-bold uppercase tracking-tight">Click to upload logo</p>
                                        </>
                                    )}
                                    <input
                                        id="logo-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                    {uploading && (
                                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-8 border-t border-border/50">
                    <Button variant="outline" type="button" asChild className="h-12 px-8 uppercase font-bold tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <Link to="/admin/brands">Cancel</Link>
                    </Button>
                    <Button type="submit" className="h-12 px-12 uppercase font-black tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all" disabled={isLoading || uploading}>
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </div>
                        ) : initialData ? 'Update Brand' : 'Create Brand'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default BrandForm;
