import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/mock';

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addToCart: (product: Product) => void;
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
            addToCart: (product: Product) => {
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
