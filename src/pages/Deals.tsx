import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/mock";
import { Badge } from "@/components/ui/badge";

const deals = products.filter((p) => p.originalPrice);

const Deals = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-10">
      {/* Banner */}
      <div className="rounded-lg bg-primary/10 border border-primary/20 p-8 text-center mb-8">
        <Badge className="bg-primary text-primary-foreground mb-2">Limited Time</Badge>
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight">Deals & Offers</h1>
        <p className="mt-2 text-muted-foreground">Save big on premium instruments — while stocks last!</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {deals.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {deals.length === 0 && <p className="mt-12 text-center text-muted-foreground">No active deals right now. Check back soon!</p>}
    </main>
    <Footer />
  </div>
);

export default Deals;
