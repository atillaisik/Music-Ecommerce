import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore, useWishlistStore } from '@/lib/store';

export const AppAuthHandler = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const syncWishlist = useWishlistStore((state) => state.syncWishlist);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  useEffect(() => {
    // 1. Check initial session
    const initSession = async () => {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        });
        // Fetch server wishlist on mount if authenticated
        fetchWishlist();
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initSession();

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        });

        if (event === 'SIGNED_IN') {
          syncWishlist();
        }
      } else {
        setUser(null);
        if (event === 'SIGNED_OUT') {
          clearWishlist();
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  return null;
};
