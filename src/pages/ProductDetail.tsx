import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import ReviewSection from "@/components/ReviewSection";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import { useProduct, useProducts } from "@/lib/productAPI";
import { useReviews, useAddReview, ProductReview } from "@/lib/reviewAPI";

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { data: product, isLoading, error } = useProduct(id);
    const { data: reviews = [] } = useReviews(product?.id);
    const addReviewMutation = useAddReview();

    // Fetch related products (products in the same category)
    const { data: relatedProductsData, isLoading: isRelatedLoading } = useProducts({
        category_id: product?.category_id,
        is_active: true
    });

    const relatedProducts = (relatedProductsData || [])
        .filter((p) => p.id !== product?.id)
        .slice(0, 4);

    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product as any);
        toast.success(`${product.name} added to cart!`, {
            description: "You can view your cart in the navigation bar.",
        });
    };

    const handleAddReview = (reviewData: Omit<ProductReview, 'id' | 'created_at' | 'updated_at'>) => {
        if (!product) return;
        addReviewMutation.mutate({
            ...reviewData,
            product_id: product.id
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <Navbar />
                <main className="container py-12 md:py-24">
                    <Button asChild variant="ghost" className="mb-8 pl-0 text-muted-foreground hover:text-foreground">
                        <Link to="/shop">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Shop
                        </Link>
                    </Button>
                    <div className="grid gap-12 lg:grid-cols-2">
                        <div className="aspect-square rounded-xl bg-secondary animate-pulse" />
                        <div className="flex flex-col space-y-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-12 w-3/4" />
                            <div className="flex gap-4">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                            <div className="mt-8 space-y-4">
                                <Skeleton className="h-8 w-32" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                            <div className="mt-8 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <Skeleton className="mt-10 h-16 w-full" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Product not found</h1>
                <Button asChild className="mt-4">
                    <Link to="/shop">Back to Shop</Link>
                </Button>
            </div>
        );
    }

    // Prepare images for carousel
    const carouselImages = product.images && product.images.length > 0
        ? product.images.map(img => img.image_url)
        : ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop'];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Helmet>
                <title>{`${product.name} | ${product.brand?.name || 'Instrument'} | ARASOUNDS`}</title>
                <meta name="description" content={`Buy ${product.name} by ${product.brand?.name || 'Instrument'}. Premium ${product.category?.name || ''} available at ARASOUNDS.`} />
            </Helmet>
            <Navbar />
            <main className="container py-12 md:py-24">
                {/* Navigation */}
                <Button asChild variant="ghost" className="mb-8 pl-0 text-muted-foreground hover:text-foreground">
                    <Link to="/shop">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Shop
                    </Link>
                </Button>

                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Product Image */}
                    <ProductImageCarousel
                        images={carouselImages}
                        name={product.name}
                        badge={product.badge}
                        product={product as any}
                    />

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <p className="text-sm font-medium uppercase tracking-widest text-primary">
                            {product.brand?.name}
                        </p>
                        <h1 className="mt-2 text-4xl font-bold uppercase tracking-tight md:text-5xl">
                            {product.name}
                        </h1>

                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Star className="h-5 w-5 fill-primary text-primary" />
                                <span className="text-lg font-medium">{product.rating || 0}</span>
                            </div>
                            <span className="text-muted-foreground">|</span>
                            <span className="text-muted-foreground">{product.reviews_count || 0} reviews</span>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-bold">${product.price.toLocaleString()}</span>
                                {product.original_price && (
                                    <span className="text-xl text-muted-foreground line-through">
                                        ${product.original_price.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                {product.description || `Experience superior sound quality and professional craftsmanship. This ${product.name} represents the pinnacle of ${product.category?.name || 'musical instrument'} design, offering unparalleled performance for both stage and studio.`}
                            </p>
                        </div>

                        {/* Placeholder Specs */}
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Check className="h-4 w-4" />
                                </div>
                                <span className="text-sm">Premium high-fidelity audio output</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Check className="h-4 w-4" />
                                </div>
                                <span className="text-sm">Ergonomic design for maximum comfort</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Check className="h-4 w-4" />
                                </div>
                                <span className="text-sm">Includes 2-year manufacturer warranty</span>
                            </div>
                        </div>

                        <div className="mt-10">
                            <Button size="lg" className="w-full text-lg font-bold uppercase tracking-wider py-8" onClick={handleAddToCart} disabled={product.stock_quantity === 0}>
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock"}
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Reviews Section */}
                <ReviewSection
                    reviews={reviews}
                    averageRating={product.rating || 0}
                    totalReviews={product.reviews_count || 0}
                    onAddReview={handleAddReview}
                />

                {/* Related Products */}
                {(isRelatedLoading || relatedProducts.length > 0) && (
                    <section className="mt-24">
                        <h2 className="text-3xl font-bold uppercase tracking-tight">Related Products</h2>
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {isRelatedLoading
                                ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={`skeleton-${i}`} />)
                                : relatedProducts.map((p) => (
                                    <ProductCard key={p.id} product={p as any} />
                                ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetail;
