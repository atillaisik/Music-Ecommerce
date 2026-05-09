// Build-time sitemap generator. Pulls live products + categories + brands +
// articles from Supabase and writes a multi-file sitemap to public/.
//
// Wire into the build via package.json "postbuild" so deploys always have a
// fresh sitemap. Skips gracefully if VITE_SITE_URL or the Supabase env vars
// aren't set (so local builds without env still succeed).

import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');

const SITE_URL = (process.env.VITE_SITE_URL || 'https://www.aramuzik.com').replace(/\/$/, '');
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const STATIC_ROUTES = [
    { path: '/', changefreq: 'daily', priority: 1.0 },
    { path: '/shop', changefreq: 'daily', priority: 0.9 },
    { path: '/instruments', changefreq: 'weekly', priority: 0.8 },
    { path: '/brands', changefreq: 'weekly', priority: 0.8 },
    { path: '/deals', changefreq: 'daily', priority: 0.8 },
    { path: '/learn', changefreq: 'weekly', priority: 0.7 },
    { path: '/contact', changefreq: 'monthly', priority: 0.5 },
    { path: '/faqs', changefreq: 'monthly', priority: 0.5 },
    { path: '/kullanim-kosullari', changefreq: 'yearly', priority: 0.3 },
    { path: '/gizlilik-politikasi', changefreq: 'yearly', priority: 0.3 },
    { path: '/iade-politikasi', changefreq: 'yearly', priority: 0.3 },
    { path: '/teslimat-politikasi', changefreq: 'yearly', priority: 0.3 },
    { path: '/cerez-politikasi', changefreq: 'yearly', priority: 0.3 },
    { path: '/mesafeli-satis-sozlesmesi', changefreq: 'yearly', priority: 0.3 },
    { path: '/kunye', changefreq: 'yearly', priority: 0.3 },
];

const escapeXml = (s) =>
    String(s).replace(/[<>&'"]/g, (c) => ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        "'": '&apos;',
        '"': '&quot;',
    }[c]));

const formatDate = (d) => (d ? new Date(d).toISOString() : new Date().toISOString());

const renderUrlElement = ({ loc, lastmod, changefreq, priority, alternates = [] }) => {
    const lastmodTag = lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : '';
    const cfTag = changefreq ? `\n    <changefreq>${escapeXml(changefreq)}</changefreq>` : '';
    const prTag = typeof priority === 'number' ? `\n    <priority>${priority.toFixed(1)}</priority>` : '';
    const altTags = alternates
        .map(
            (a) =>
                `\n    <xhtml:link rel="alternate" hreflang="${escapeXml(a.hreflang)}" href="${escapeXml(a.href)}" />`,
        )
        .join('');
    return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmodTag}${cfTag}${prTag}${altTags}
  </url>`;
};

const wrapUrlset = (urls) =>
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

const wrapSitemapIndex = (sitemaps) =>
    `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
    .map(
        ({ loc, lastmod }) =>
            `  <sitemap>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
  </sitemap>`,
    )
    .join('\n')}
</sitemapindex>
`;

const buildAlternates = (loc) => [
    { hreflang: 'tr', href: loc },
    // English variant lives at the same path; the i18n switch is client-side
    // and Google understands hreflang pointing at the same URL.
    { hreflang: 'en', href: loc },
    { hreflang: 'x-default', href: loc },
];

const writeFile = async (rel, contents) => {
    const target = path.join(PUBLIC_DIR, rel);
    await fs.writeFile(target, contents, 'utf8');
    console.log(`  ✔ wrote ${rel} (${(contents.length / 1024).toFixed(1)} kB)`);
};

const buildStaticSitemap = () => {
    const urls = STATIC_ROUTES.map(({ path: p, changefreq, priority }) => {
        const loc = `${SITE_URL}${p}`;
        return renderUrlElement({
            loc,
            changefreq,
            priority,
            lastmod: formatDate(new Date()),
            alternates: buildAlternates(loc),
        });
    });
    return wrapUrlset(urls);
};

const buildProductsSitemap = async (sb) => {
    const { data, error } = await sb
        .from('products')
        .select('id, updated_at')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(50000);

    if (error) {
        console.warn('  ! Could not fetch products:', error.message);
        return null;
    }

    const urls = (data ?? []).map((row) => {
        const loc = `${SITE_URL}/product/${row.id}`;
        return renderUrlElement({
            loc,
            lastmod: formatDate(row.updated_at),
            changefreq: 'weekly',
            priority: 0.7,
            alternates: buildAlternates(loc),
        });
    });

    return urls.length > 0 ? wrapUrlset(urls) : null;
};

const buildArticlesSitemap = async (sb) => {
    const { data, error } = await sb
        .from('articles')
        .select('id, slug, updated_at, published_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(10000);

    if (error) {
        console.warn('  ! Could not fetch articles:', error.message);
        return null;
    }

    const urls = (data ?? []).map((row) => {
        const loc = `${SITE_URL}/learn/${row.slug ?? row.id}`;
        return renderUrlElement({
            loc,
            lastmod: formatDate(row.updated_at ?? row.published_at),
            changefreq: 'monthly',
            priority: 0.5,
            alternates: buildAlternates(loc),
        });
    });

    return urls.length > 0 ? wrapUrlset(urls) : null;
};

const main = async () => {
    console.log('▶ Generating sitemap…');
    console.log(`  base URL: ${SITE_URL}`);

    const now = formatDate(new Date());
    const written = [];

    // Static routes always written
    await writeFile('sitemap-static.xml', buildStaticSitemap());
    written.push({ loc: `${SITE_URL}/sitemap-static.xml`, lastmod: now });

    if (SUPABASE_URL && SUPABASE_KEY) {
        const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

        const productsXml = await buildProductsSitemap(sb);
        if (productsXml) {
            await writeFile('sitemap-products.xml', productsXml);
            written.push({ loc: `${SITE_URL}/sitemap-products.xml`, lastmod: now });
        }

        const articlesXml = await buildArticlesSitemap(sb);
        if (articlesXml) {
            await writeFile('sitemap-articles.xml', articlesXml);
            written.push({ loc: `${SITE_URL}/sitemap-articles.xml`, lastmod: now });
        }
    } else {
        console.warn('  ! VITE_SUPABASE_URL/KEY not set — skipping dynamic sub-sitemaps');
    }

    // sitemap.xml is the index pointing at the others
    await writeFile('sitemap.xml', wrapSitemapIndex(written));

    console.log('✓ Sitemap generation complete.');
};

main().catch((err) => {
    console.error('✗ Sitemap generation failed:', err);
    // Don't fail the build — sitemap regeneration is best-effort.
    process.exit(0);
});
