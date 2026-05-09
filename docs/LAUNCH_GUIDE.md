# ARASOUNDS — Launch Guide

A step-by-step list of the remaining manual tasks to take the storefront from
"working in dev" to "live and selling enstrümans in Türkiye." Each item has a
clear goal, **who does what**, and a "definition of done" so you know when to
move on.

> **Status legend:** 🟢 Code-side done · 🟡 Partial — needs your action ·
> 🔴 Pending you/external

---

## ✅ What's already done in code (no further work)

| Area | Done |
|---|---|
| Turkish legal pages (Terms, Privacy/KVKK, Returns, Shipping, Distance-sales, Cookies, Künye) | 🟢 |
| Cookie consent banner | 🟢 |
| 4 transactional email templates (Turkish) | 🟢 |
| Supabase Edge Function `send-order-email` (Resend + n8n transport) | 🟢 |
| Order confirmation auto-fires on `useCreateOrder` | 🟢 |
| Shipping notification fires when admin enters tracking number on order update | 🟢 |
| Store settings (name, phone, email, address, shipping fees) read by Footer + Contact + Checkout | 🟢 |
| Checkout shows TRY (`₺`) with thousands separator + "KDV dahil" microcopy | 🟢 |
| SEO admin panel (`/admin/seo`) with per-page meta + JSON-LD | 🟢 |
| `vercel.json` with HSTS, CSP, X-Frame-Options, etc. | 🟢 |
| `robots.txt` + `sitemap.xml` | 🟢 |
| Sentry stub in `src/lib/sentry.ts` (no-op without DSN) | 🟢 |

---

## Step 1 · Fill in store identity (5 minutes)

🟡 **You** open `/admin/settings` and fill in:

- Store name (e.g. "ARASOUNDS Müzik")
- Support phone (e.g. `+90 (212) 555 00 00`)
- Support email (e.g. `destek@arasounds.com`)
- Headquarters address (full address with district/city/postcode)
- Brand mission (1 sentence)
- Standard shipping fee (`0` if shipping is included in product prices)
- Expedited shipping fee
- International shipping toggle

**Done when:** Footer of `/` shows the values you saved, and `/contact` shows the
correct contact card and address. The Distance-sales contract and Imprint also
auto-pull from these values.

---

## Step 2 · Update legal page placeholders (15 minutes)

🟡 **You** review and edit the policy pages — most fields auto-fill from store
settings, but **Künye / Imprint** has 4 manual fields:

- `/kunye` — fill MERSIS no, Vergi dairesi/numarası, Ticaret sicil no, KEP

⚠️ **Strong recommendation:** Have a Turkish e-commerce lawyer review the four
key documents before going live. Templates are generated from current
TKHK / KVKK / Mesafeli Sözleşmeler Yönetmeliği rules, but small details
(your specific category, return shipping payer, ayıp procedures) need a
lawyer's eye.

**Done when:** `/kunye` has no `[ ]` placeholder text, and you've signed off
on the 4 policy pages.

---

## Step 3 · Set up Resend (or n8n) for transactional emails (30 minutes)

🟡 **You + me.** Pick one of two transports:

### Option A — Resend (recommended)

1. Sign up at <https://resend.com> (free tier: 3,000 emails/month)
2. Add and verify your domain (`aramuzik.com`)
   - Resend will give you 3 DNS records (SPF, DKIM, MX) — add them via your
     domain registrar
   - Verification typically takes 15–60 minutes
3. Create an API key in Resend dashboard
4. Set the secret on Supabase:
   ```bash
   supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx
   supabase secrets set ORDER_FROM_EMAIL='ARASOUNDS <siparis@arasounds.com>'
   ```
5. Deploy the edge function:
   ```bash
   cd Music-Ecommerce
   supabase functions deploy send-order-email
   ```
6. **Test deliverability** — place a test order; check that the email arrives
   in Gmail / Outlook / iCloud (not spam)

### Option B — n8n + Airtable

1. In n8n create a webhook trigger → Airtable "Add row" → "Send email" node
2. Set the webhook URL on Supabase:
   ```bash
   supabase secrets set N8N_WEBHOOK_URL='https://n8n.example.com/webhook/orders'
   supabase functions deploy send-order-email
   ```

The edge function automatically prefers Resend when both are set, otherwise
falls back to n8n. If neither is set, the function logs a warning and
returns 200 (so dev environments don't break).

**Done when:** A test order placed at `/checkout` results in an email
arriving in your inbox within 1 minute.

---

## Step 4 · Choose a Turkish payment gateway (1–3 weeks lead time)

🔴 **You.** Apply now even if integration comes later — KYC takes time.

| Gateway | TR-friendly | Notes |
|---|---|---|
| **iyzico** | ⭐ Most common for TR e-commerce. Easy onboarding. 3-D Secure built in. |
| **PayTR** | Strong B2C. Good support for installments (taksit). |
| **Param** | Good rates. iyzico-style API. |
| **Stripe** | Cleanest API but limited TRY/local-card support; some BIN ranges fail. |

For each: register the company, submit:
- Tax ID (vergi numarası)
- Tax certificate (vergi levhası)
- Bank account in company name
- Trade registry gazette (ticaret sicil gazetesi)
- Authorized signatory list (imza sirküleri)
- Domain ownership proof (more on that in Step 6)

**Done when:** You receive the merchant ID + API keys.

⚠️ Once you've chosen, ping me with the gateway name and I'll wire it into
`Checkout.tsx` (replace the simulated card form), add `payment_intents`
table, and configure the webhook → mark order paid. ~1 day of work.

---

## Step 5 · Buy domain + set up DNS (1 hour)

🔴 **You.**

1. Register `aramuzik.com` (or your chosen domain) at Namecheap / GoDaddy /
   Türkiye-based provider like NIC.TR
2. Add Vercel as the DNS provider (or use Cloudflare in front of Vercel —
   recommended for the free CDN/firewall)
3. Add the Resend DNS records (Step 3)
4. Add SPF/DKIM/DMARC records — at minimum:
   ```
   v=DMARC1; p=quarantine; rua=mailto:dmarc@arasounds.com
   ```

**Done when:** `dig aramuzik.com` returns Vercel/Cloudflare nameservers.

---

## Step 6 · Deploy to Vercel (30 minutes)

🟡 **You + me.**

1. Push the repo to GitHub if not already
2. At <https://vercel.com> "New Project" → import the repo
3. Set the **Root Directory** to `Music-Ecommerce`
4. Vercel auto-detects Vite. Confirm:
   - Build command: `npm run build`
   - Output: `dist`
5. Add env vars:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SENTRY_DSN` (optional, after Step 8)
6. Add custom domain → Vercel will issue Let's Encrypt cert (auto-HTTPS)
7. Update Supabase **Auth → URL Configuration**:
   - Site URL: `https://www.aramuzik.com`
   - Redirect URLs: `https://www.aramuzik.com/reset-password`, `https://www.aramuzik.com/auth/callback`
8. Build will pick up `vercel.json` → security headers active

**Done when:**
- `https://www.aramuzik.com` loads the storefront
- `/admin/login` works with your existing super_admin
- A guest order on production triggers the order email (Step 3)

---

## Step 7 · Sales tax (KDV) compliance

🟡 **You.** You've decided to include KDV in the displayed price — fine, this
is legal in TR (and the norm for B2C). Two requirements remain:

1. **Issue valid e-Arşiv invoices** for each order. Options:
   - Manually via the e-Arşiv portal (free for low volume)
   - Integrated provider: Foriba, Logo eFatura, Mikro, Logo İzibiz (recommended)
2. **Track KDV by category** in your accounting (most enstrüman categories
   are 20% KDV as of 2026, but verify with your accountant)

The order email already says "KDV dahil." If you integrate an e-Arşiv
provider with a webhook, ping me and I'll wire it into the order flow.

**Done when:** Your accountant confirms the e-fatura process is in place.

---

## Step 8 · Sentry error reporting (15 minutes — optional but recommended)

🟡 **You.**

1. Sign up at <https://sentry.io> (free tier: 5K errors/month)
2. Create a "React" project for the storefront
3. Copy the DSN
4. In Vercel: add `VITE_SENTRY_DSN=<dsn>` env var, redeploy
5. Install the package: `npm install @sentry/react` (locally), commit, push
6. Errors now stream to Sentry in production

**Done when:** A test error from production appears in your Sentry dashboard
within 1 minute.

---

## Step 9 · Catalog upload (you, ongoing)

🔴 **You.**

1. Prepare a CSV with columns: `Name, Brand, Category, Price, Stock, Description, Images, Status`
   - `Images` should be a comma-separated list of image URLs
   - `Status` = `active` or `inactive`
2. Upload product photos to Supabase Storage `product-images` bucket
   (Admin → Products → Upload during product creation)
3. Use **Admin → Products → Import CSV** to bulk-create
4. Verify each product on `/shop` and `/product/:id`

For initial 10–20 SKUs, just create them one by one in
`/admin/products/add`.

---

## Step 10 · SEO setup (30 minutes)

🟡 **You.** With the SEO admin built in Step 7 of dev work:

1. Go to `/admin/seo`
2. For each major route, fill in:
   - **Title** (≤ 60 chars, include "ARASOUNDS" + main keyword)
   - **Meta description** (≤ 160 chars, with a call to action)
   - **OG image** (1200×630 — Canva or Figma export)
3. For `/` add a JSON-LD `Organization` schema:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Organization",
     "name": "ARASOUNDS",
     "url": "https://www.aramuzik.com",
     "logo": "https://www.aramuzik.com/logo.png",
     "contactPoint": {
       "@type": "ContactPoint",
       "telephone": "+90...",
       "contactType": "customer service",
       "availableLanguage": ["Turkish"]
     }
   }
   ```
4. Submit `https://www.aramuzik.com/sitemap.xml` to Google Search Console

**Done when:** Site appears in Google search for "arasounds" within 3-7 days.

---

## Step 11 · Pre-launch validation checklist (1 hour)

🔴 **You.** Walk through each in production:

- [ ] Sign up a new test customer, confirm email lands
- [ ] Hard refresh while signed in → still signed in
- [ ] Add to wishlist signed-out → signs you in → wishlist persists (cross-device)
- [ ] Place a guest order → order email arrives within 1 minute
- [ ] Place an authed order → order linked to user in `/profile`
- [ ] Submit a review signed out (with name + email) → appears under product
- [ ] Try a discount code → applies correctly, decrements `usage_count`
- [ ] Try an expired/inactive code → rejected with clear message
- [ ] Admin: change order to "completed" with tracking number → shipping email fires
- [ ] Admin: modify a product → change reflects on `/shop` within 5 seconds
- [ ] `lighthouse https://www.aramuzik.com` → all scores ≥ 90
- [ ] Test on real iPhone Safari, Android Chrome, Windows Edge
- [ ] Cookie banner appears on first visit, choice persists across reloads
- [ ] All 7 policy pages load without errors

---

## Step 12 · Going live

🟢 Once Steps 1–11 are green:

1. Make the Vercel deployment public (remove "Preview only" if set)
2. Announce on Instagram / TikTok / Reddit / etc.
3. Watch Sentry, Supabase logs, Resend dashboard for first 48 hours

---

## What I (Claude) can wire when you're ready

Tell me the trigger phrase and I'll do these in 1–4 hours each:

- **"Wire iyzico"** (or PayTR / Param) — full payment integration after you
  share API keys
- **"Add e-Arşiv invoicing"** — once you choose a provider (Foriba etc.)
- **"Add carrier shipping"** — once you have an account with Yurtiçi / MNG /
  Aras, I'll add tracking-number sync
- **"Build the about page"** — give me 1 paragraph of brand story and I'll
  design the page
- **"Add live chat"** — Crisp or Tawk integration
- **"Add newsletter"** — Mailchimp / Klaviyo signup that hooks into the
  Footer form

---

## Files added in this batch

```
Music-Ecommerce/
├── src/
│   ├── components/
│   │   ├── PolicyPage.tsx              ← reusable policy layout
│   │   ├── CookieConsentBanner.tsx     ← cookie banner
│   │   ├── SEOHead.tsx                 ← Helmet wrapper that reads admin meta
│   │   └── Footer.tsx                  ← rewrote, reads store settings + TR labels
│   ├── pages/policies/                 ← 7 Turkish policy pages
│   ├── pages/admin/seo/                ← admin SEO panel
│   ├── pages/Index.tsx                 ← uses SEOHead now
│   ├── pages/Contact.tsx               ← reads store settings
│   ├── pages/Checkout.tsx              ← TRY formatting + KDV note + real shipping fee
│   ├── lib/seoAPI.ts                   ← SEO meta CRUD
│   ├── lib/transactionalEmail.ts       ← invokes the edge function
│   ├── lib/currency.ts                 ← formatTRY helper
│   └── lib/sentry.ts                   ← lazy Sentry init
├── supabase/functions/send-order-email/
│   ├── index.ts
│   ├── templates.ts                    ← 4 TR HTML templates
│   ├── _shared.ts
│   └── README.md                       ← deployment instructions
├── public/
│   ├── robots.txt
│   └── sitemap.xml
└── vercel.json                         ← security headers
```

All changes pass `tsc --noEmit -p tsconfig.app.json` and the existing test
suite (55/55).
