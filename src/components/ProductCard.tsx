import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/data/mock";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => (
  <div className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
    <Link to={`/product/${product.id}`} className="block">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.badge && (
          <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">{product.badge}</Badge>
        )}
      </div>
    </Link>
    <div className="p-4">
      <Link to={`/product/${product.id}`} className="block">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.brand}</p>
        <h3 className="mt-1 font-medium text-foreground transition-colors hover:text-primary">{product.name}</h3>
      </Link>
      <div className="mt-2 flex items-center gap-1">
        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
        <span className="text-sm text-foreground">{product.rating}</span>
        <span className="text-xs text-muted-foreground">({product.reviews})</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">${product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">${product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        <button className="rounded-md bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/80" aria-label="Add to cart">
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
);

export default ProductCard;
