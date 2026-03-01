import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '../lib/store';

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
