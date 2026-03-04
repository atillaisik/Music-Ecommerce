import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useBrands } from "@/lib/productAPI";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";

const Brands = () => {
  const { data: brands, isLoading } = useBrands();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-primary italic">Our Brands</h1>
        <p className="mt-2 text-muted-foreground font-medium">Premium instruments from world-class manufacturers</p>

        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/30 p-8 h-48">
                <Skeleton className="h-16 w-16 rounded-full mb-4" />
                <Skeleton className="h-4 w-24 rounded-full" />
              </div>
            ))
          ) : brands && brands.length > 0 ? (
            brands.map((brand, i) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/shop?brand=${brand.id}`}
                  className="flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-card/40 p-8 transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 group backdrop-blur-sm"
                >
                  <div className="h-20 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                    {brand.logo_url ? (
                      <img src={brand.logo_url} alt={brand.name} className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                    ) : (
                      <Building2 className="h-12 w-12 text-muted-foreground opacity-20" />
                    )}
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest text-foreground/80 group-hover:text-primary transition-colors">{brand.name}</span>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center opacity-40">
              <Building2 className="h-12 w-12 mx-auto mb-4" />
              <p className="font-bold uppercase tracking-tighter text-xl">No brands discovered yet</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Brands;
