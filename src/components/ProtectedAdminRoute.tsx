import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminStore } from '@/lib/adminStore';
import { AdminRole } from '@/types/admin';

interface ProtectedAdminRouteProps {
    children: ReactNode;
    requiredRole?: AdminRole;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
    children,
    requiredRole
}) => {
    const { isAuthenticated, user } = useAdminStore();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // If a specific role is required and user doesn't have it
    if (requiredRole && user) {
        const roles: AdminRole[] = ['viewer', 'editor', 'super_admin'];
        const userRoleIndex = roles.indexOf(user.role);
        const requiredRoleIndex = roles.indexOf(requiredRole);

        if (userRoleIndex < requiredRoleIndex) {
            // If user role is lower than required role
            return <Navigate to="/admin" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedAdminRoute;
