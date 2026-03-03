import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { productSchema } from '@/lib/schemas';
import {
    Plus,
    Trash2,
    Image as ImageIcon,
    Upload,
    Star,
    AlertCircle,
    X,
    Move,
    Tag
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product, ProductFormData, Category, Brand } from '@/types/product';
import { useCategories, useBrands } from '@/lib/productAPI';
import { uploadImage, deleteImage } from '@/lib/imageUploader';
import { toast } from 'sonner';

// productSchema moved to @/lib/schemas

type FormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    initialData?: Product;
    onSubmit: (data: ProductFormData) => void;
    isLoading: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, isLoading }) => {
    const { data: categories } = useCategories();
    const { data: brands } = useBrands();
    const [uploading, setUploading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            brand_id: initialData.brand_id,
            category_id: initialData.category_id,
            price: initialData.price,
            original_price: initialData.original_price,
            stock_quantity: initialData.stock_quantity,
            badge: initialData.badge || '',
            description: initialData.description || '',
            is_active: initialData.is_active,
            images: initialData.images?.map(img => ({
                url: img.image_url,
                is_primary: img.is_primary,
                display_order: img.display_order
            })) || [],
        } : {
            name: '',
            brand_id: '',
            category_id: '',
            price: 0,
            stock_quantity: 0,
            badge: '',
            description: '',
            is_active: true,
            images: [],
        },
    });

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: 'images'
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const url = await uploadImage(files[i]);
                if (url) {
                    append({
                        url,
                        is_primary: fields.length === 0 && i === 0,
                        display_order: fields.length + i,
                    });
                }
            }
        } finally {
            setUploading(false);
        }
    };

    const setPrimaryImage = (index: number) => {
        fields.forEach((_, i) => {
            update(i, { ...fields[i], is_primary: i === index });
        });
    };

    const handleFormSubmit = (values: FormValues) => {
        onSubmit(values as any);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-border/50 shadow-xl shadow-black/5 ring-1 ring-black/5 overflow-hidden">
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Product Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Fender Stratocaster" {...field} className="h-11 bg-background border-border/50 focus-visible:ring-primary/20" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="category_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-11 bg-background border-border/50 focus:ring-primary/20">
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories?.map(c => (
                                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="brand_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Brand</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-11 bg-background border-border/50 focus:ring-primary/20">
                                                            <SelectValue placeholder="Select Brand" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {brands?.map(b => (
                                                            <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
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
                                                <Textarea
                                                    placeholder="Describe the product features, specifications, and tone..."
                                                    className="min-h-[200px] bg-background border-border/50 focus-visible:ring-primary/20 resize-none leading-relaxed"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Inventory & Pricing */}
                        <Card className="border-border/50 shadow-xl shadow-black/5 ring-1 ring-black/5 overflow-hidden">
                            <CardContent className="p-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    Pricing & Inventory
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Price ($)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                                                        <Input type="number" step="0.01" {...field} className="h-11 pl-7 bg-background border-border/50 font-mono font-bold" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="original_price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Original Price (Optional)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">$</span>
                                                        <Input type="number" step="0.01" {...field} className="h-11 pl-7 bg-background border-border/50 text-muted-foreground/70" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="stock_quantity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Inventory Level</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} className="h-11 bg-background border-border/50 font-bold" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar: Images & Status */}
                    <div className="space-y-6">
                        {/* Status & Badge */}
                        <Card className="border-border/50 shadow-xl shadow-black/5 ring-1 ring-black/5 bg-primary/[0.02]">
                            <CardContent className="p-6 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="is_active"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between rounded-lg border border-border/50 p-4 bg-background/50">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-xs font-bold uppercase tracking-widest">Active Status</FormLabel>
                                                <FormDescription className="text-[10px]">Visible to customers</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="badge"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Promotional Badge</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-11 bg-background border-border/50">
                                                        <SelectValue placeholder="Standard" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="">None</SelectItem>
                                                    <SelectItem value="Best Seller">Best Seller</SelectItem>
                                                    <SelectItem value="New">New Arrival</SelectItem>
                                                    <SelectItem value="Sale">Sale Item</SelectItem>
                                                    <SelectItem value="Premium">Premium Gear</SelectItem>
                                                    <SelectItem value="Hot">Hot Item</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Media Upload */}
                        <Card className="border-border/50 shadow-xl shadow-black/5 ring-1 ring-black/5">
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4" />
                                        Product Media
                                    </h3>
                                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter">{fields.length} / 10</Badge>
                                </div>

                                <div className="space-y-4">
                                    <div
                                        className="relative border-2 border-dashed border-border/50 rounded-xl p-8 transition-all hover:border-primary/40 hover:bg-primary/5 cursor-pointer flex flex-col items-center justify-center gap-2 group"
                                        onClick={() => document.getElementById('image-upload')?.click()}
                                    >
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Upload className="h-6 w-6 text-primary" />
                                        </div>
                                        <p className="text-sm font-bold uppercase tracking-tight">Drop files or click to upload</p>
                                        <p className="text-[10px] text-muted-foreground">PNG, JPG, WebP (Max 5MB)</p>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            multiple
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                        />
                                        {uploading && (
                                            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                                    <p className="text-xs font-bold uppercase animate-pulse">Uploading...</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="relative aspect-square rounded-xl overflow-hidden border border-border/50 bg-muted group shadow-sm ring-1 ring-black/5 transition-all hover:ring-primary/40">
                                                <img src={field.url} alt="Product" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />

                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                    <Button
                                                        type="button"
                                                        variant={field.is_primary ? "default" : "secondary"}
                                                        size="sm"
                                                        className="h-8 text-[10px] font-black uppercase tracking-widest px-3"
                                                        onClick={() => setPrimaryImage(index)}
                                                    >
                                                        {field.is_primary ? <Star className="h-3 w-3 mr-1 fill-current" /> : null}
                                                        {field.is_primary ? "Primary" : "Set Primary"}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>

                                                {field.is_primary && (
                                                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20">
                                                        Main
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {form.formState.errors.images && (
                                        <p className="text-xs font-bold text-destructive flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {form.formState.errors.images.message}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-8 border-t border-border/50">
                    <Button variant="outline" type="button" asChild className="h-12 px-8 uppercase font-bold tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <Link to="/admin/products">Cancel</Link>
                    </Button>
                    <Button type="submit" className="h-12 px-12 uppercase font-black tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all" disabled={isLoading || uploading}>
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </div>
                        ) : initialData ? 'Update Product' : 'Create Product'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ProductForm;
