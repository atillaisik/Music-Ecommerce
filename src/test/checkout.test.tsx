import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../lib/supabaseClient', () => ({
    supabase: {
        auth: { getSession: vi.fn(async () => ({ data: { session: null } })) },
        rpc: vi.fn(async () => ({ data: 'order-xyz', error: null })),
    },
}));

vi.mock('sonner', () => ({
    toast: { success: vi.fn(), error: vi.fn(), info: vi.fn(), warning: vi.fn() },
}));

vi.mock('../lib/wishlistAPI', () => ({
    wishlistAPI: {
        addToWishlist: vi.fn(),
        removeFromWishlist: vi.fn(),
        getWishlist: vi.fn(async () => []),
        syncWishlist: vi.fn(),
    },
}));

import Checkout from '../pages/Checkout';
import { useCartStore } from '../lib/store';
import type { Product } from '../types/product';

const mockProduct: Product = {
    id: 'prod-1',
    name: 'Test Guitar',
    brand_id: 'brand-1',
    category_id: 'cat-1',
    price: 199.99,
    rating: 5,
    reviews_count: 0,
    stock_quantity: 5,
    featured: false,
    on_sale: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

const renderCheckout = () => {
    const client = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    return render(
        <HelmetProvider>
            <QueryClientProvider client={client}>
                <MemoryRouter initialEntries={['/checkout']}>
                    <Routes>
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/checkout/success" element={<div>Order Success</div>} />
                        <Route path="/shop" element={<div>Shop</div>} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        </HelmetProvider>
    );
};

describe('Checkout flow', () => {
    beforeEach(() => {
        useCartStore.getState().clearCart();
        useCartStore.getState().addToCart(mockProduct);
        vi.clearAllMocks();
    });

    it('renders the shipping form first', () => {
        renderCheckout();
        expect(screen.getByText(/Shipping Information/i)).toBeInTheDocument();
    });

    it('redirects to /shop when cart is empty', async () => {
        useCartStore.getState().clearCart();
        renderCheckout();
        await waitFor(() => {
            expect(screen.getByText('Shop')).toBeInTheDocument();
        });
    });

    it('walks through shipping → payment → review → place order', async () => {
        renderCheckout();

        fireEvent.change(screen.getByLabelText(/Full Name/i), {
            target: { value: 'Jane Doe' },
        });
        fireEvent.change(screen.getByLabelText(/Email Address/i), {
            target: { value: 'jane@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/Street Address/i), {
            target: { value: '1 Music St' },
        });
        fireEvent.change(screen.getByLabelText(/City/i), {
            target: { value: 'New York' },
        });
        fireEvent.change(screen.getByLabelText(/ZIP Code/i), {
            target: { value: '10001' },
        });
        fireEvent.click(screen.getByText(/Continue to Payment/i));

        await waitFor(() => expect(screen.getByText(/Payment Method/i)).toBeInTheDocument());

        fireEvent.change(screen.getByLabelText(/Card Number/i), {
            target: { value: '4242 4242 4242 4242' },
        });
        fireEvent.change(screen.getByLabelText(/CVV/i), {
            target: { value: '123' },
        });
        fireEvent.click(screen.getByText(/Review Order/i));

        await waitFor(() =>
            expect(screen.getByText(/Review Your Order/i)).toBeInTheDocument()
        );

        fireEvent.click(screen.getByText(/Place Order/i));

        await waitFor(() => expect(screen.getByText('Order Success')).toBeInTheDocument());
    });
});
