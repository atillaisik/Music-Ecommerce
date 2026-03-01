import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";

const sortOptions = ["Popular", "Price: Low", "Price: High", "Newest"];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("q") || "";
  const initialBrand = searchParams.get("brand") || "All";

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [sort, setSort] = useState("Popular");
  const [search, setSearch] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory !== "All") list = list.filter((p) => p.category === selectedCategory);
    if (selectedBrand !== "All") list = list.filter((p) => p.brand === selectedBrand);
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    // Price filtering
    list = list.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);

    if (sort === "Price: Low") list.sort((a, b) => a.price - b.price);
    if (sort === "Price: High") list.sort((a, b) => b.price - a.price);
    if (sort === "Newest") list.sort((a, b) => b.id.localeCompare(a.id)); // Simple mock for newest
    return list;
  }, [selectedCategory, sort, search, priceRange]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight">Shop</h1>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full shrink-0 lg:w-56">
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4 bg-secondary" />
            <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Category</h3>
            <div className="flex flex-wrap gap-2 lg:flex-col">
              {["All", ...categories.map((c) => c.name)].map((c) => (
                <Button
                  key={c}
                  variant={selectedCategory === c ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(c)}
                  className="justify-start text-xs uppercase tracking-wider"
                >
                  {c}
                </Button>
              ))}
            </div>
            <h3 className="mb-2 mt-6 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Our Brands</h3>
            <div className="flex flex-wrap gap-2 lg:flex-col">
              {["All", ...Array.from(new Set(products.map((p) => p.brand)))].map((b) => (
                <Button
                  key={b}
                  variant={selectedBrand === b ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedBrand(b)}
                  className="justify-start text-xs uppercase tracking-wider"
                >
                  {b}
                </Button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  className="h-8 bg-secondary text-xs"
                  value={priceRange.min || ""}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  className="h-8 bg-secondary text-xs"
                  value={priceRange.max || ""}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                />
              </div>
            </div>

            <h3 className="mb-2 mt-6 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sort</h3>
            <div className="flex flex-wrap gap-2 lg:flex-col">
              {sortOptions.map((s) => (
                <Button key={s} variant={sort === s ? "default" : "ghost"} size="sm" onClick={() => setSort(s)} className="justify-start text-xs">
                  {s}
                </Button>
              ))}
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <p className="mb-4 text-sm text-muted-foreground">{filtered.length} products</p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {filtered.length === 0 && <p className="mt-12 text-center text-muted-foreground">No products found.</p>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
