import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/lib/productAPI";
import { siteContentAPI } from "@/lib/siteContentAPI";
import { BannerContent } from "@/types/siteContent";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag } from "lucide-react";

const Deals = () => {
    const [banner, setBanner] = useState<BannerContent>({
        badge: "Limited Time",
        title: "Deals & Offers",
        subtitle: "Save big on premium instruments — while stocks last!"
    });
    const [isLoadingBanner, setIsLoadingBanner] = useState(true);

    const { data: products, isLoading: isLoadingProducts } = useProducts();
    const deals = products?.filter((p) => p.original_price && p.original_price > p.price) || [];

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const data = await siteContentAPI.getContent('deals', 'banner');
                if (data && data.content) {
                    setBanner(data.content as BannerContent);
                }
            } catch (error) {
                console.error("Error fetching deals banner:", error);
            } finally {
                setIsLoadingBanner(false);
            }
        };
        fetchBanner();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-10">
                {/* Banner */}
                <div className="rounded-2xl bg-primary/10 border border-primary/20 p-12 text-center mb-12 shadow-inner relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                    
                    {isLoadingBanner ? (
                        <div className="space-y-4 flex flex-col items-center">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-10 w-64 rounded-xl" />
                            <Skeleton className="h-4 w-96 rounded-lg" />
                        </div>
                    ) : (
                        <div className="relative z-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Badge className="bg-primary text-primary-foreground mb-4 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-black shadow-lg shadow-primary/20">
                                {banner.badge}
                            </Badge>
                            <h1 className="font-display text-5xl md:text-6xl font-black uppercase tracking-tighter italic mb-4">
                                {banner.title}
                            </h1>
                            <p className="max-w-2xl mx-auto text-muted-foreground font-medium text-lg italic">
                                {banner.subtitle}
                            </p>
                        </div>
                    )}
                </div>

                {isLoadingProducts ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="space-y-4 border border-border/40 rounded-3xl p-4 bg-card/30">
                                <Skeleton className="aspect-square w-full rounded-2xl" />
                                <Skeleton className="h-6 w-3/4 rounded-lg" />
                                <Skeleton className="h-4 w-1/4 rounded-md" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-1000">
                        {deals.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                )}

                {!isLoadingProducts && deals.length === 0 && (
                    <div className="mt-20 text-center space-y-4 opacity-50">
                        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Tag className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <p className="text-xl font-bold uppercase italic tracking-tight">No active deals right now</p>
                        <p className="text-muted-foreground">Check back soon for premium instruments at discounted prices!</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Deals;
