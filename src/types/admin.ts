export type AdminRole = 'super_admin' | 'editor' | 'viewer';

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: AdminRole;
    lastLogin?: string;
}

export interface AdminSession {
    user: AdminUser | null;
    token: string | null;
    isAuthenticated: boolean;
}
