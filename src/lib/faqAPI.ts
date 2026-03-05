import { supabase } from './supabaseClient';
import { FAQ, FAQInsert, FAQUpdate } from '@/types/faq';

export const faqAPI = {
    async getAll() {
        const { data, error } = await supabase
            .from('faqs')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data as FAQ[];
    },

    async getActive() {
        const { data, error } = await supabase
            .from('faqs')
            .select('*')
            .eq('is_published', true)
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data as FAQ[];
    },

    async create(faq: FAQInsert) {
        const { data, error } = await supabase
            .from('faqs')
            .insert([faq])
            .select()
            .single();

        if (error) throw error;
        return data as FAQ;
    },

    async update(id: string, updates: FAQUpdate) {
        const { data, error } = await supabase
            .from('faqs')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as FAQ;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('faqs')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async updateOrder(items: { id: string, display_order: number }[]) {
        const { error } = await supabase.rpc('update_faq_order', {
            faq_orders: items
        });

        if (error) {
            // Fallback to individual updates if RPC doesn't exist
            for (const item of items) {
                await this.update(item.id, { display_order: item.display_order });
            }
        }
    }
};
