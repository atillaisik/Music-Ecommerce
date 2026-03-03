export interface Product {
    id: string;
    name: string;
    brand_id: string;
    category_id: string;
    price: number;
    original_price?: number;
    rating: number;
    reviews_count: number;
    badge?: string;
    description?: string;
    stock_quantity: number;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    // Joined data
    brand?: Brand;
    category?: Category;
    images?: ProductImage[];
}

export interface ProductImage {
    id: string;
    product_id: string;
    image_url: string;
    display_order: number;
    is_primary: boolean;
    created_at: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    parent_id?: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

export interface Brand {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
    description?: string;
    is_active: boolean;
    created_at: string;
}

export interface ProductFormData {
    name: string;
    brand_id: string;
    category_id: string;
    price: number;
    original_price?: number;
    stock_quantity: number;
    badge?: string;
    description?: string;
    is_active: boolean;
    images: { file?: File; url: string; is_primary: boolean; display_order: number }[];
}
