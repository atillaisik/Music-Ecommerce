import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';

let authChangeCallback: ((event: string, session: any) => void) | null = null;

vi.mock('../lib/supabaseClient', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
            onAuthStateChange: vi.fn((cb: any) => {
                authChangeCallback = cb;
                return {
                    data: {
                        subscription: { unsubscribe: vi.fn() },
                    },
                };
            }),
        },
    },
}));

const mockStoreState = {
    setUser: vi.fn(),
    setLoading: vi.fn(),
    syncWishlist: vi.fn(),
    fetchWishlist: vi.fn(),
    clearWishlist: vi.fn(),
};

vi.mock('../lib/store', () => ({
    useAuthStore: (selector?: (s: any) => any) => {
        const state = mockStoreState;
        return selector ? selector(state) : state;
    },
    useWishlistStore: (selector?: (s: any) => any) => {
        const state = mockStoreState;
        return selector ? selector(state) : state;
    },
}));

import { AppAuthHandler } from '../components/AppAuthHandler';
import { supabase } from '../lib/supabaseClient';

describe('AppAuthHandler', () => {
    beforeEach(() => {
        authChangeCallback = null;
        Object.values(mockStoreState).forEach((m) => (m as any).mockClear?.());
    });

    it('sets user and fetches wishlist on initial signed-in session', async () => {
        (supabase.auth.getSession as any).mockResolvedValueOnce({
            data: {
                session: {
                    user: {
                        id: 'user-1',
                        email: 'jane@example.com',
                        user_metadata: { full_name: 'Jane Doe' },
                    },
                },
            },
        });

        render(<AppAuthHandler />);

        await waitFor(() => {
            expect(mockStoreState.setUser).toHaveBeenCalledWith({
                id: 'user-1',
                email: 'jane@example.com',
                name: 'Jane Doe',
            });
        });
        expect(mockStoreState.fetchWishlist).toHaveBeenCalled();
    });

    it('clears user and wishlist on SIGNED_OUT', async () => {
        (supabase.auth.getSession as any).mockResolvedValueOnce({ data: { session: null } });

        render(<AppAuthHandler />);

        await waitFor(() => expect(authChangeCallback).not.toBeNull());

        authChangeCallback!('SIGNED_OUT', null);

        expect(mockStoreState.setUser).toHaveBeenLastCalledWith(null);
        expect(mockStoreState.clearWishlist).toHaveBeenCalled();
    });

    it('triggers syncWishlist on SIGNED_IN event', async () => {
        (supabase.auth.getSession as any).mockResolvedValueOnce({ data: { session: null } });

        render(<AppAuthHandler />);

        await waitFor(() => expect(authChangeCallback).not.toBeNull());

        authChangeCallback!('SIGNED_IN', {
            user: {
                id: 'user-1',
                email: 'jane@example.com',
                user_metadata: { full_name: 'Jane' },
            },
        });

        expect(mockStoreState.syncWishlist).toHaveBeenCalled();
    });
});
