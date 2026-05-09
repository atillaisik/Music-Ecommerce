import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAdminStore } from '../lib/adminStore';

vi.mock('../lib/supabaseClient', () => {
    return {
        supabase: {
            auth: {
                signInWithPassword: vi.fn(),
                signOut: vi.fn(async () => ({ error: null })),
                getSession: vi.fn(async () => ({ data: { session: null } })),
            },
            from: vi.fn(),
        },
    };
});

import { supabase } from '../lib/supabaseClient';

const adminRow = {
    id: 'user-123',
    email: 'admin@arasounds.com',
    role: 'super_admin' as const,
    is_active: true,
};

const buildAdminQueryStub = (result: { data: typeof adminRow | null; error: any }) => ({
    select: () => ({
        eq: () => ({
            single: async () => result,
            maybeSingle: async () => result,
        }),
    }),
});

describe('Admin Store', () => {
    beforeEach(async () => {
        vi.clearAllMocks();
        await useAdminStore.getState().logout();
    });

    it('starts unauthenticated with empty state', () => {
        const state = useAdminStore.getState();
        expect(state.user).toBeNull();
        expect(state.role).toBeNull();
        expect(state.isAuthenticated).toBe(false);
    });

    it('logs in via Supabase Auth and loads admin row', async () => {
        (supabase.auth.signInWithPassword as any).mockResolvedValueOnce({
            data: { user: { id: adminRow.id, email: adminRow.email } },
            error: null,
        });
        (supabase.from as any).mockReturnValueOnce(
            buildAdminQueryStub({ data: adminRow, error: null })
        );

        const result = await useAdminStore.getState().login(adminRow.email, 'password123');

        expect(result.ok).toBe(true);
        const state = useAdminStore.getState();
        expect(state.isAuthenticated).toBe(true);
        expect(state.user?.role).toBe('super_admin');
        expect(state.user?.id).toBe(adminRow.id);
    });

    it('rejects login when admin row is missing', async () => {
        (supabase.auth.signInWithPassword as any).mockResolvedValueOnce({
            data: { user: { id: 'random', email: 'rando@example.com' } },
            error: null,
        });
        (supabase.from as any).mockReturnValueOnce(
            buildAdminQueryStub({ data: null, error: { message: 'No rows' } })
        );

        const result = await useAdminStore.getState().login('rando@example.com', 'password');

        expect(result.ok).toBe(false);
        expect(useAdminStore.getState().isAuthenticated).toBe(false);
        expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('rejects login when admin is inactive', async () => {
        (supabase.auth.signInWithPassword as any).mockResolvedValueOnce({
            data: { user: { id: adminRow.id, email: adminRow.email } },
            error: null,
        });
        (supabase.from as any).mockReturnValueOnce(
            buildAdminQueryStub({
                data: { ...adminRow, is_active: false },
                error: null,
            })
        );

        const result = await useAdminStore.getState().login(adminRow.email, 'password');

        expect(result.ok).toBe(false);
        if (result.ok === false) {
            expect(result.error.toLowerCase()).toContain('deactivated');
        }
    });

    it('rejects login on bad credentials', async () => {
        (supabase.auth.signInWithPassword as any).mockResolvedValueOnce({
            data: { user: null },
            error: { message: 'Invalid login credentials' },
        });

        const result = await useAdminStore.getState().login('a@b.com', 'wrong');

        expect(result.ok).toBe(false);
        expect(useAdminStore.getState().isAuthenticated).toBe(false);
    });

    it('clears state on logout', async () => {
        useAdminStore.getState().setUser({
            id: adminRow.id,
            email: adminRow.email,
            name: 'admin',
            role: 'super_admin',
        });
        expect(useAdminStore.getState().isAuthenticated).toBe(true);

        await useAdminStore.getState().logout();

        const state = useAdminStore.getState();
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.role).toBeNull();
    });
});
