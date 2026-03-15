import { useState, useCallback, useEffect } from "react";
import { Star, ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";
import { useCartStore, useWishlistStore, useCarouselStore } from "@/lib/store";
import { toast } from "sonner";
import { optimizeImage } from "@/lib/image-utils";
import useEmblaCarousel from "embla-carousel-react";
import { useMemo } from "react";

interface ProductCardProps {
  product: Product | any;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  // Persist carousel state
  const { indices, setIndex } = useCarouselStore();
  const savedIndex = indices[product.id] || 0;

  const [currentImageIndex, setCurrentImageIndex] = useState(savedIndex);

  // Handle both mock and real image structures
  const images = useMemo(() => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      if (typeof product.images[0] === 'string') return product.images;
      return product.images.map((img: any) => img.image_url);
    }
    return [product.image || product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop'];
  }, [product.images, product.image]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: savedIndex
  });

  const scrollPrev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const newIndex = emblaApi.selectedScrollSnap();
    setCurrentImageIndex(newIndex);
    setIndex(product.id, newIndex);
  }, [emblaApi, product.id, setIndex]);

  useEffect(() => {
    if (!emblaApi) return;

    // Update if store changed externally or on mount
    const currentIndex = emblaApi.selectedScrollSnap();
    if (currentIndex !== savedIndex) {
      emblaApi.scrollTo(savedIndex, true); // Jump without animation on mount if needed
    }

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect, savedIndex]);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      description: "You can view your cart in the navigation bar.",
    });
  };

  const isFavorited = isInWishlist(product.id);
  const [isWishlistPending, setIsWishlistPending] = useState(false);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlistPending) return;

    setIsWishlistPending(true);
    try {
      if (isFavorited) {
        await removeFromWishlist(product.id);
        toast.info(`Removed ${product.name} from wishlist`);
      } else {
        await addToWishlist(product);
        toast.success(`Added ${product.name} to wishlist!`);
      }
    } catch (error) {
      toast.error(`Failed to update wishlist`, {
        description: "Please try again later."
      });
    } finally {
      setIsWishlistPending(false);
    }
  };

  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <div className="overflow-hidden h-full w-full" ref={emblaRef}>
            <div className="flex h-full w-full touch-pan-y">
              {images.map((imgSrc, index) => (
                <div className="relative h-full w-full flex-[0_0_100%] min-w-0" key={index}>
                  <img
                    src={optimizeImage(imgSrc, 500, 500)}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </div>
        </Link>
        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 z-20"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              {images.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentImageIndex ? "w-4 bg-primary" : "w-1.5 bg-white/80"}`} />
              ))}
            </div>
          </>
        )}
        <button
          onClick={toggleWishlist}
          disabled={isWishlistPending}
          className={`absolute right-3 top-3 rounded-full p-2 transition-all hover:scale-110 ${isFavorited ? "bg-primary text-primary-foreground" : "bg-white/80 text-foreground hover:bg-white"
            } ${isWishlistPending ? "opacity-70 cursor-not-allowed" : ""} shadow-sm z-20`}
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""} ${isWishlistPending ? "animate-pulse" : ""}`} />
        </button>
        {product.badge && (
          <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground z-20">{product.badge}</Badge>
        )}
      </div>

      <div className="p-4">
        <Link to={`/product/${product.id}`} className="block">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {product.brand?.name || product.brand || 'Unknown Brand'}
          </p>
          <h3 className="mt-1 font-medium text-foreground transition-colors hover:text-primary">{product.name}</h3>
        </Link>
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          <span className="text-sm text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviews_count ?? product.reviews ?? 0})</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">${product.price.toLocaleString()}</span>
            {(product.original_price || product.originalPrice) && (
              <span className="text-sm text-muted-foreground line-through">
                ${(product.original_price || product.originalPrice).toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="rounded-md bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/80"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
