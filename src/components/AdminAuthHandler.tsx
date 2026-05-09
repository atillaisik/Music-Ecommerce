import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAdminStore } from '@/lib/adminStore';

/**
 * Admin auth side-channel listener.
 *
 * Intentionally narrow:
 *  - On mount, hydrate the admin store from the current session (read-only).
 *  - On `SIGNED_OUT`, clear the admin store.
 *
 * It deliberately does NOT react to `SIGNED_IN`/`TOKEN_REFRESHED` — those
 * events fire while `useAdminStore.login()` is mid-flight, and a parallel
 * `refreshFromSession()` here would race the login's own admin-row fetch.
 * `ProtectedAdminRoute` re-validates on every protected mount, so we don't
 * need to chase the session here.
 */
export const AdminAuthHandler = () => {
    const refreshFromSession = useAdminStore((s) => s.refreshFromSession);
    const setUser = useAdminStore((s) => s.setUser);

    useEffect(() => {
        refreshFromSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT') {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [refreshFromSession, setUser]);

    return null;
};
