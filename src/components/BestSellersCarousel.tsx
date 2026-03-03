import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/data/mock";
import ProductCard from "./ProductCard";

interface BestSellersCarouselProps {
    products: Product[];
}

const BestSellersCarousel: React.FC<BestSellersCarouselProps> = ({ products }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            slidesToScroll: 1,
            breakpoints: {
                "(min-width: 640px)": { slidesToScroll: 2 },
                "(min-width: 1024px)": { slidesToScroll: 3 },
                "(min-width: 1280px)": { slidesToScroll: 4 },
            },
        },
        [Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })]
    );

    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className="relative pt-6 pb-12">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="pl-6 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] min-w-0"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            <button
                className="absolute -left-4 md:-left-6 top-[40%] -translate-y-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-all hover:bg-accent hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
                onClick={scrollPrev}
                disabled={!prevBtnEnabled}
                aria-label="Previous products"
            >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
                className="absolute -right-4 md:-right-6 top-[40%] -translate-y-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-all hover:bg-accent hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
                onClick={scrollNext}
                disabled={!nextBtnEnabled}
                aria-label="Next products"
            >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
        </div>
    );
};

export default BestSellersCarousel;
