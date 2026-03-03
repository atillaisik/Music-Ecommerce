export type DiscountType = 'percentage' | 'fixed';

export interface DiscountCode {
    id: string;
    code: string;
    discount_type: DiscountType;
    discount_value: number;
    usage_limit?: number;
    usage_count: number;
    expiry_date?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DiscountFormData {
    code: string;
    discount_type: DiscountType;
    discount_value: number;
    usage_limit?: number;
    expiry_date?: string;
    is_active: boolean;
}
