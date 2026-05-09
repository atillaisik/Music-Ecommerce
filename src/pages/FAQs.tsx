import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { faqAPI } from "@/lib/faqAPI";
import { FAQ } from "@/types/faq";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { faqSchema } from "@/lib/seo";

const FAQs = () => {
    const { t } = useTranslation();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const data = await faqAPI.getActive();
                setFaqs(data);
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    const faqLd = faqs.length > 0 ? faqSchema(faqs.map((f) => ({ question: f.question, answer: f.answer }))) : undefined;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEOHead
                path="/faqs"
                defaultTitle={t("faqs.title")}
                defaultDescription={t("faqs.description")}
                jsonLd={faqLd}
            />
            <Navbar />
            <main className="pb-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-secondary/30 py-20 lg:py-32">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(var(--primary-rgb),0.05)_0%,transparent_100%)]" />
                    <div className="container text-center">
                        <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                            <span>{t("nav.contact")}</span>
                        </div>
                        <h1 className="font-display text-5xl font-bold uppercase tracking-tight lg:text-7xl">
                            {t("faqs.page_title")}
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground lg:text-xl">
                            {t("faqs.subtitle")}
                        </p>
                    </div>
                </section>

                <div className="container mt-12 lg:mt-20">
                    <Accordion type="single" collapsible className="w-full">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="py-4 border-b border-border/50">
                                    <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                                </div>
                            ))
                        ) : faqs.length > 0 ? (
                            faqs.map((item, i) => (
                                <AccordionItem key={item.id} value={`item-${i}`} className="border-b-border/50">
                                    <AccordionTrigger className="text-left font-display text-base font-semibold hover:no-underline">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground leading-relaxed">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))
                        ) : (
                            <p className="text-muted-foreground italic">{t("faqs.empty")}</p>
                        )}
                    </Accordion>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FAQs;
