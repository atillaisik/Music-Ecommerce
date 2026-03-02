import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { categories, products } from "@/data/mock";
import { Marquee } from "@/components/magicui/Marquee";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";

const stats = [
  { label: "Products", value: "50K+" },
  { label: "Brands", value: "200+" },
  { label: "Musicians", value: "1M+" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>ARASOUNDS | Premium Musical Instruments</title>
        <meta name="description" content="Discover premium instruments from the world's top brands. Guitars, Pianos, Drums and more at ARASOUNDS." />
      </Helmet>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[85vh] items-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop"
              alt="Musician performing on stage"
              className="h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          </div>
          <div className="container relative z-10">
            <motion.div initial="hidden" animate="visible" className="max-w-2xl">
              <motion.div variants={fadeUp} custom={0}>
                <Badge variant="outline" className="border-primary text-primary mb-4 font-display uppercase tracking-widest">
                  New Arrivals 2026
                </Badge>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="font-display text-5xl font-bold uppercase leading-tight tracking-tight md:text-7xl"
              >
                Your Sound{" "}
                <span className="text-primary">Starts Here.</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="mt-4 max-w-lg text-lg text-muted-foreground">
                Discover premium instruments from the world's top brands. Whether you're just starting out or a seasoned pro, find your perfect sound.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="font-display text-base uppercase tracking-wider">
                  <Link to="/instruments">Explore Instruments <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-display text-base uppercase tracking-wider">
                  <Link to="/shop">Shop Best Sellers</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-card">
          <div className="container grid grid-cols-3 divide-x divide-border py-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-bold text-primary md:text-4xl">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="container py-16">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight">Browse Categories</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/shop?category=${cat.name}`}
                  className="group relative block overflow-hidden rounded-lg"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="font-display text-xl font-bold uppercase">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.count} products</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-card py-16">
          <div className="container">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight">Best Sellers</h2>
              <Button asChild variant="ghost" className="font-display uppercase tracking-wider text-primary">
                <Link to="/shop">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="mt-8">
              <Marquee pauseOnHover className="[--duration:30s]">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={`skeleton-${i}`} className="w-[300px] flex-shrink-0 px-2">
                      <ProductCardSkeleton />
                    </div>
                  ))
                  : products.slice(0, 10).map((p) => (
                    <div key={p.id} className="w-[300px] flex-shrink-0 px-2">
                      <ProductCard product={p} />
                    </div>
                  ))}
              </Marquee>
            </div>
          </div>
        </section>

        {/* Brand Banner */}
        <section className="container py-16 text-center">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight">Trusted by Top Brands</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
            {["Fender", "Gibson", "Yamaha", "Roland", "Taylor", "Martin"].map((b) => (
              <Link
                key={b}
                to={`/shop?brand=${b}`}
                className="font-display text-2xl font-bold text-muted-foreground/40 transition-colors hover:text-foreground"
              >
                {b}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
