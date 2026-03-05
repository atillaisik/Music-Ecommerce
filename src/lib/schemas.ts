import * as z from 'zod';

export const productSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    brand_id: z.string().min(1, 'Please select a brand'),
    category_id: z.string().min(1, 'Please select a category'),
    price: z.coerce.number().min(0, 'Price must be positive'),
    original_price: z.coerce.number().optional(),
    stock_quantity: z.coerce.number().min(0, 'Stock must be positive'),
    badge: z.string().optional(),
    description: z.string().optional(),
    is_active: z.boolean().default(true),
    images: z.array(z.object({
        url: z.string(),
        is_primary: z.boolean(),
        display_order: z.number(),
    })).min(1, 'At least one image is required'),
});

export const categorySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    slug: z.string().min(2, 'Slug must be at least 2 characters'),
    description: z.string().optional(),
    parent_id: z.string().nullable().optional(),
    display_order: z.number().int().default(0),
    image_url: z.string().url('Invalid image URL').or(z.literal('')).optional(),
    is_active: z.boolean().default(true),
});

export const brandSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    slug: z.string().min(2, 'Slug must be at least 2 characters'),
    description: z.string().optional(),
    logo_url: z.string().optional(),
    is_active: z.boolean().default(true),
});

export const discountSchema = z.object({
    code: z.string().min(3, 'Code must be at least 3 characters').transform(v => v.toUpperCase()),
    type: z.enum(['Percentage', 'Fixed']),
    value: z.coerce.number().min(0.01, 'Value must be at least 0.01'),
    usage_limit: z.coerce.number().optional().nullable(),
    expiry_date: z.string().optional().nullable(),
    is_active: z.boolean().default(true),
});
