import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useProducts, useCategories, useBrands } from "@/lib/productAPI";
import { PackageSearch, SlidersHorizontal, X } from "lucide-react";

const sortOptions = [
  { label: "Newest", value: "created_at:desc" },
  { label: "Popular", value: "rating:desc" },
  { label: "Price: Low", value: "price:asc" },
  { label: "Price: High", value: "price:desc" },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("q") || "";
  const initialBrand = searchParams.get("brand") || "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [sort, setSort] = useState(sortOptions[0].value);
  const [search, setSearch] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: products, isLoading } = useProducts({
    category_id: selectedCategory === 'all' ? undefined : selectedCategory,
    brand_id: selectedBrand === 'all' ? undefined : selectedBrand,
    search: search || undefined,
    sort: sort,
    is_active: true,
  });

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setSelectedBrand(searchParams.get("brand") || "all");
    setSearch(searchParams.get("q") || "");
  }, [searchParams]);

  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id);
    const newParams = new URLSearchParams(searchParams);
    if (id === 'all') newParams.delete('category');
    else newParams.set('category', id);
    setSearchParams(newParams);
  };

  const handleBrandChange = (id: string) => {
    setSelectedBrand(id);
    const newParams = new URLSearchParams(searchParams);
    if (id === 'all') newParams.delete('brand');
    else newParams.set('brand', id);
    setSearchParams(newParams);
  };

  const filteredByPrice = useMemo(() => {
    if (!products) return [];
    return products.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
  }, [products, priceRange]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Shop All Instruments | ARASOUNDS</title>
        <meta name="description" content="Browse our full catalog of premium musical instruments. Filter by category, brand, and price." />
      </Helmet>
      <Navbar />
      <main className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-5xl font-black uppercase tracking-tighter italic text-primary">Shop</h1>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px] mt-1">Discover Professional Instruments</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest opacity-40">Filter View</span>
            <SlidersHorizontal className="h-4 w-4 opacity-40" />
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-64 space-y-8">
            <div className="relative group">
              <Input
                placeholder="Find your sound..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-card/50 border-border/50 h-11 rounded-xl pl-4 focus:ring-primary/20 transition-all font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <section>
              <h3 className="mb-4 font-display text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-border/40 pb-2">Category</h3>
              <div className="flex flex-col gap-1">
                <Button
                  variant={selectedCategory === 'all' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleCategoryChange('all')}
                  className={`justify-start text-xs font-bold uppercase tracking-widest h-10 rounded-lg ${selectedCategory === 'all' ? 'shadow-lg shadow-primary/20' : ''}`}
                >
                  All Collections
                </Button>
                {categories?.map((c) => (
                  <Button
                    key={c.id}
                    variant={selectedCategory === c.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleCategoryChange(c.id)}
                    className="justify-start text-xs font-bold uppercase tracking-widest h-10 rounded-lg"
                  >
                    {c.name}
                  </Button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-4 font-display text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-border/40 pb-2">Our Brands</h3>
              <div className="flex flex-col gap-1">
                <Button
                  variant={selectedBrand === 'all' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleBrandChange('all')}
                  className={`justify-start text-xs font-bold uppercase tracking-widest h-10 rounded-lg ${selectedBrand === 'all' ? 'shadow-lg shadow-primary/20' : ''}`}
                >
                  All Brands
                </Button>
                {brands?.map((b) => (
                  <Button
                    key={b.id}
                    variant={selectedBrand === b.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleBrandChange(b.id)}
                    className="justify-start text-xs font-bold uppercase tracking-widest h-10 rounded-lg"
                  >
                    {b.name}
                  </Button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-4 font-display text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-border/40 pb-2">Price Range</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-muted-foreground/50 ml-1">Min</label>
                  <Input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                    className="h-10 bg-card/30 border-border/40 text-xs font-bold rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-muted-foreground/50 ml-1">Max</label>
                  <Input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                    className="h-10 bg-card/30 border-border/40 text-xs font-bold rounded-lg"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-4 font-display text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-border/40 pb-2">Sort By</h3>
              <div className="flex flex-col gap-1">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={sort === option.value ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSort(option.value)}
                    className="justify-start text-xs font-bold uppercase tracking-widest h-10 rounded-lg"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </section>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Showing <span className="text-foreground">{filteredByPrice.length}</span> results
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={`skeleton-${i}`} />)
                : filteredByPrice.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
            </div>

            {!isLoading && filteredByPrice.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 bg-card/10 rounded-3xl border border-dashed border-border/50">
                <PackageSearch className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
                <p className="text-lg font-bold uppercase tracking-tighter italic">No instruments found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search terms.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                    setPriceRange({ min: 0, max: 1000000 });
                  }}
                  className="mt-6 rounded-xl font-bold uppercase tracking-widest text-[10px]"
                >
                  Reset all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
