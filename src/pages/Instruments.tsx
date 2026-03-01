import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/data/mock";

const Instruments = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-10">
      <h1 className="font-display text-4xl font-bold uppercase tracking-tight">Instruments</h1>
      <p className="mt-2 text-muted-foreground">Browse our collection by category</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={`/shop?category=${cat.name}`}
              className="group relative block overflow-hidden rounded-lg border border-border"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h2 className="font-display text-2xl font-bold uppercase">{cat.name}</h2>
                <p className="text-sm text-muted-foreground">{cat.count} products</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default Instruments;
