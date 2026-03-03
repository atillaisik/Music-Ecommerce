import { describe, it, expect, vi } from 'vitest';
import { validateFile } from '../lib/imageUploader';

describe('Image Uploader', () => {
    describe('validateFile', () => {
        it('should validate allowed file types', () => {
            const pngFile = new File(['test'], 'test.png', { type: 'image/png' });
            const jpegFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const webpFile = new File(['test'], 'test.webp', { type: 'image/webp' });
            const svgFile = new File(['test'], 'test.svg', { type: 'image/svg+xml' });

            expect(validateFile(pngFile).isValid).toBe(true);
            expect(validateFile(jpegFile).isValid).toBe(true);
            expect(validateFile(webpFile).isValid).toBe(true);
            expect(validateFile(svgFile).isValid).toBe(true);
        });

        it('should fail for unsupported file types', () => {
            const pdfFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
            const result = validateFile(pdfFile);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('File type not supported');
        });

        it('should fail for files larger than 5MB', () => {
            // Create a file larger than 5MB
            const largeFile = new File(['a'.repeat(6 * 1024 * 1024)], 'large.png', { type: 'image/png' });
            const result = validateFile(largeFile);
            expect(result.isValid).toBe(false);
            expect(result.error).toContain('File is too large');
        });
    });
});
