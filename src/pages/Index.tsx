import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCategories, useProducts } from "@/lib/productAPI";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import BestSellersCarousel from "@/components/BestSellersCarousel";
import DealsCarousel from "@/components/DealsCarousel";
import { useStoreSettings } from "@/lib/storeSettingsAPI";
import { organizationSchema, websiteSchema, SITE_URL } from "@/lib/seo";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Index = () => {
  const { t } = useTranslation();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories(true);
  const { data: dealsProducts = [], isLoading: dealsLoading } = useProducts({
    on_sale: true,
    is_active: true,
    limit: 10,
  });
  const { data: featuredProducts = [], isLoading: featuredLoading } = useProducts({
    featured: true,
    is_active: true,
    limit: 10,
  });

  const stats = [
    { label: t("home.stats.products"), value: "50K+" },
    { label: t("home.stats.brands"), value: "200+" },
    { label: t("home.stats.musicians"), value: "1M+" },
  ];

  const { data: settings } = useStoreSettings();
  const orgSchema = organizationSchema({
    name: settings?.storeName ?? "ARASOUNDS",
    legalName: settings?.legalName,
    email: settings?.supportEmail,
    phone: settings?.supportPhone,
    address: settings?.address,
    mersisNo: settings?.mersisNo,
    taxNumber: settings?.taxNumber,
    tradeRegistryNo: settings?.tradeRegistryNo,
  });
  const siteSchema = websiteSchema({
    name: "ARASOUNDS",
    url: SITE_URL,
    searchUrl: `${SITE_URL}/shop`,
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        path="/"
        defaultTitle={t("home.title")}
        defaultDescription={t("home.description")}
        jsonLd={[orgSchema, siteSchema]}
      />
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[85vh] items-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop"
              alt=""
              className="h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          </div>
          <div className="container relative z-10">
            <motion.div initial="hidden" animate="visible" className="max-w-2xl">
              <motion.div variants={fadeUp} custom={0}>
                <Badge variant="outline" className="border-primary text-primary mb-4 font-display uppercase tracking-widest">
                  {t("home.hero_badge")}
                </Badge>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="font-display text-5xl font-bold uppercase leading-tight tracking-tight md:text-7xl"
              >
                {t("home.hero_title_1")}{" "}
                <span className="text-primary">{t("home.hero_title_2")}</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="mt-4 max-w-lg text-lg text-muted-foreground">
                {t("home.hero_subtitle")}
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="font-display text-base uppercase tracking-wider">
                  <Link to="/instruments">{t("home.hero_cta_explore")} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-display text-base uppercase tracking-wider">
                  <Link to="/shop">{t("home.hero_cta_shop")}</Link>
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
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight">{t("home.categories_title")}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoriesLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={`cat-skel-${i}`} className="aspect-[16/9] rounded-lg bg-secondary animate-pulse" />
              ))
            ) : categories.length === 0 ? (
              <p className="text-muted-foreground col-span-full">{t("home.categories_empty")}</p>
            ) : (
              categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat.slug ?? cat.name)}`}
                    className="group relative block overflow-hidden rounded-lg"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={cat.image_url ?? "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=400&fit=crop"}
                        alt={cat.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="font-display text-xl font-bold uppercase">{cat.name}</h3>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Special Deals */}
        <section className="py-16 overflow-hidden">
          <div className="container">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="outline" className="border-primary text-primary mb-2 font-display uppercase tracking-widest text-[10px]">
                  {t("home.deals_badge")}
                </Badge>
                <h2 className="font-display text-3xl font-bold uppercase tracking-tight">{t("home.deals_title")}</h2>
              </div>
              <Button asChild variant="ghost" className="font-display uppercase tracking-wider text-primary">
                <Link to="/deals">{t("home.deals_view_all")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="mt-8">
              {dealsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={`deal-skel-${i}`} />
                  ))}
                </div>
              ) : dealsProducts.length === 0 ? (
                <p className="text-muted-foreground">{t("home.deals_empty")}</p>
              ) : (
                <DealsCarousel products={dealsProducts} />
              )}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-card py-16">
          <div className="container">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight">{t("home.best_sellers")}</h2>
              <Button asChild variant="ghost" className="font-display uppercase tracking-wider text-primary">
                <Link to="/shop">{t("common.view_all")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="mt-8">
              {featuredLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={`featured-skel-${i}`} />
                  ))}
                </div>
              ) : featuredProducts.length === 0 ? (
                <p className="text-muted-foreground">{t("home.best_sellers_empty")}</p>
              ) : (
                <BestSellersCarousel products={featuredProducts} />
              )}
            </div>
          </div>
        </section>

        {/* Brand Banner */}
        <section className="container py-16 text-center">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight">{t("home.trusted_brands")}</h2>
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
