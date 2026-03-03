import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSupabaseImageUrl, optimizeImage } from '../lib/image-utils';

// Mock import.meta.env
vi.stubGlobal('import', {
    meta: {
        env: {
            VITE_SUPABASE_URL: 'https://test.supabase.co'
        }
    }
});

describe('Image Utils', () => {
    describe('getSupabaseImageUrl', () => {
        it('should build a public URL correctly', () => {
            const bucket = 'bucket';
            const path = 'path/to/image.jpg';
            const url = getSupabaseImageUrl(bucket, path);

            expect(url).toContain(`/storage/v1/object/public/${bucket}/${path}`);
            expect(url).toMatch(/^https?:\/\//);
        });
    });

    describe('optimizeImage', () => {
        it('should optimize Unsplash URLs', () => {
            const unsplashUrl = 'https://images.unsplash.com/photo-1234?ixlib=rb-1.2.1';
            const optimized = optimizeImage(unsplashUrl, 800, 600, 80);

            expect(optimized).toContain('w=800');
            expect(optimized).toContain('h=600');
            expect(optimized).toContain('q=80');
            expect(optimized).toContain('fit=crop');
        });

        it('should return original URL for non-Unsplash images', () => {
            const otherUrl = 'https://example.com/image.jpg';
            expect(optimizeImage(otherUrl)).toBe(otherUrl);
        });

        it('should return empty string for empty input', () => {
            expect(optimizeImage('')).toBe('');
        });
    });
});
