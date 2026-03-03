import { describe, it, expect, beforeEach } from 'vitest';
import { useAdminStore } from '../lib/adminStore';

describe('Admin Store', () => {
    beforeEach(() => {
        // Clear store before each test
        const state = useAdminStore.getState();
        state.logout();
    });

    it('should have initial empty state', () => {
        const state = useAdminStore.getState();
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.isAuthenticated).toBe(false);
    });

    it('should login and set state correctly', () => {
        const testUser = {
            email: 'admin@arasounds.com',
            name: 'Admin User',
            role: 'super_admin' as const,
            token: 'test-token'
        };

        useAdminStore.getState().login(testUser.email, testUser.name, testUser.role, testUser.token);

        const state = useAdminStore.getState();
        expect(state.isAuthenticated).toBe(true);
        expect(state.token).toBe(testUser.token);
        expect(state.user?.email).toBe(testUser.email);
        expect(state.user?.name).toBe(testUser.name);
        expect(state.user?.role).toBe(testUser.role);
        expect(state.user?.id).toBeDefined();
    });

    it('should update user data correctly', () => {
        useAdminStore.getState().login('admin@arasounds.com', 'Admin', 'super_admin', 'token');

        useAdminStore.getState().updateUser({ name: 'Updated Name' });

        const state = useAdminStore.getState();
        expect(state.user?.name).toBe('Updated Name');
        expect(state.user?.email).toBe('admin@arasounds.com'); // Remains unchanged
    });

    it('should logout and clear state', () => {
        useAdminStore.getState().login('admin@arasounds.com', 'Admin', 'super_admin', 'token');
        useAdminStore.getState().logout();

        const state = useAdminStore.getState();
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
    });
});
