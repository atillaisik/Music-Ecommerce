import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabaseClient';
import { Product, ProductFormData, Category, Brand } from '../types/product';
import { toast } from 'sonner';

// --- Categories & Brands ---

export const useCategories = (onlyActive = false) => {
    return useQuery({
        queryKey: ['categories', { onlyActive }],
        queryFn: async () => {
            let query = supabase
                .from('categories')
                .select('*')
                .order('display_order', { ascending: true });

            if (onlyActive) {
                query = query.eq('is_active', true);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data as Category[];
        }
    });
};

export const useBrands = () => {
    return useQuery({
        queryKey: ['brands'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('brands')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            return data as Brand[];
        }
    });
};

export const useCategory = (id: string | undefined) => {
    return useQuery({
        queryKey: ['category', id],
        queryFn: async () => {
            if (!id) return null;
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Category;
        },
        enabled: !!id
    });
};

export const useBrand = (id: string | undefined) => {
    return useQuery({
        queryKey: ['brand', id],
        queryFn: async () => {
            if (!id) return null;
            const { data, error } = await supabase
                .from('brands')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Brand;
        },
        enabled: !!id
    });
};

// --- Products ---

export const useProducts = (filters: {
    category_id?: string;
    brand_id?: string;
    search?: string;
    sort?: string;
    is_active?: boolean;
} = {}) => {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: async () => {
            let query = supabase
                .from('products')
                .select('*, brand:brands(*), category:categories(*), images:product_images(*)');

            if (filters.category_id) query = query.eq('category_id', filters.category_id);
            if (filters.brand_id) query = query.eq('brand_id', filters.brand_id);
            if (filters.search) query = query.ilike('name', `%${filters.search}%`);
            if (filters.is_active !== undefined) query = query.eq('is_active', filters.is_active);

            if (filters.sort) {
                const [column, order] = filters.sort.split(':');
                query = query.order(column, { ascending: order === 'asc' });
            } else {
                query = query.order('created_at', { ascending: false });
            }

            const { data, error } = await query;
            if (error) throw error;
            return data as Product[];
        }
    });
};

export const useProduct = (id: string | undefined) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            if (!id) return null;
            const { data, error } = await supabase
                .from('products')
                .select('*, brand:brands(*), category:categories(*), images:product_images(*)')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Product;
        },
        enabled: !!id
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: ProductFormData) => {
            // 1. Create product
            const { images, ...productData } = formData;
            const { data: product, error: productError } = await supabase
                .from('products')
                .insert([productData])
                .select()
                .single();

            if (productError) throw productError;

            // 2. Handle images (this is simplified, real implementation would upload to storage)
            if (images.length > 0) {
                const imageRows = images.map((img, index) => ({
                    product_id: product.id,
                    image_url: img.url,
                    display_order: img.display_order ?? index,
                    is_primary: img.is_primary ?? (index === 0)
                }));

                const { error: imageError } = await supabase
                    .from('product_images')
                    .insert(imageRows)
                    .select();

                if (imageError) {
                    console.error("Error inserting product images:", imageError);
                    throw new Error(`Product created, but failed to save images: ${imageError.message}`);
                }
            }

            return product;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Product created successfully');
        },
        onError: (error) => {
            toast.error(`Error creating product: ${error.message}`);
        }
    });
};

export const useUpdateProduct = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: ProductFormData) => {
            const { images, ...productData } = formData;

            // 1. Update product
            const { error: productError } = await supabase
                .from('products')
                .update(productData)
                .eq('id', id);

            if (productError) throw productError;

            // 2. Update images (simplified: delete existing and re-insert)
            // In a real app, you'd manage this more carefully
            const { error: deleteImagesError } = await supabase
                .from('product_images')
                .delete()
                .eq('product_id', id);

            if (deleteImagesError) {
                console.error("Error deleting product images:", deleteImagesError);
                throw new Error(`Failed to update product images (Cleanup step): ${deleteImagesError.message}`);
            }

            if (images.length > 0) {
                const imageRows = images.map((img, index) => ({
                    product_id: id,
                    image_url: img.url,
                    display_order: img.display_order ?? index,
                    is_primary: img.is_primary ?? (index === 0)
                }));

                const { error: imageError } = await supabase
                    .from('product_images')
                    .insert(imageRows)
                    .select(); // Added .select() to catch RLS errors

                if (imageError) {
                    console.error("Error inserting product images:", imageError);
                    throw new Error(`Product updated, but failed to save images: ${imageError.message}`);
                }
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', id] });
            toast.success('Product updated successfully');
        },
        onError: (error) => {
            toast.error(`Error updating product: ${error.message}`);
        }
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string): Promise<{ softDeleted: boolean }> => {
            // Step 1: Delete product images first (belt-and-suspenders, cascade handles it but
            // explicit deletion avoids any RLS hiccup on the images table).
            await supabase.from('product_images').delete().eq('product_id', id);

            // Step 2: Attempt hard delete and use .select() so Supabase returns the
            // deleted rows — if the array is empty and there's no error it means the
            // delete was silently blocked by an RLS policy or the row doesn't exist.
            const { data: deleted, error } = await supabase
                .from('products')
                .delete()
                .eq('id', id)
                .select('id');

            if (error) {
                // FK violation means the product is referenced by order_items.
                // Fall back to soft-delete so order history is preserved.
                if (error.code === '23503') {
                    const { error: softErr } = await supabase
                        .from('products')
                        .update({ is_active: false })
                        .eq('id', id);
                    if (softErr) throw softErr;
                    return { softDeleted: true };
                }
                throw error;
            }

            // No error but 0 rows affected → RLS silently blocked the delete.
            if (!deleted || deleted.length === 0) {
                throw new Error('Delete was blocked. You may not have permission to delete this product.');
            }

            return { softDeleted: false };
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            if (result?.softDeleted) {
                toast.warning('Product has existing orders — it was deactivated instead of deleted to preserve order history.');
            } else {
                toast.success('Product deleted successfully');
            }
        },
        onError: (error: any) => {
            toast.error(`Failed to delete product: ${error.message}`);
        }
    });
};

export const useBulkDeleteProducts = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids: string[]) => {
            // Delete product images for all selected products first.
            await supabase.from('product_images').delete().in('product_id', ids);

            const { data: deleted, error } = await supabase
                .from('products')
                .delete()
                .in('id', ids)
                .select('id');

            if (error) {
                // Some products may be referenced by orders; soft-delete the whole batch.
                if (error.code === '23503') {
                    const { error: softErr } = await supabase
                        .from('products')
                        .update({ is_active: false })
                        .in('id', ids);
                    if (softErr) throw softErr;
                    return { softDeleted: true, count: ids.length };
                }
                throw error;
            }

            if (!deleted || deleted.length === 0) {
                throw new Error('Delete was blocked. You may not have permission to delete these products.');
            }

            return { softDeleted: false, count: deleted.length };
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            if (result?.softDeleted) {
                toast.warning(`${result.count} product(s) have existing orders — they were deactivated instead of deleted.`);
            } else {
                toast.success(`${result?.count ?? 'Selected'} product(s) deleted successfully`);
            }
        },
        onError: (error: any) => {
            toast.error(`Failed to delete products: ${error.message}`);
        }
    });
};

export const useBulkUpdateProducts = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ ids, data }: { ids: string[], data: Partial<Product> }) => {
            const { error } = await supabase
                .from('products')
                .update(data)
                .in('id', ids);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('Selected products updated successfully');
        },
        onError: (error) => {
            toast.error(`Error updating products: ${error.message}`);
        }
    });
};

export const useImportProducts = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (rows: any[]) => {
            // 1. Get unique brands and categories from rows
            const uniqueBrands = [...new Set(rows.map(r => r.Brand).filter(Boolean))];
            const uniqueCategories = [...new Set(rows.map(r => r.Category).filter(Boolean))];

            // 2. Fetch existing ones
            const { data: existingBrands } = await supabase.from('brands').select('id, name');
            const { data: existingCategories } = await supabase.from('categories').select('id, name');

            const brandMap = new Map(existingBrands?.map(b => [b.name.toLowerCase(), b.id]));
            const categoryMap = new Map(existingCategories?.map(c => [c.name.toLowerCase(), c.id]));

            // 3. Create missing brands
            for (const brandName of uniqueBrands) {
                if (!brandMap.has(brandName.toLowerCase())) {
                    const slug = brandName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                    const { data, error } = await supabase
                        .from('brands')
                        .insert([{ name: brandName, slug, is_active: true }])
                        .select()
                        .single();
                    if (!error && data) {
                        brandMap.set(brandName.toLowerCase(), data.id);
                    }
                }
            }

            // 4. Create missing categories
            for (const catName of uniqueCategories) {
                if (!categoryMap.has(catName.toLowerCase())) {
                    const slug = catName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                    const { data, error } = await supabase
                        .from('categories')
                        .insert([{ name: catName, slug, is_active: true, display_order: 0 }])
                        .select()
                        .single();
                    if (!error && data) {
                        categoryMap.set(catName.toLowerCase(), data.id);
                    }
                }
            }

            // 5. Insert products one by one (to handle images)
            // In a more optimized version, we'd bulk insert products and then bulk insert images
            const results = [];
            for (const row of rows) {
                const productData: any = {
                    name: row.Name,
                    price: parseFloat(row.Price) || 0,
                    original_price: parseFloat(row['Original Price']) || null,
                    stock_quantity: parseInt(row.Stock) || 0,
                    is_active: row.Status?.toLowerCase() === 'active',
                    badge: row.Badge || null,
                    description: row.Description || null,
                    brand_id: brandMap.get(row.Brand?.toLowerCase()),
                    category_id: categoryMap.get(row.Category?.toLowerCase()),
                    rating: 0,
                    reviews_count: 0
                };

                // If ID is provided, we might want to update or skip? 
                // For "Import", let's assume we are adding new ones or we can check if ID exists.
                // The requirements don't specify update-on-import, so let's insert.
                const { data: product, error: pError } = await supabase
                    .from('products')
                    .insert([productData])
                    .select()
                    .single();

                if (pError) {
                    console.error("Error inserting product", row.Name, pError);
                    continue;
                }

                // 6. Handle images
                if (row.Images && product) {
                    const imageUrls = row.Images.split(',').map(url => url.trim()).filter(Boolean);
                    if (imageUrls.length > 0) {
                        const imageRows = imageUrls.map((url, index) => ({
                            product_id: product.id,
                            image_url: url,
                            display_order: index,
                            is_primary: index === 0
                        }));
                        await supabase.from('product_images').insert(imageRows);
                    }
                }
                results.push(product);
            }

            return results;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['brands'] });
            toast.success('Products imported successfully');
        },
        onError: (error: any) => {
            toast.error(`Import failed: ${error.message}`);
        }
    });
};
