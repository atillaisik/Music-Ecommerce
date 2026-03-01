import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { brands } from "@/data/mock";

const Brands = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-10">
      <h1 className="font-display text-4xl font-bold uppercase tracking-tight">Our Brands</h1>
      <p className="mt-2 text-muted-foreground">Premium instruments from world-class manufacturers</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand, i) => (
          <motion.div
            key={brand.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/shop?category=All`}
              className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-8 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <span className="font-display text-4xl font-bold text-muted-foreground">{brand.logo}</span>
              <span className="mt-3 text-sm font-medium text-foreground">{brand.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default Brands;
