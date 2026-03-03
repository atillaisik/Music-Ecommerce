import { supabase } from './supabaseClient';
import { toast } from 'sonner';

/**
 * Uploads an image to Supabase storage and returns the public URL.
 * 
 * @param file - The image file to upload.
 * @param bucketName - The name of the storage bucket.
 * @param folderName - Optional folder name within the bucket.
 * @returns The public URL of the uploaded image.
 */
export const uploadImage = async (
    file: File,
    bucketName: string = 'product-images',
    folderName: string = 'products'
): Promise<string | null> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = folderName ? `${folderName}/${fileName}` : fileName;

        // 1. Upload the file
        const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file);

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
