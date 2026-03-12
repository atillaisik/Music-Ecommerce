import { supabase } from './supabaseClient';
import { SiteContent } from '@/types/siteContent';

export const siteContentAPI = {
    async getContent(pageName: string, sectionName: string) {
        const { data, error } = await supabase
            .from('site_content')
            .select('*')
            .eq('page_name', pageName)
            .eq('section_name', sectionName)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found
        return data as SiteContent | null;
    },

    async updateContent(pageName: string, sectionName: string, content: any) {
        try {
            if (!content) throw new Error('Content is required for update');

            const { data, error } = await supabase
                .from('site_content')
                .upsert({
                    page_name: pageName,
                    section_name: sectionName,
                    content: content
                }, {
                    onConflict: 'page_name,section_name'
                })
                .select()
                .single();

            if (error) {
                console.error(`Database error in updateContent (${pageName}/${sectionName}):`, error);
                throw error;
            }
            
            return data as SiteContent;
        } catch (error) {
            console.error('Fatal error in siteContentAPI.updateContent:', error);
            throw error;
        }
    }
};
