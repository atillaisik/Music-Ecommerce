import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { products } from "@/data/mock";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import ReviewSection from "@/components/ReviewSection";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store";
import ProductImageCarousel from "@/components/ProductImageCarousel";

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const product = products.find((p) => p.id === id);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [id]);

    if (!product && !isLoading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Product not found</h1>
                <Button asChild className="mt-4">
                    <Link to="/shop">Back to Shop</Link>
                </Button>
            </div>
        );
    }

    const relatedProducts = products
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
        addToCart(product);
        toast.success(`${product.name} added to cart!`, {
            description: "You can view your cart in the navigation bar.",
        });
    };

    return (
        <div className="min-h-screen bg-background">
            {product && (
                <Helmet>
                    <title>{`${product.name} | ${product.brand} | ARASOUNDS`}</title>
                    <meta name="description" content={`Buy ${product.name} by ${product.brand}. Premium ${product.category} available at ARASOUNDS.`} />
                </Helmet>
            )}
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
                    {isLoading ? (
                        <div className="aspect-square rounded-xl bg-secondary animate-pulse" />
                    ) : (
                        <ProductImageCarousel
                            images={product!.images && product!.images.length > 0 ? product!.images : [product!.image]}
                            name={product!.name}
                            badge={product!.badge}
                        />
                    )}

                    {/* Product Info */}
                    {isLoading ? (
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
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col"
                        >
                            <p className="text-sm font-medium uppercase tracking-widest text-primary">
                                {product!.brand}
                            </p>
                            <h1 className="mt-2 text-4xl font-bold uppercase tracking-tight md:text-5xl">
                                {product!.name}
                            </h1>

                            <div className="mt-4 flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-primary text-primary" />
                                    <span className="text-lg font-medium">{product!.rating}</span>
                                </div>
                                <span className="text-muted-foreground">|</span>
                                <span className="text-muted-foreground">{product!.reviews} reviews</span>
                            </div>

                            <div className="mt-8">
                                <div className="flex items-baseline gap-4">
                                    <span className="text-3xl font-bold">${product!.price.toLocaleString()}</span>
                                    {product!.originalPrice && (
                                        <span className="text-xl text-muted-foreground line-through">
                                            ${product!.originalPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                <p className="mt-4 text-muted-foreground leading-relaxed">
                                    Experience superior sound quality and professional craftsmanship. This {product!.name} represents the pinnacle of {product!.category} design, offering unparalleled performance for both stage and studio.
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
                                <Button size="lg" className="w-full text-lg font-bold uppercase tracking-wider py-8" onClick={handleAddToCart}>
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Add to Cart
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Reviews Section */}
                {!isLoading && (
                    <ReviewSection
                        reviews={product!.reviewsData || []}
                        averageRating={product!.rating}
                        totalReviews={product!.reviews}
                    />
                )}

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-24">
                        <h2 className="text-3xl font-bold uppercase tracking-tight">Related Products</h2>
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {isLoading
                                ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={`skeleton-${i}`} />)
                                : relatedProducts.map((p) => (
                                    <ProductCard key={p.id} product={p} />
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
