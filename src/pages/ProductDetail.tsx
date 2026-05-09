import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Star, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import ReviewSection from "@/components/ReviewSection";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import { useProduct, useProducts } from "@/lib/productAPI";
import { useReviews, useAddReview, AddReviewInput } from "@/lib/reviewAPI";
import { formatTRY } from "@/lib/currency";
import { productSchema, breadcrumbSchema, absoluteUrl } from "@/lib/seo";

const ProductDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const { data: product, isLoading, error } = useProduct(id);
    const { data: reviews = [] } = useReviews(product?.id);
    const addReviewMutation = useAddReview();

    const { data: relatedProductsData, isLoading: isRelatedLoading } = useProducts({
        category_id: product?.category_id,
        is_active: true,
    });

    const relatedProducts = (relatedProductsData || [])
        .filter((p) => p.id !== product?.id)
        .slice(0, 4);

    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product as any);
        toast.success(t("product.added_to_cart", { name: product.name }), {
            description: t("product.added_to_cart_subtitle"),
        });
    };

    const handleAddReview = (reviewData: Omit<AddReviewInput, "product_id">) => {
        if (!product) return;
        addReviewMutation.mutate({
            ...reviewData,
            product_id: product.id,
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
                            {t("product.back_to_shop")}
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
                <h1 className="text-2xl font-bold">{t("product.not_found_title")}</h1>
                <Button asChild className="mt-4">
                    <Link to="/shop">{t("product.back_to_shop")}</Link>
                </Button>
            </div>
        );
    }

    const carouselImages = product.images && product.images.length > 0
        ? product.images.map((img) => img.image_url)
        : ["https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop"];

    const productPath = `/product/${product.id}`;
    const productLd = productSchema({
        id: product.id,
        name: product.name,
        description:
            product.description ||
            t("product.default_description", {
                name: product.name,
                category: product.category?.name || "",
            }),
        image: carouselImages.map((src) => absoluteUrl(src)),
        brand: product.brand?.name,
        sku: product.id,
        price: Number(product.price),
        currency: "TRY",
        availability: product.stock_quantity > 0 ? "in_stock" : "out_of_stock",
        url: productPath,
        category: product.category?.name,
        rating: (product.reviews_count ?? 0) > 0
            ? { value: Number(product.rating ?? 0), count: Number(product.reviews_count ?? 0) }
            : undefined,
    });
    const breadcrumbLd = breadcrumbSchema([
        { name: "ARASOUNDS", url: "/" },
        { name: t("nav.shop"), url: "/shop" },
        ...(product.category?.name
            ? [{ name: product.category.name, url: `/shop?category=${product.category.id}` }]
            : []),
        { name: product.name, url: productPath },
    ]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEOHead
                path={productPath}
                defaultTitle={`${product.name} | ${product.brand?.name || "ARASOUNDS"} | ARASOUNDS`}
                defaultDescription={`${product.name} — ${product.brand?.name ?? ""} ${product.category?.name ?? ""}`.trim()}
                defaultImage={carouselImages[0]}
                ogType="product"
                jsonLd={[productLd, breadcrumbLd]}
            />
            <Navbar />
            <main className="container py-12 md:py-24">
                <Button asChild variant="ghost" className="mb-8 pl-0 text-muted-foreground hover:text-foreground">
                    <Link to="/shop">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t("product.back_to_shop")}
                    </Link>
                </Button>

                <div className="grid gap-12 lg:grid-cols-2">
                    <ProductImageCarousel
                        images={carouselImages}
                        name={product.name}
                        badge={product.badge}
                        product={product as any}
                    />

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
                            <span className="text-muted-foreground">
                                {t("product.reviews_count", { count: product.reviews_count || 0 })}
                            </span>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-bold">{formatTRY(product.price)}</span>
                                {product.original_price && (
                                    <span className="text-xl text-muted-foreground line-through">
                                        {formatTRY(product.original_price)}
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-xs uppercase tracking-widest font-bold text-muted-foreground">
                                {t("common.vat_shipping_included")}
                            </p>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                {product.description ||
                                    t("product.default_description", {
                                        name: product.name,
                                        category: product.category?.name || t("product.category"),
                                    })}
                            </p>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Check className="h-4 w-4" />
                                </div>
                                <span className="text-sm">
                                    <strong>{t("product.spec_warranty")}:</strong> {t("product.spec_warranty_value")}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Check className="h-4 w-4" />
                                </div>
                                <span className="text-sm">
                                    <strong>{t("product.spec_shipping")}:</strong> {t("product.spec_shipping_value")}
                                </span>
                            </div>
                        </div>

                        <div className="mt-10">
                            <Button
                                size="lg"
                                className="w-full text-lg font-bold uppercase tracking-wider py-8"
                                onClick={handleAddToCart}
                                disabled={product.stock_quantity === 0}
                            >
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                {product.stock_quantity > 0 ? t("product.add_to_cart") : t("product.out_of_stock")}
                            </Button>
                        </div>
                    </motion.div>
                </div>

                <ReviewSection
                    reviews={reviews}
                    averageRating={product.rating || 0}
                    totalReviews={product.reviews_count || 0}
                    onAddReview={handleAddReview}
                />

                {(isRelatedLoading || relatedProducts.length > 0) && (
                    <section className="mt-24">
                        <h2 className="text-3xl font-bold uppercase tracking-tight">{t("product.related_title")}</h2>
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {isRelatedLoading
                                ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={`skeleton-${i}`} />)
                                : relatedProducts.map((p) => <ProductCard key={p.id} product={p as any} />)}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetail;
