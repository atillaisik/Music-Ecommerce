import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/mock";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store";

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const product = products.find((p) => p.id === id);

    if (!product) {
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
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative aspect-square overflow-hidden rounded-xl bg-secondary"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                        {product.badge && (
                            <Badge className="absolute left-6 top-6 px-3 py-1 text-sm bg-primary text-primary-foreground">
                                {product.badge}
                            </Badge>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <p className="text-sm font-medium uppercase tracking-widest text-primary">
                            {product.brand}
                        </p>
                        <h1 className="mt-2 text-4xl font-bold uppercase tracking-tight md:text-5xl">
                            {product.name}
                        </h1>

                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <Star className="h-5 w-5 fill-primary text-primary" />
                                <span className="text-lg font-medium">{product.rating}</span>
                            </div>
                            <span className="text-muted-foreground">|</span>
                            <span className="text-muted-foreground">{product.reviews} reviews</span>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-baseline gap-4">
                                <span className="text-3xl font-bold">${product.price.toLocaleString()}</span>
                                {product.originalPrice && (
                                    <span className="text-xl text-muted-foreground line-through">
                                        ${product.originalPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                Experience superior sound quality and professional craftsmanship. This {product.name} represents the pinnacle of {product.category} design, offering unparalleled performance for both stage and studio.
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
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-24">
                        <h2 className="text-3xl font-bold uppercase tracking-tight">Related Products</h2>
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((p) => (
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
