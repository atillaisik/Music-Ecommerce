import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../lib/supabaseClient', () => ({
    supabase: {
        auth: { getSession: vi.fn() },
        rpc: vi.fn(),
    },
}));

vi.mock('sonner', () => ({
    toast: { success: vi.fn(), error: vi.fn(), info: vi.fn(), warning: vi.fn() },
}));

import { supabase } from '../lib/supabaseClient';
import { useCreateOrder } from '../lib/orderAPI';

const wrapper = ({ children }: { children: React.ReactNode }) => {
    const client = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    return React.createElement(QueryClientProvider, { client }, children);
};

const baseInput = {
    customer_name: 'Jane Doe',
    customer_email: 'jane@example.com',
    total_amount: 199.99,
    shipping_address: '1 Music St, NYC, 10001',
    items: [{ product_id: 'prod-1', quantity: 1, price_at_purchase: 199.99 }],
    payment_method: 'Credit Card',
};

describe('useCreateOrder', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('passes user_id from session for signed-in checkout', async () => {
        (supabase.auth.getSession as any).mockResolvedValueOnce({
            data: { session: { user: { id: 'user-42' } } },
        });
        (supabase.rpc as any).mockResolvedValueOnce({ data: 'order-1', error: null });

        const { result } = renderHook(() => useCreateOrder(), { wrapper });
        const order = await result.current.mutateAsync(baseInput);

        expect(order.id).toBe('order-1');
        expect(supabase.rpc).toHaveBeenCalledWith('create_order', expect.objectContaining({
            payload: expect.objectContaining({ user_id: 'user-42' }),
        }));
    });

    it('passes user_id=null for guest checkout', async () => {
        (supabase.auth.getSession as any).mockResolvedValueOnce({
            data: { session: null },
        });
        (supabase.rpc as any).mockResolvedValueOnce({ data: 'order-2', error: null });

        const { result } = renderHook(() => useCreateOrder(), { wrapper });
        await result.current.mutateAsync(baseInput);

        expect(supabase.rpc).toHaveBeenCalledWith('create_order', expect.objectContaining({
            payload: expect.objectContaining({ user_id: null }),
        }));
    });

    it('throws if cart is empty', async () => {
        (supabase.auth.getSession as any).mockResolvedValueOnce({ data: { session: null } });

        const { result } = renderHook(() => useCreateOrder(), { wrapper });
        await expect(
            result.current.mutateAsync({ ...baseInput, items: [] })
        ).rejects.toThrow(/cart/i);

        expect(supabase.rpc).not.toHaveBeenCalled();
    });

    it('throws if customer_email is blank', async () => {
        (supabase.auth.getSession as any).mockResolvedValueOnce({ data: { session: null } });

        const { result } = renderHook(() => useCreateOrder(), { wrapper });
        await expect(
            result.current.mutateAsync({ ...baseInput, customer_email: '   ' })
        ).rejects.toThrow(/customer_email/i);
    });

    it('surfaces Postgres errors from create_order', async () => {
        (supabase.auth.getSession as any).mockResolvedValueOnce({
            data: { session: { user: { id: 'user-1' } } },
        });
        (supabase.rpc as any).mockResolvedValueOnce({
            data: null,
            error: { code: '42501', message: 'permission denied' },
        });

        const { result } = renderHook(() => useCreateOrder(), { wrapper });
        await expect(result.current.mutateAsync(baseInput)).rejects.toMatchObject({
            code: 'forbidden',
        });
    });
});
