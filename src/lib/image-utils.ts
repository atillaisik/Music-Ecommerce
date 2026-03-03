/**
 * Image handling utilities for basic optimization and Supabase integration
 */

/**
 * Builds a Supabase storage URL for a given bucket and path
 * @param bucket The storage bucket name
 * @param path The path to the file within the bucket
 * @returns The full public URL
 */
export const getSupabaseImageUrl = (bucket: string, path: string): string => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) return path;
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

/**
 * Simple image optimizer that appends Unsplash parameters if it's an Unsplash URL
 * @param url The original image URL
 * @param width Optional width
 * @param height Optional height
 * @param quality Optional quality (1-100)
 * @returns The optimized URL
 */
export const optimizeImage = (
    url: string,
    width?: number,
    height?: number,
    quality: number = 75
): string => {
    if (!url) return "";

    // If it's an Unsplash URL, we can use their API
    if (url.includes("images.unsplash.com")) {
        const baseUrl = url.split("?")[0];
        const params = new URLSearchParams();
        if (width) params.set("w", width.toString());
        if (height) params.set("h", height.toString());
        params.set("q", quality.toString());
        params.set("fit", "crop");
        params.set("auto", "format");
        return `${baseUrl}?${params.toString()}`;
    }

    // For other URLs, just return as is (could add specific logic for other CDNs)
    return url;
};

/**
 * Preloads an image to the browser cache
 * @param url The URL of the image to preload
 * @returns A promise that resolves when the image is loaded
 */
export const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = (err) => reject(err);
    });
};
