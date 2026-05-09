import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PolicyPageProps {
    title: string;
    description?: string;
    lastUpdated?: string;
    children: React.ReactNode;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({
    title,
    description,
    lastUpdated = "1 Mayıs 2026",
    children,
}) => (
    <div className="min-h-screen bg-background">
        <Helmet>
            <title>{`${title} | ARASOUNDS`}</title>
            {description && <meta name="description" content={description} />}
        </Helmet>
        <Navbar />
        <main className="container max-w-3xl py-12 md:py-16">
            <header className="mb-10">
                <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight">
                    {title}
                </h1>
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground font-bold">
                    Son güncelleme: {lastUpdated}
                </p>
            </header>
            <article className="prose prose-sm md:prose-base max-w-none dark:prose-invert prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3 prose-h3:text-base prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-primary">
                {children}
            </article>
        </main>
        <Footer />
    </div>
);

export default PolicyPage;
