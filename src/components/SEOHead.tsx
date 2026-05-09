import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSEOMeta } from "@/lib/seoAPI";
import { absoluteUrl, SITE_URL } from "@/lib/seo";

interface SEOHeadProps {
    /** Pathname this SEO record applies to, e.g. "/shop", "/" */
    path: string;
    defaultTitle: string;
    defaultDescription?: string;
    defaultImage?: string;
    /** Pre-built JSON-LD object(s) — auto-stringified. */
    jsonLd?: Record<string, unknown> | Record<string, unknown>[];
    /** Override the canonical URL (defaults to absoluteUrl(path)). */
    canonical?: string;
    /** Override OG type (defaults to "website"; use "product" or "article" where relevant). */
    ogType?: "website" | "article" | "product" | "profile";
    /** If true, emits a noindex,nofollow meta robots tag. */
    noIndex?: boolean;
}

/**
 * Wraps Helmet so admin-edited SEO meta from `seoAPI` overrides the per-page
 * defaults. Always emits canonical + hreflang + OG tags.
 */
export const SEOHead = ({
    path,
    defaultTitle,
    defaultDescription,
    defaultImage,
    jsonLd,
    canonical,
    ogType = "website",
    noIndex = false,
}: SEOHeadProps) => {
    const { i18n } = useTranslation();
    const { data: override } = useSEOMeta(path);

    const title = override?.title || defaultTitle;
    const description = override?.description || defaultDescription;
    const ogTitle = override?.og_title || title;
    const ogDescription = override?.og_description || description;
    const ogImage = absoluteUrl(override?.og_image || defaultImage || "/ArasSounds.png");
    const canonicalUrl = override?.canonical || canonical || absoluteUrl(path);
    const robots = noIndex ? "noindex, nofollow" : override?.robots || "index, follow, max-image-preview:large";
    const adminSchema = override?.schema_jsonld;
    const lang = i18n.resolvedLanguage ?? "tr";
    const ogLocale = lang === "en" ? "en_US" : "tr_TR";

    const schemaArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

    return (
        <Helmet>
            <html lang={lang} />
            <title>{title}</title>
            {description && <meta name="description" content={description} />}
            {override?.keywords && <meta name="keywords" content={override.keywords} />}
            <meta name="robots" content={robots} />

            {/* Canonical + alternates */}
            <link rel="canonical" href={canonicalUrl} />
            <link rel="alternate" hrefLang="tr" href={canonicalUrl} />
            <link rel="alternate" hrefLang="en" href={canonicalUrl} />
            <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

            {/* Open Graph */}
            <meta property="og:locale" content={ogLocale} />
            <meta property="og:locale:alternate" content={ogLocale === "tr_TR" ? "en_US" : "tr_TR"} />
            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content="ARASOUNDS" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={ogTitle} />
            {ogDescription && <meta property="og:description" content={ogDescription} />}
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@ARASOUNDS" />
            <meta name="twitter:title" content={ogTitle} />
            {ogDescription && <meta name="twitter:description" content={ogDescription} />}
            <meta name="twitter:image" content={ogImage} />

            {/* JSON-LD schema (page-defined) */}
            {schemaArray.map((schema, i) => (
                <script key={`schema-${i}`} type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            ))}

            {/* JSON-LD override from admin SEO panel (raw) */}
            {adminSchema && <script type="application/ld+json">{adminSchema}</script>}

            {/* Site URL hint for crawlers */}
            <meta name="application-name" content="ARASOUNDS" />
        </Helmet>
    );
};

export { SITE_URL };
export default SEOHead;
