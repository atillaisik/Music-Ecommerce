import { supabase } from './supabaseClient';
import { toast } from 'sonner';

/**
 * Validates file type and size.
 * 
 * @param file - File to validate.
 * @returns Object with isValid and error message.
 */
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
        return { isValid: false, error: 'File type not supported. Please upload JPEG, PNG, WEBP or SVG.' };
    }

    if (file.size > maxFileSize) {
        return { isValid: false, error: 'File is too large. Max size is 5MB.' };
    }

    return { isValid: true };
};

/**
 * Uploads an image to Supabase storage and returns the public URL.
 * 
 * @param file - The image file to upload.
 * @param bucketName - The name of the storage bucket.
 * @param folderName - Optional folder name within the bucket.
 * @param onProgress - Optional callback for upload progress (0-100).
 * @returns The public URL of the uploaded image.
 */
export const uploadImage = async (
    file: File,
    bucketName: string = 'product-images',
    folderName: string = 'products',
    onProgress?: (progress: number) => void
): Promise<string | null> => {
    const validation = validateFile(file);
    if (!validation.isValid) {
        toast.error(validation.error);
        return null;
    }

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = folderName ? `${folderName}/${fileName}` : fileName;

        // 1. Upload the file
        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file, {
                upsert: true,
                // Supabase JS client doesn't directly support onUploadProgress in all versions, 
                // but we can simulate it or use it if available in newer versions.
                // For now, we'll mark it as started.
            });

        if (onProgress) onProgress(100); // Mark as complete

        if (uploadError) {
            throw uploadError;
        }

        // 2. Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error: any) {
        console.error('Error uploading image:', error);
        toast.error(`Error uploading image: ${error.message}`);
        return null;
    }
};

/**
 * Batch upload multiple images.
 * 
 * @param files - Array of image files to upload.
 * @returns Array of public URLs.
 */
export const uploadImages = async (
    files: File[],
    bucketName: string = 'product-images',
    folderName: string = 'products'
): Promise<string[]> => {
    const uploadPromises = files.map(file => uploadImage(file, bucketName, folderName));
    const urls = await Promise.all(uploadPromises);
    return urls.filter((url): url is string => url !== null);
};

/**
 * Deletes an image from Supabase storage.
 * 
 * @param url - The public URL of the image to delete.
 * @param bucketName - The name of the storage bucket.
 */
export const deleteImage = async (
    url: string,
    bucketName: string = 'product-images'
): Promise<boolean> => {
    try {
        // Extract the file path from the public URL
        // Example: https://xxxxxxxx.supabase.co/storage/v1/object/public/product-images/products/filename.jpg
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split(`/storage/v1/object/public/${bucketName}/`);

        if (pathParts.length < 2) {
            console.warn('Could not extract file path from URL:', url);
            return false;
        }

        const filePath = pathParts[1];

        const { error } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

        if (error) {
            throw error;
        }

        return true;
    } catch (error: any) {
        console.error('Error deleting image:', error);
        return false;
    }
};
