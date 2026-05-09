import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { mapSupabaseError } from './apiErrors';
import { toast } from 'sonner';

export interface StoreSettings {
    storeName: string;
    legalName: string;
    supportPhone: string;
    supportEmail: string;
    address: string;
    mission: string;
    standardShippingFee: number;
    expeditedShippingFee: number;
    internationalShipping: boolean;
    /** Türkiye Cumhuriyeti MERSIS numarası (16 hane) */
    mersisNo: string;
    /** Vergi dairesi adı */
    taxOffice: string;
    /** Vergi kimlik numarası (10–11 hane) */
    taxNumber: string;
    /** Ticaret sicil numarası */
    tradeRegistryNo: string;
    /** KEP (Kayıtlı Elektronik Posta) adresi — opsiyonel ama tavsiye edilir */
    kepAddress: string;
    /** ETBİS kayıt durumu — Ticaret Bakanlığı ETBİS sicil numarası */
    etbisNo: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
    storeName: 'ARASOUNDS',
    legalName: 'ARASOUNDS',
    supportPhone: '',
    supportEmail: '',
    address: '',
    mission: '',
    standardShippingFee: 0,
    expeditedShippingFee: 0,
    internationalShipping: false,
    mersisNo: '',
    taxOffice: '',
    taxNumber: '',
    tradeRegistryNo: '',
    kepAddress: '',
    etbisNo: '',
};

const PAGE = 'system';
const SECTION = 'settings';

export const useStoreSettings = () => {
    return useQuery({
        queryKey: ['store-settings'],
        queryFn: async (): Promise<StoreSettings> => {
            const { data, error } = await supabase
                .from('site_content')
                .select('content')
                .eq('page_name', PAGE)
                .eq('section_name', SECTION)
                .maybeSingle();

            if (error) throw mapSupabaseError(error);

            const stored = (data?.content ?? {}) as Partial<StoreSettings>;
            return { ...DEFAULT_STORE_SETTINGS, ...stored };
        },
    });
};

export const useUpdateStoreSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (settings: StoreSettings): Promise<StoreSettings> => {
            const { data, error } = await supabase
                .from('site_content')
                .upsert(
                    {
                        page_name: PAGE,
                        section_name: SECTION,
                        content: settings,
                    },
                    { onConflict: 'page_name,section_name' },
                )
                .select('content')
                .single();

            if (error) throw mapSupabaseError(error);
            return data.content as StoreSettings;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['store-settings'], data);
            toast.success('Store settings saved');
        },
        onError: (error: any) => {
            toast.error(`Failed to save settings: ${error?.message ?? 'unknown error'}`);
        },
    });
};
