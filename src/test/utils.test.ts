import { describe, it, expect } from 'vitest';
import { cn, formatCurrency } from '../lib/utils';

describe('Utils', () => {
    describe('cn', () => {
        it('should merge class names correctly', () => {
            expect(cn('class1', 'class2')).toBe('class1 class2');
            expect(cn('class1', { 'class2': true, 'class3': false })).toBe('class1 class2');
            expect(cn('class1', undefined, null, false, 'class2')).toBe('class1 class2');
        });

        it('should handle tailwind class conflicts', () => {
            expect(cn('p-4', 'p-8')).toBe('p-8');
            expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
        });
    });

    describe('formatCurrency', () => {
        it('should format numbers to USD currency string', () => {
            expect(formatCurrency(100)).toBe('$100.00');
            expect(formatCurrency(99.99)).toBe('$99.99');
            expect(formatCurrency(0)).toBe('$0.00');
        });
    });
});
