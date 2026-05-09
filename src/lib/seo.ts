/**
 * SEO helpers — canonical URL builder + JSON-LD schema constructors.
 * All schema returned matches schema.org / Google's structured-data guidelines.
 */

export const SITE_URL = (
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SITE_URL) ||
    'https://www.aramuzik.com'
).replace(/\/$/, '');

export const absoluteUrl = (path: string) => {
    if (!path) return SITE_URL;
    if (/^https?:\/\//i.test(path)) return path;
    return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export interface OrganizationInput {
    name: string;
    legalName?: string;
    url?: string;
    logo?: string;
    email?: string;
    phone?: string;
    address?: string;
    sameAs?: string[];
    // Turkish-specific identifiers
    mersisNo?: string;
    taxOffice?: string;
    taxNumber?: string;
    tradeRegistryNo?: string;
}

export const organizationSchema = (input: OrganizationInput) => {
    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: input.name,
        url: input.url ?? SITE_URL,
        logo: input.logo ?? absoluteUrl('/ArasSounds.png'),
    };

    if (input.legalName) schema.legalName = input.legalName;
    if (input.email || input.phone) {
        schema.contactPoint = {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: input.email,
            telephone: input.phone,
            areaServed: 'TR',
            availableLanguage: ['tr', 'en'],
        };
    }
    if (input.sameAs && input.sameAs.length) schema.sameAs = input.sameAs;

    // Turkish identifiers — schema.org's `identifier` accepts an array of
    // PropertyValue objects.
    const identifiers: Record<string, unknown>[] = [];
    if (input.mersisNo) identifiers.push({ '@type': 'PropertyValue', propertyID: 'MERSIS', value: input.mersisNo });
    if (input.taxNumber) identifiers.push({ '@type': 'PropertyValue', propertyID: 'VKN', value: input.taxNumber });
    if (input.tradeRegistryNo) identifiers.push({ '@type': 'PropertyValue', propertyID: 'TicaretSicilNo', value: input.tradeRegistryNo });
    if (identifiers.length) schema.identifier = identifiers;

    if (input.address) {
        schema.address = {
            '@type': 'PostalAddress',
            streetAddress: input.address,
            addressCountry: 'TR',
        };
    }

    return schema;
};

export const localBusinessSchema = (input: OrganizationInput) => {
    const base = organizationSchema(input);
    return {
        ...base,
        '@type': 'Store',
        priceRange: '₺₺-₺₺₺',
        currenciesAccepted: 'TRY',
        paymentAccepted: 'Credit Card, Debit Card, Bank Transfer',
    };
};

export interface ProductSchemaInput {
    id: string;
    name: string;
    description: string;
    image: string | string[];
    brand?: string;
    sku?: string;
    price: number;
    currency?: string;
    availability: 'in_stock' | 'out_of_stock' | 'preorder';
    url: string;
    rating?: { value: number; count: number };
    category?: string;
}

const SCHEMA_AVAILABILITY: Record<ProductSchemaInput['availability'], string> = {
    in_stock: 'https://schema.org/InStock',
    out_of_stock: 'https://schema.org/OutOfStock',
    preorder: 'https://schema.org/PreOrder',
};

export const productSchema = (input: ProductSchemaInput) => {
    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${absoluteUrl(input.url)}#product`,
        name: input.name,
        description: input.description,
        image: Array.isArray(input.image) ? input.image : [input.image],
        sku: input.sku ?? input.id,
        ...(input.brand && {
            brand: { '@type': 'Brand', name: input.brand },
        }),
        ...(input.category && { category: input.category }),
        offers: {
            '@type': 'Offer',
            url: absoluteUrl(input.url),
            priceCurrency: input.currency ?? 'TRY',
            price: input.price.toFixed(2),
            availability: SCHEMA_AVAILABILITY[input.availability],
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@type': 'Organization', name: 'ARASOUNDS' },
        },
    };

    if (input.rating && input.rating.count > 0) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: input.rating.value.toFixed(1),
            reviewCount: input.rating.count,
            bestRating: 5,
            worstRating: 1,
        };
    }

    return schema;
};

export interface BreadcrumbItem {
    name: string;
    url: string;
}

export const breadcrumbSchema = (items: BreadcrumbItem[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
        item: absoluteUrl(item.url),
    })),
});

export interface FAQSchemaItem {
    question: string;
    answer: string;
}

export const faqSchema = (items: FAQSchemaItem[]) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
        },
    })),
});

export const websiteSchema = ({ name, url, searchUrl }: { name: string; url: string; searchUrl?: string }) => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    inLanguage: ['tr-TR', 'en-US'],
    ...(searchUrl && {
        potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: `${searchUrl}?q={search_term_string}` },
            'query-input': 'required name=search_term_string',
        },
    }),
});
