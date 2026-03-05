export interface FAQ {
    id: string;
    question: string;
    answer: string;
    display_order: number;
    is_published: boolean;
    created_at: string;
}

export interface FAQInsert {
    question: string;
    answer: string;
    display_order?: number;
    is_published?: boolean;
}

export interface FAQUpdate {
    question?: string;
    answer?: string;
    display_order?: number;
    is_published?: boolean;
}
