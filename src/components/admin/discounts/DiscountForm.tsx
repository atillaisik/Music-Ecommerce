import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { discountSchema } from '@/lib/schemas';
import {
    Ticket,
    Calendar,
    Percent,
    DollarSign,
    Hash,
    Clock
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { DiscountCode, DiscountFormData } from '@/types/discount';

// discountSchema moved to @/lib/schemas

type FormValues = z.infer<typeof discountSchema>;

interface DiscountFormProps {
    initialData?: DiscountCode;
    onSubmit: (data: DiscountFormData) => void;
    isLoading: boolean;
}

const DiscountForm: React.FC<DiscountFormProps> = ({ initialData, onSubmit, isLoading }) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(discountSchema),
        defaultValues: initialData ? {
            code: initialData.code,
            discount_type: initialData.discount_type,
            discount_value: initialData.discount_value,
            usage_limit: initialData.usage_limit,
            expiry_date: initialData.expiry_date ? new Date(initialData.expiry_date).toISOString().split('T')[0] : null,
            is_active: initialData.is_active,
        } : {
            code: '',
            discount_type: 'percentage',
            discount_value: 0,
            usage_limit: null,
            expiry_date: null,
            is_active: true,
        },
    });

    const handleFormSubmit = (values: FormValues) => {
        onSubmit(values as any);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-border/50 shadow-xl shadow-black/5 overflow-hidden">
                            <CardContent className="p-6 space-y-6">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Discount Code</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                    <Input placeholder="e.g. SUMMER25" {...field} className="h-11 pl-10 bg-background border-border/50 focus-visible:ring-primary/20 font-mono font-bold uppercase" />
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-[10px]">What the customer enters at checkout.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="discount_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-11 bg-background border-border/50 focus:ring-primary/20">
                                                            <div className="flex items-center gap-2">
                                                                {field.value === 'percentage' ? <Percent className="h-3.5 w-3.5" /> : <DollarSign className="h-3.5 w-3.5" />}
                                                                <SelectValue placeholder="Select type" />
                                                            </div>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                        <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="discount_value"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Value</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">
                                                            {form.watch('discount_type') === 'percentage' ? '%' : '$'}
                                                        </div>
                                                        <Input type="number" step="0.01" {...field} className="h-11 pl-8 bg-background border-border/50 font-mono font-bold" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 shadow-xl shadow-black/5 overflow-hidden">
                            <CardContent className="p-6 space-y-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Limits & Expiration
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="usage_limit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Usage Limit (Optional)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                        <Input type="number" {...field} value={field.value || ''} placeholder="Unlimited" className="h-11 pl-10 bg-background border-border/50" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="expiry_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[11px] uppercase tracking-widest font-bold text-muted-foreground">Expiry Date (Optional)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                                        <Input type="date" {...field} value={field.value || ''} className="h-11 pl-10 bg-background border-border/50" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
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
                                                <FormDescription className="text-[10px]">Enable for use at checkout</FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-8 border-t border-border/50">
                    <Button variant="outline" type="button" asChild className="h-12 px-8 uppercase font-bold tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <Link to="/admin/discounts">Cancel</Link>
                    </Button>
                    <Button type="submit" className="h-12 px-12 uppercase font-black tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all" disabled={isLoading}>
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </div>
                        ) : initialData ? 'Update Discount' : 'Create Discount'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default DiscountForm;
