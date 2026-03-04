export interface FAQ {
    id: string;
    question: string;
    answer: string;
    order_index: number;
    is_active: boolean;
    created_at: string;
}

export interface FAQInsert {
    question: string;
    answer: string;
    order_index?: number;
    is_active?: boolean;
}

export interface FAQUpdate {
    question?: string;
    answer?: string;
    order_index?: number;
    is_active?: boolean;
}
