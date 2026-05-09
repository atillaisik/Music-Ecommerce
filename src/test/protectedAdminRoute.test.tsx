import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../lib/supabaseClient', () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
            signOut: vi.fn(async () => ({ error: null })),
        },
        from: vi.fn(),
    },
}));

import { supabase } from '../lib/supabaseClient';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';

const buildAdminQueryStub = (result: { data: any; error: any }) => ({
    select: () => ({
        eq: () => ({
            single: async () => result,
            maybeSingle: async () => result,
        }),
    }),
});

const renderProtected = (children: React.ReactNode, initialPath = '/admin') => {
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
                <Route path="/admin/login" element={<div>Login Page</div>} />
                <Route
                    path="/admin"
                    element={<ProtectedAdminRoute>{children}</ProtectedAdminRoute>}
                />
            </Routes>
        </MemoryRouter>
    );
};

describe('ProtectedAdminRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows the verifying state while checking', async () => {
        (supabase.auth.getSession as any).mockReturnValue(new Promise(() => {}));
        renderProtected(<div>Admin Dashboard</div>);
        expect(screen.getByText(/Verifying admin access/i)).toBeInTheDocument();
    });

    it('redirects to login when no session', async () => {
        (supabase.auth.getSession as any).mockResolvedValueOnce({ data: { session: null } });

        renderProtected(<div>Admin Dashboard</div>);

        await waitFor(() => {
            expect(screen.getByText('Login Page')).toBeInTheDocument();
        });
    });

    it('redirects (without signing out) when admin row missing', async () => {
        (supabase.auth.getSession as any).mockResolvedValueOnce({
            data: { session: { user: { id: 'rando' } } },
        });
        (supabase.from as any).mockReturnValueOnce(
            buildAdminQueryStub({ data: null, error: null })
        );

        renderProtected(<div>Admin Dashboard</div>);

        await waitFor(() => {
            expect(screen.getByText('Login Page')).toBeInTheDocument();
        });
        // Customers without an admin_users row keep their auth session — they
        // are just not allowed into /admin.
        expect(supabase.auth.signOut).not.toHaveBeenCalled();
    });

    it('redirects AND signs out when admin is inactive (active revocation)', async () => {
        (supabase.auth.getSession as any).mockResolvedValueOnce({
            data: { session: { user: { id: 'admin-1' } } },
        });
        (supabase.from as any).mockReturnValueOnce(
            buildAdminQueryStub({
                data: { id: 'admin-1', email: 'a@b.c', role: 'editor', is_active: false },
                error: null,
            })
        );

        renderProtected(<div>Admin Dashboard</div>);

        await waitFor(() => {
            expect(screen.getByText('Login Page')).toBeInTheDocument();
        });
        expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('renders children when admin is active', async () => {
        (supabase.auth.getSession as any).mockResolvedValueOnce({
            data: { session: { user: { id: 'admin-1' } } },
        });
        (supabase.from as any).mockReturnValueOnce(
            buildAdminQueryStub({
                data: { id: 'admin-1', email: 'a@b.c', role: 'super_admin', is_active: true },
                error: null,
            })
        );

        renderProtected(<div>Admin Dashboard</div>);

        await waitFor(() => {
            expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
        });
    });
});
