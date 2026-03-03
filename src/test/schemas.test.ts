import { describe, it, expect } from 'vitest';
import { productSchema, categorySchema, brandSchema, discountSchema } from '../lib/schemas';

describe('Zod Schemas', () => {
    describe('productSchema', () => {
        const validProduct = {
            name: 'Fender Stratocaster',
            brand_id: 'brand-123',
            category_id: 'cat-456',
            price: 1500,
            stock_quantity: 10,
            badge: 'Best Seller',
            description: 'A classic guitar',
            is_active: true,
            images: [{ url: 'image1.jpg', is_primary: true, display_order: 1 }]
        };

        it('should validate a valid product', () => {
            const result = productSchema.safeParse(validProduct);
            expect(result.success).toBe(true);
        });

        it('should fail if name is too short', () => {
            const invalidProduct = { ...validProduct, name: 'Fe' };
            const result = productSchema.safeParse(invalidProduct);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.errors[0].message).toBe('Name must be at least 3 characters');
            }
        });

        it('should fail if no images provided', () => {
            const invalidProduct = { ...validProduct, images: [] };
            const result = productSchema.safeParse(invalidProduct);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.errors[0].message).toBe('At least one image is required');
            }
        });
    });

    describe('categorySchema', () => {
        const validCategory = {
            name: 'Guitars',
            slug: 'guitars',
            description: 'All types of guitars',
            display_order: 1,
            is_active: true
        };

        it('should validate a valid category', () => {
            const result = categorySchema.safeParse(validCategory);
            expect(result.success).toBe(true);
        });

        it('should fail if slug is too short', () => {
            const invalidCategory = { ...validCategory, slug: 'g' };
            const result = categorySchema.safeParse(invalidCategory);
            expect(result.success).toBe(false);
        });
    });

    describe('brandSchema', () => {
        const validBrand = {
            name: 'Fender',
            slug: 'fender',
            description: 'Legendary guitars',
            is_active: true
        };

        it('should validate a valid brand', () => {
            const result = brandSchema.safeParse(validBrand);
            expect(result.success).toBe(true);
        });
    });

    describe('discountSchema', () => {
        const validDiscount = {
            code: 'summer25',
            discount_type: 'percentage',
            discount_value: 20,
            is_active: true
        };

        it('should validate and transform code to uppercase', () => {
            const result = discountSchema.safeParse(validDiscount);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.code).toBe('SUMMER25');
            }
        });

        it('should fail if discount_value is zero or negative', () => {
            const invalidDiscount = { ...validDiscount, discount_value: 0 };
            const result = discountSchema.safeParse(invalidDiscount);
            expect(result.success).toBe(false);
        });
    });
});
