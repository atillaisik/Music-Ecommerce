import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminStore } from '@/lib/adminStore';
import { AdminRole } from '@/types/admin';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

interface ProtectedAdminRouteProps {
    children: ReactNode;
    requiredRole?: AdminRole;
}

const ROLE_RANK: Record<AdminRole, number> = {
    viewer: 0,
    editor: 1,
    super_admin: 2,
};

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
    children,
    requiredRole,
}) => {
    const location = useLocation();
    const user = useAdminStore((s) => s.user);
    const [status, setStatus] = useState<'checking' | 'allowed' | 'denied'>('checking');

    useEffect(() => {
        let cancelled = false;

        const verify = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.user) {
                if (!cancelled) setStatus('denied');
                return;
            }

            const { data, error } = await supabase
                .from('admin_users')
                .select('id, email, role, is_active')
                .eq('id', session.user.id)
                .maybeSingle();

            if (cancelled) return;

            if (error || !data) {
                // Signed-in but not an admin — kick them out of /admin but
                // keep their auth session intact (they may be a customer).
                useAdminStore.getState().setUser(null);
                setStatus('denied');
                return;
            }

            if (!data.is_active) {
                // Active revocation — sign them out completely.
                await supabase.auth.signOut();
                useAdminStore.getState().setUser(null);
                setStatus('denied');
                return;
            }

            useAdminStore.getState().setUser({
                id: data.id,
                email: data.email,
                name: data.email.split('@')[0],
                role: data.role as AdminRole,
            });

            if (requiredRole && ROLE_RANK[data.role as AdminRole] < ROLE_RANK[requiredRole]) {
                setStatus('denied');
                return;
            }

            setStatus('allowed');
        };

        verify();

        return () => {
            cancelled = true;
        };
    }, [location.pathname, requiredRole]);

    if (status === 'checking') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-sm">Verifying admin access…</span>
            </div>
        );
    }

    if (status === 'denied') {
        const fallback = requiredRole && user ? '/admin' : '/admin/login';
        return <Navigate to={fallback} state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedAdminRoute;
