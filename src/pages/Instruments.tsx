import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCategories } from "@/lib/categoryAPI";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers } from "lucide-react";

const Instruments = () => {
  const { data: categories, isLoading } = useCategories(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-primary italic">Instruments</h1>
        <p className="mt-2 text-muted-foreground font-medium">Browse our collection by category</p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden bg-card/30 border border-border/50">
                <Skeleton className="h-full w-full" />
              </div>
            ))
          ) : categories && categories.length > 0 ? (
            categories.filter(cat => !cat.parent_id).map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/shop?category=${cat.id}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border/40 bg-card/40 shadow-xl transition-all hover:border-primary/40 hover:-translate-y-1 duration-500"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    {cat.image_url ? (
                      <img
                        src={cat.image_url}
                        alt={cat.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-muted/20">
                        <Layers className="h-12 w-12 text-muted-foreground/20" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="font-display text-2xl font-black uppercase text-white tracking-tight group-hover:text-primary transition-colors">{cat.name}</h2>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary/80 mt-1">Explore Collection</p>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center opacity-40">
              <Layers className="h-12 w-12 mx-auto mb-4" />
              <p className="font-bold uppercase tracking-tighter text-xl">No categories found</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Instruments;
