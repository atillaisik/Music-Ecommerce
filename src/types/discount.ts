export type DiscountType = 'Percentage' | 'Fixed';

export interface DiscountCode {
    id: string;
    code: string;
    type: DiscountType;
    value: number;
    usage_limit?: number;
    expiry_date?: string;
    is_active: boolean;
    created_at: string;
}

export interface DiscountFormData {
    code: string;
    type: DiscountType;
    value: number;
    usage_limit?: number;
    expiry_date?: string;
    is_active: boolean;
}
