import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCartStore, useWishlistStore } from '../lib/store';

const mockProduct = {
    id: '1',
    name: 'Test Guitar',
    brand: 'Fender',
    category: 'Guitars',
    price: 1000,
    rating: 5,
    reviews: 10,
    image: 'test.jpg'
};

describe('Cart Store', () => {
    beforeEach(() => {
        useCartStore.getState().clearCart();
    });

    it('should add an item to the cart', () => {
        useCartStore.getState().addToCart(mockProduct);
        const state = useCartStore.getState();
        expect(state.items).toHaveLength(1);
        expect(state.items[0].id).toBe('1');
        expect(state.items[0].quantity).toBe(1);
    });

    it('should increment quantity when adding the same item', () => {
        useCartStore.getState().addToCart(mockProduct);
        useCartStore.getState().addToCart(mockProduct);
        const state = useCartStore.getState();
        expect(state.items).toHaveLength(1);
        expect(state.items[0].quantity).toBe(2);
    });

    it('should remove an item from the cart', () => {
        useCartStore.getState().addToCart(mockProduct);
        useCartStore.getState().removeFromCart('1');
        const state = useCartStore.getState();
        expect(state.items).toHaveLength(0);
    });

    it('should update quantity of an item', () => {
        useCartStore.getState().addToCart(mockProduct);
        useCartStore.getState().updateQuantity('1', 5);
        const state = useCartStore.getState();
        expect(state.items[0].quantity).toBe(5);
    });

    it('should remove item if quantity is updated to 0', () => {
        useCartStore.getState().addToCart(mockProduct);
        useCartStore.getState().updateQuantity('1', 0);
        const state = useCartStore.getState();
        expect(state.items).toHaveLength(0);
    });

    it('should calculate total items correctly', () => {
        useCartStore.getState().addToCart(mockProduct);
        useCartStore.getState().addToCart({ ...mockProduct, id: '2' });
        useCartStore.getState().updateQuantity('1', 3);
        expect(useCartStore.getState().totalItems()).toBe(4);
    });

    it('should calculate subtotal correctly', () => {
        useCartStore.getState().addToCart(mockProduct); // 1000
        useCartStore.getState().updateQuantity('1', 2); // 2000
        expect(useCartStore.getState().subtotal()).toBe(2000);
    });
});

describe('Wishlist Store', () => {
    beforeEach(() => {
        useWishlistStore.getState().clearWishlist();
        vi.clearAllMocks();
    });

    it('should add an item to the wishlist', async () => {
        await useWishlistStore.getState().addToWishlist(mockProduct);
        const state = useWishlistStore.getState();
        expect(state.items).toHaveLength(1);
        expect(state.items[0].id).toBe('1');
    });

    it('should remove an item from the wishlist', async () => {
        await useWishlistStore.getState().addToWishlist(mockProduct);
        await useWishlistStore.getState().removeFromWishlist('1');
        const state = useWishlistStore.getState();
        expect(state.items).toHaveLength(0);
    });

    it('should rollback wishlist if API call fails', async () => {
        const { wishlistAPI } = await import('../lib/wishlistAPI');
        const { useAuthStore } = await import('../lib/store');
        
        // Mock authenticated state
        vi.spyOn(useAuthStore, 'getState').mockReturnValue({
            isAuthenticated: true,
            user: { id: 'user-1', email: 'test@example.com', name: 'Test User' },
            isLoading: false,
            error: null,
            setUser: vi.fn(),
            setLoading: vi.fn(),
            setError: vi.fn(),
            logout: vi.fn()
        } as any);

        // Mock API failure
        vi.spyOn(wishlistAPI, 'addToWishlist').mockRejectedValue(new Error('API Error'));

        // Initial state should be empty
        expect(useWishlistStore.getState().items).toHaveLength(0);

        // Call addToWishlist and expect it to throw
        await expect(useWishlistStore.getState().addToWishlist(mockProduct)).rejects.toThrow('API Error');

        // State should be back to empty after rollback
        expect(useWishlistStore.getState().items).toHaveLength(0);
    });
});
