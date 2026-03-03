import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser, AdminRole } from '@/types/admin';

interface AdminAuthState {
    user: AdminUser | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, name: string, role: AdminRole, token: string) => void;
    logout: () => void;
    updateUser: (userData: Partial<AdminUser>) => void;
}

export const useAdminStore = create<AdminAuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (email, name, role, token) =>
                set({
                    user: {
                        id: Math.random().toString(36).substr(2, 9),
                        email,
                        name,
                        role,
                        lastLogin: new Date().toISOString()
                    },
                    token,
                    isAuthenticated: true,
                }),
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
            updateUser: (userData) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                })),
        }),
        {
            name: 'arasounds-admin-auth',
        }
    )
);
