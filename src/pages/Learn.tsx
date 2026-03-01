import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { articles } from "@/data/mock";

const Learn = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-10">
      <h1 className="font-display text-4xl font-bold uppercase tracking-tight">Learn</h1>
      <p className="mt-2 text-muted-foreground">Guides, tutorials, and tips to level up your playing</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {articles.map((a, i) => (
          <motion.article
            key={a.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group overflow-hidden rounded-lg border border-border bg-card"
          >
            <div className="aspect-video overflow-hidden">
              <img src={a.image} alt={a.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{a.category}</Badge>
                <span className="text-xs text-muted-foreground">{a.readTime} read</span>
              </div>
              <h2 className="mt-3 font-display text-xl font-bold">{a.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default Learn;
