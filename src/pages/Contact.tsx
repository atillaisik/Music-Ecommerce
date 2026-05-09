import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Instagram,
    Twitter,
    Facebook,
    Youtube,
    MessageSquare,
    Sparkles,
    Music2,
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { faqAPI } from "@/lib/faqAPI";
import { FAQ } from "@/types/faq";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStoreSettings } from "@/lib/storeSettingsAPI";
import { localBusinessSchema, faqSchema } from "@/lib/seo";

const Contact = () => {
    const { t } = useTranslation();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loadingFaqs, setLoadingFaqs] = useState(true);
    const { data: settings } = useStoreSettings();
    const supportEmail = settings?.supportEmail || "destek@arasounds.com";
    const supportPhone = settings?.supportPhone || "+90 (___) ___ __ __";
    const address = settings?.address || "—";

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const data = await faqAPI.getActive();
                setFaqs(data);
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            } finally {
                setLoadingFaqs(false);
            }
        };
        fetchFaqs();
    }, []);

    const businessLd = localBusinessSchema({
        name: settings?.storeName ?? "ARASOUNDS",
        legalName: settings?.legalName,
        email: settings?.supportEmail,
        phone: settings?.supportPhone,
        address: settings?.address,
        mersisNo: settings?.mersisNo,
        taxNumber: settings?.taxNumber,
        tradeRegistryNo: settings?.tradeRegistryNo,
    });
    const faqLd = faqs.length > 0 ? faqSchema(faqs.map((f) => ({ question: f.question, answer: f.answer }))) : null;
    const schemaList: Record<string, unknown>[] = [businessLd as Record<string, unknown>];
    if (faqLd) schemaList.push(faqLd as Record<string, unknown>);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <SEOHead
                path="/contact"
                defaultTitle={t("contact.title")}
                defaultDescription={t("contact.subtitle")}
                jsonLd={schemaList}
            />
            <Navbar />

            <main className="pb-20">
                <section className="relative overflow-hidden bg-secondary/30 py-20 lg:py-32">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(var(--primary-rgb),0.05)_0%,transparent_100%)]" />
                    <div className="container text-center">
                        <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                            <Sparkles className="h-4 w-4" />
                            <span>{t("contact.support_excellence")}</span>
                        </div>
                        <h1 className="font-display text-5xl font-bold uppercase tracking-tight lg:text-7xl">
                            {t("contact.heading_part_1")}{" "}
                            <span className="text-primary italic">{t("contact.heading_part_2")}</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground lg:text-xl">
                            {t("contact.subtitle")}
                        </p>
                    </div>
                </section>

                <div className="container mt-12 lg:mt-20">
                    <div className="grid gap-16 lg:grid-cols-12 lg:gap-24">
                        <div className="lg:col-span-12 grid gap-12 lg:grid-cols-2">
                            <div className="space-y-8 rounded-2xl border bg-card p-6 shadow-sm lg:p-10">
                                <div className="space-y-2">
                                    <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
                                        {t("contact.send_message_title")}
                                    </h2>
                                    <p className="text-muted-foreground">{t("contact.send_message_subtitle")}</p>
                                </div>

                                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2 text-sm font-medium">
                                            <label htmlFor="name">{t("contact.form_name")}</label>
                                            <Input id="name" placeholder="Ahmet Yılmaz" className="bg-secondary/50 border-none h-12" />
                                        </div>
                                        <div className="space-y-2 text-sm font-medium">
                                            <label htmlFor="email">{t("contact.form_email")}</label>
                                            <Input id="email" placeholder="ad@example.com" type="email" className="bg-secondary/50 border-none h-12" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm font-medium">
                                        <label htmlFor="subject">{t("contact.form_subject")}</label>
                                        <Input id="subject" placeholder={t("contact.form_subject_placeholder")} className="bg-secondary/50 border-none h-12" />
                                    </div>
                                    <div className="space-y-2 text-sm font-medium">
                                        <label htmlFor="message">{t("contact.form_message")}</label>
                                        <Textarea
                                            id="message"
                                            placeholder={t("contact.form_message_placeholder")}
                                            rows={5}
                                            className="bg-secondary/50 border-none resize-none"
                                        />
                                    </div>
                                    <Button type="submit" size="lg" className="w-full font-display uppercase tracking-widest text-base py-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                                        {t("contact.send_button")}
                                    </Button>
                                </form>
                            </div>

                            <div className="space-y-12">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {[
                                        { icon: MapPin, title: t("contact.info_store"), text: address },
                                        { icon: Phone, title: t("contact.info_phone"), text: supportPhone },
                                        { icon: Mail, title: t("contact.info_email"), text: supportEmail },
                                        { icon: Clock, title: t("contact.info_hours"), text: t("contact.info_hours_value") },
                                    ].map(({ icon: Icon, title, text }) => (
                                        <div key={title} className="group flex flex-col items-start gap-4 rounded-xl border p-5 transition-colors hover:bg-secondary/20">
                                            <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                                <Icon className="h-6 w-6 text-primary group-hover:text-inherit" />
                                            </div>
                                            <div>
                                                <h3 className="font-display text-sm font-bold uppercase tracking-wider">{title}</h3>
                                                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="rounded-2xl bg-secondary/30 p-8 border border-border/50">
                                    <h3 className="font-display text-lg font-bold uppercase tracking-tight mb-6">
                                        {t("contact.community_title")}
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        {[
                                            { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
                                            { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
                                            { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
                                            { icon: Youtube, label: "Youtube", href: "https://youtube.com" },
                                            { icon: Music2, label: "TikTok", href: "https://tiktok.com" },
                                        ].map(({ icon: Icon, label, href }) => (
                                            <a
                                                key={label}
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 rounded-full border bg-background px-5 py-2.5 text-sm font-medium transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95"
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span>{label}</span>
                                            </a>
                                        ))}
                                    </div>
                                    <p className="mt-6 text-sm text-muted-foreground flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-primary" />
                                        {t("contact.community_text")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-12 h-px bg-border/50 my-10" />

                        <div className="lg:col-span-7 space-y-8">
                            <div className="space-y-2">
                                <h2 className="font-display text-3xl font-bold uppercase tracking-tight">
                                    {t("contact.faq_title")}
                                </h2>
                                <p className="text-muted-foreground text-lg">{t("contact.faq_subtitle")}</p>
                            </div>

                            <Accordion type="single" collapsible className="w-full">
                                {loadingFaqs ? (
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
                                    <p className="text-muted-foreground italic">{t("contact.no_faqs")}</p>
                                )}
                            </Accordion>
                        </div>

                        <div className="lg:col-span-5 space-y-8">
                            <div className="space-y-2">
                                <h2 className="font-display text-3xl font-bold uppercase tracking-tight">
                                    {t("contact.showroom_title")}
                                </h2>
                                <p className="text-muted-foreground text-lg">{t("contact.showroom_subtitle")}</p>
                            </div>

                            <div className="relative aspect-square w-full sm:aspect-video lg:aspect-square overflow-hidden rounded-2xl border bg-secondary flex items-center justify-center group shadow-inner">
                                <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
                                <div className="relative z-10 text-center p-8 space-y-4">
                                    <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                                        <MapPin className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-lg font-bold uppercase">{settings?.storeName ?? "ARASOUNDS"}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{address}</p>
                                    </div>
                                    <Button variant="outline" className="rounded-full bg-background/50 backdrop-blur-sm">
                                        {t("contact.open_in_maps")}
                                    </Button>
                                </div>

                                <div className="absolute top-1/4 left-1/3 w-32 h-1 bg-primary/20 rotate-45" />
                                <div className="absolute bottom-1/3 right-1/4 w-40 h-1 bg-primary/10 -rotate-12" />
                                <div className="absolute top-1/2 left-1/2 w-px h-full bg-border/20" />
                                <div className="absolute top-1/2 left-0 w-full h-px bg-border/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
