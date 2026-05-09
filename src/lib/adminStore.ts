import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser, AdminRole } from '@/types/admin';
import { supabase } from '@/lib/supabaseClient';

export type AdminLoginResult =
    | { ok: true }
    | { ok: false; error: string };

interface AdminAuthState {
    user: AdminUser | null;
    role: AdminRole | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<AdminLoginResult>;
    logout: () => Promise<void>;
    refreshFromSession: () => Promise<void>;
    setUser: (user: AdminUser | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

const fetchAdminRow = async (userId: string) => {
    // `.maybeSingle()` returns `data: null` (no error) when no row matches,
    // instead of `.single()`'s 406 error. This avoids tripping the error
    // branch when a regular customer is signed in.
    const { data, error } = await supabase
        .from('admin_users')
        .select('id, email, role, is_active')
        .eq('id', userId)
        .maybeSingle();

    if (error) {
        return { ok: false as const, error: error.message || 'Could not load admin profile.' };
    }
    if (!data) {
        return { ok: false as const, error: 'No admin record found for this account.' };
    }
    if (!data.is_active) {
        return { ok: false as const, error: 'Your admin account has been deactivated.' };
    }

    return { ok: true as const, row: data };
};

export const useAdminStore = create<AdminAuthState>()(
    persist(
        (set, get) => ({
            user: null,
            role: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            setUser: (user) =>
                set({
                    user,
                    role: user?.role ?? null,
                    isAuthenticated: !!user,
                    isLoading: false,
                    error: null,
                }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error, isLoading: false }),

            login: async (email, password) => {
                set({ isLoading: true, error: null });

                const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (authError || !authData.user) {
                    let message = 'Please check your email and password.';
                    if (authError?.message === 'Email not confirmed') {
                        message = 'Your email address has not been confirmed yet.';
                    } else if (authError?.message === 'Invalid login credentials') {
                        message = 'The email or password you entered is incorrect.';
                    }
                    set({ isLoading: false, error: message });
                    return { ok: false, error: message };
                }

                const result = await fetchAdminRow(authData.user.id);
                if (!result.ok) {
                    await supabase.auth.signOut();
                    set({
                        user: null,
                        role: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: result.error,
                    });
                    return { ok: false, error: result.error };
                }

                const adminUser: AdminUser = {
                    id: result.row.id,
                    email: result.row.email,
                    name: result.row.email.split('@')[0],
                    role: result.row.role as AdminRole,
                    lastLogin: new Date().toISOString(),
                };

                set({
                    user: adminUser,
                    role: adminUser.role,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });

                return { ok: true };
            },

            logout: async () => {
                await supabase.auth.signOut();
                set({
                    user: null,
                    role: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                });
            },

            refreshFromSession: async () => {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session?.user) {
                    set({ user: null, role: null, isAuthenticated: false });
                    return;
                }

                const result = await fetchAdminRow(session.user.id);
                if (!result.ok) {
                    // Don't sign the user out here — they may be a regular
                    // customer who just isn't an admin. Just clear the admin
                    // store; ProtectedAdminRoute will redirect them away from
                    // /admin if they try to access it.
                    set({ user: null, role: null, isAuthenticated: false, error: null });
                    return;
                }

                const adminUser: AdminUser = {
                    id: result.row.id,
                    email: result.row.email,
                    name: result.row.email.split('@')[0],
                    role: result.row.role as AdminRole,
                };

                set({
                    user: adminUser,
                    role: adminUser.role,
                    isAuthenticated: true,
                    error: null,
                });
            },
        }),
        {
            name: 'arasounds-admin-auth',
            partialize: (state) => ({
                user: state.user ? { id: state.user.id, role: state.user.role } : null,
                role: state.role,
            }),
        }
    )
);
