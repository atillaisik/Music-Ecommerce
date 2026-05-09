export type DiscountType = 'percentage' | 'fixed';

// DB row shape — mirrors `public.discount_codes` columns exactly.
export interface DiscountCode {
    id: string;
    code: string;
    discount_type: DiscountType;
    discount_value: number;
    usage_limit: number | null;
    usage_count: number;
    expiry_date: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Form input — what the admin form collects. The API maps this to DB columns.
export interface DiscountFormData {
    code: string;
    discount_type: DiscountType;
    discount_value: number;
    usage_limit?: number | null;
    expiry_date?: string | null;
    is_active: boolean;
}
