import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';
import { Product as MockProduct } from '@/data/mock';

export type CartItem = (Product | MockProduct) & {
    quantity: number;
};

interface CartState {
    items: CartItem[];
    addToCart: (product: Product | MockProduct) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    subtotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (product: Product | MockProduct) => {
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === product.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    }
                    return { items: [...state.items, { ...product, quantity: 1 }] };
                });
            },
            removeFromCart: (productId: string) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId),
                }));
            },
            updateQuantity: (productId: string, quantity: number) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
                    ).filter(item => item.quantity > 0),
                }));
            },
            clearCart: () => set({ items: [] }),
            totalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },
            subtotal: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'arasounds-cart',
        }
    )
);

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            setUser: (user) => set({ 
                user, 
                isAuthenticated: !!user,
                isLoading: false,
                error: null 
            }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error, isLoading: false }),
            logout: () => set({ user: null, isAuthenticated: false, error: null }),
        }),
        {
            name: 'arasounds-auth',
        }
    )
);

interface WishlistState {
    items: (Product | MockProduct)[];
    addToWishlist: (product: Product | MockProduct) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            addToWishlist: (product: Product | MockProduct) => {
                set((state) => ({
                    items: [...state.items, product]
                }));
            },
            removeFromWishlist: (productId: string) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId)
                }));
            },
            isInWishlist: (productId: string) => {
                return get().items.some((item) => item.id === productId);
            },
        }),
        {
            name: 'arasounds-wishlist',
        }
    )
);

interface CarouselState {
    indices: Record<string, number>;
    setIndex: (productId: string, index: number) => void;
}

export const useCarouselStore = create<CarouselState>()(
    persist(
        (set) => ({
            indices: {},
            setIndex: (productId, index) => {
                set((state) => ({
                    indices: { ...state.indices, [productId]: index }
                }));
            },
        }),
        {
            name: 'arasounds-carousel',
        }
    )
);

