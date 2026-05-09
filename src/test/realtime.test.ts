import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

let capturedHandlers: Record<string, (payload: any) => void> = {};

vi.mock('../lib/supabaseClient', () => {
    const channel = (name: string) => ({
        on: (_event: string, _filter: any, handler: (payload: any) => void) => {
            capturedHandlers[name] = handler;
            return {
                subscribe: () => ({ name }),
            };
        },
    });
    return {
        supabase: {
            channel,
            removeChannel: vi.fn(),
        },
    };
});

vi.mock('sonner', () => ({
    toast: { info: vi.fn(), warning: vi.fn(), error: vi.fn(), success: vi.fn() },
}));

import { useRealTimeSubscriptions } from '../hooks/useRealTimeSubscriptions';

describe('useRealTimeSubscriptions (public)', () => {
    let client: QueryClient;
    let invalidateSpy: any;

    const wrapper = ({ children }: { children: React.ReactNode }) =>
        React.createElement(QueryClientProvider, { client }, children);

    beforeEach(() => {
        capturedHandlers = {};
        client = new QueryClient();
        invalidateSpy = vi.spyOn(client, 'invalidateQueries');
    });

    it('invalidates products cache on a public-products realtime event', () => {
        renderHook(() => useRealTimeSubscriptions(), { wrapper });

        const handler = capturedHandlers['public-products-realtime'];
        expect(handler).toBeDefined();

        act(() => {
            handler({
                eventType: 'UPDATE',
                new: { id: 'product-1', is_active: true },
                old: { id: 'product-1' },
            });
        });

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['products'] });
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['product', 'product-1'] });
    });

    it('invalidates categories cache on a public-categories realtime event', () => {
        renderHook(() => useRealTimeSubscriptions(), { wrapper });

        const handler = capturedHandlers['public-categories-realtime'];
        expect(handler).toBeDefined();

        act(() => {
            handler({
                eventType: 'UPDATE',
                new: { id: 'cat-1', is_active: true },
                old: { id: 'cat-1' },
            });
        });

        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['categories'] });
    });
});
