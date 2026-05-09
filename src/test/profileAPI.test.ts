import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../lib/supabaseClient', () => {
    return {
        supabase: {
            auth: {
                getUser: vi.fn(),
            },
            from: vi.fn(),
        },
    };
});

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },
}));

import { supabase } from '../lib/supabaseClient';
import { useUpdateProfile } from '../lib/profileAPI';

const wrapper = ({ children }: { children: React.ReactNode }) => {
    const client = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    return React.createElement(QueryClientProvider, { client }, children);
};

const buildUpdateChain = (result: { data: any; error: any }, capture: { payload?: any }) => ({
    update: (payload: any) => {
        capture.payload = payload;
        return {
            eq: () => ({
                select: () => ({
                    single: async () => result,
                }),
            }),
        };
    },
});

describe('useUpdateProfile sanitization', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('strips fields outside the whitelist before hitting Supabase', async () => {
        (supabase.auth.getUser as any).mockResolvedValueOnce({
            data: { user: { id: 'user-1' } },
        });

        const capture: { payload?: any } = {};
        (supabase.from as any).mockReturnValueOnce(
            buildUpdateChain(
                { data: { id: 'user-1', full_name: 'Jane' }, error: null },
                capture
            )
        );

        const { result } = renderHook(() => useUpdateProfile(), { wrapper });

        await result.current.mutateAsync({
            full_name: 'Jane',
            avatar_url: 'https://example.com/avatar.png',
            phone: '+1-555-0000',
            address: '1 Music St',
            id: 'evil-id',
            role: 'super_admin',
            email: 'x@y.z',
        } as any);

        await waitFor(() => expect(capture.payload).toBeDefined());
        expect(capture.payload.id).toBeUndefined();
        expect(capture.payload.role).toBeUndefined();
        expect(capture.payload.email).toBeUndefined();
        expect(capture.payload.full_name).toBe('Jane');
        expect(capture.payload.avatar_url).toBe('https://example.com/avatar.png');
        expect(capture.payload.phone).toBe('+1-555-0000');
        expect(capture.payload.address).toBe('1 Music St');
        expect(capture.payload.updated_at).toBeDefined();
    });

    it('rejects when not authenticated', async () => {
        (supabase.auth.getUser as any).mockResolvedValueOnce({ data: { user: null } });

        const { result } = renderHook(() => useUpdateProfile(), { wrapper });

        await expect(result.current.mutateAsync({ full_name: 'Jane' })).rejects.toThrow(
            /authenticated/i
        );
    });
});
