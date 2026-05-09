import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { useArticles } from "@/lib/articleAPI";

const Learn = () => {
  const { t } = useTranslation();
  const { data: articles = [], isLoading } = useArticles();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead path="/learn" defaultTitle={t("learn.title")} defaultDescription={t("learn.subtitle")} />
      <Navbar />
      <main className="container py-10">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight">{t("learn.page_title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("learn.subtitle")}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-lg bg-secondary animate-pulse" />
            ))
          ) : articles.length === 0 ? (
            <p className="text-muted-foreground">{t("learn.empty")}</p>
          ) : (
            articles.map((article, i) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.image_url ?? "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1200&h=600&fit=crop"}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    {article.category && <Badge variant="outline" className="text-xs">{article.category}</Badge>}
                    {article.read_time_minutes && (
                      <span className="text-xs text-muted-foreground">{t("learn.min_read", { minutes: article.read_time_minutes })}</span>
                    )}
                  </div>
                  <h2 className="mt-3 font-display text-xl font-bold">{article.title}</h2>
                  {article.excerpt && (
                    <p className="mt-2 text-sm text-muted-foreground">{article.excerpt}</p>
                  )}
                </div>
              </motion.article>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
