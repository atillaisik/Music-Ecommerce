import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { optimizeImage, preloadImage } from "@/lib/image-utils";
import { useWishlistStore } from "@/lib/store";
import { toast } from "sonner";
import type { Product } from "@/data/mock";

interface ProductImageCarouselProps {
    images: string[];
    name: string;
    badge?: string;
    product: Product;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({ images, name, badge, product }) => {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
    const isFavorited = isInWishlist(product.id);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isFavorited) {
            removeFromWishlist(product.id);
            toast.info(`Removed ${product.name} from wishlist`);
        } else {
            addToWishlist(product);
            toast.success(`Added ${product.name} to wishlist!`);
        }
    };

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const [emblaMainRef, emblaMainApi] = useEmblaCarousel(
        {
            loop: true,
            duration: 30,
        },
        [Fade()]
    );

    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: "keepSnaps",
        dragFree: true,
    });

    const onThumbClick = useCallback(
        (index: number) => {
            if (!emblaMainApi || !emblaThumbsApi) return;
            emblaMainApi.scrollTo(index);
        },
        [emblaMainApi, emblaThumbsApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        setSelectedIndex(emblaMainApi.selectedScrollSnap());
        emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
    }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

    useEffect(() => {
        // Preload first 3 images
        images.slice(1, 3).forEach(src => {
            preloadImage(optimizeImage(src, 800, 800)).catch(() => { });
        });

        if (!emblaMainApi) return;
        onSelect();
        setScrollSnaps(emblaMainApi.scrollSnapList());
        emblaMainApi.on("select", onSelect);
        emblaMainApi.on("reInit", onSelect);
    }, [emblaMainApi, onSelect, images]);

    const scrollPrev = useCallback(() => {
        if (emblaMainApi) emblaMainApi.scrollPrev();
    }, [emblaMainApi]);

    const scrollNext = useCallback(() => {
        if (emblaMainApi) emblaMainApi.scrollNext();
    }, [emblaMainApi]);

    // Keyboard navigation support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") scrollPrev();
            if (e.key === "ArrowRight") scrollNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [scrollPrev, scrollNext]);

    return (
        <div className="flex flex-col space-y-4">
            {/* Main Carousel */}
            <div className="relative group overflow-hidden rounded-xl bg-secondary aspect-square">
                <div ref={emblaMainRef} className="h-full w-full overflow-hidden">
                    <div className="flex h-full w-full">
                        {images.map((src, index) => (
                            <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full">
                                <img
                                    src={optimizeImage(src, 800, 800)}
                                    alt={`${name} - Image ${index + 1}`}
                                    className="h-full w-full object-cover select-none"
                                    loading={index === 0 ? "eager" : "lazy"}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Badge */}
                {badge && (
                    <Badge className="absolute left-6 top-6 px-3 py-1 text-sm bg-primary text-primary-foreground z-10 transition-opacity">
                        {badge}
                    </Badge>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={toggleWishlist}
                    className={`absolute right-6 top-6 rounded-full p-2.5 transition-all hover:scale-110 ${isFavorited ? "bg-primary text-primary-foreground" : "bg-background/80 text-foreground hover:bg-background"
                        } shadow-md z-10`}
                    aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
                </button>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={scrollPrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background z-10"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background z-10"
                            aria-label="Next image"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="mt-4 overflow-hidden" ref={emblaThumbsRef}>
                    <div className="flex gap-4">
                        {images.map((src, index) => (
                            <button
                                key={index}
                                onClick={() => onThumbClick(index)}
                                className={cn(
                                    "relative h-20 w-20 flex-[0_0_auto] overflow-hidden rounded-md border-2 transition-all duration-300",
                                    selectedIndex === index
                                        ? "border-primary ring-2 ring-primary/20"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                )}
                            >
                                <img
                                    src={optimizeImage(src, 200, 200)}
                                    alt={`${name} thumbnail ${index + 1}`}
                                    className="h-full w-full object-cover select-none"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductImageCarousel;
