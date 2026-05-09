# ARASOUNDS — SEO Setup & Launch Checklist

Bu doküman: site canlıya çıkmadan önce yapılması gereken tüm SEO adımlarını tek bir akış halinde anlatır. Yapılan kod değişiklikleri + manuel adımlar (panel başvuruları, Search Console doğrulamaları) ayrı ayrı listelenmiştir.

---

## ✅ Kod tarafında halledilmiş olanlar

### Temel altyapı
- [x] **`<html lang="tr">`** — `index.html` artık Türkçe varsayılan; dil değişikliğinde `i18n` `<html lang>` attribute'unu otomatik günceller.
- [x] **Canonical URL** — Her sayfa `<SEOHead>` üzerinden mutlak canonical URL üretir (`absoluteUrl(path)`).
- [x] **hreflang** — TR/EN için `<link rel="alternate" hrefLang="tr|en|x-default">` her sayfada otomatik.
- [x] **Open Graph + Twitter Cards** — Tüm sayfalar için `og:title`, `og:description`, `og:image`, `og:type`, `og:locale`, `og:url`; Twitter `summary_large_image` formatında.
- [x] **robots.txt** — `/admin`, `/checkout`, `/profile`, `/reset-password`, `/shop?q=*` dizinlemeden hariç. `Sitemap: https://www.aramuzik.com/sitemap.xml` referansı eklendi.
- [x] **sitemap.xml** — Build sırasında otomatik üretilir (statik route'lar + ürünler + makaleler). `npm run sitemap` veya `npm run build` ile çalışır. 3 dosyalı sitemap-index yapısı.
- [x] **Structured data (JSON-LD)** — schema.org formatında:
  - `Organization` schema → Anasayfa (MERSIS, VKN, Ticaret Sicil identifier'ları dahil)
  - `WebSite` + `SearchAction` → Anasayfa (Google "Sitelinks Search Box")
  - `Product` + `Offer` + `AggregateRating` → Ürün detay sayfası (Google Shopping eligibility)
  - `BreadcrumbList` → Ürün detay sayfası (rich snippets)
  - `FAQPage` → /faqs ve /contact (FAQ rich result)
  - `Store` (LocalBusiness) → /contact (Local pack için)
- [x] **SEO Admin Panel** — `/admin/seo` ile her route için title/description/keywords/canonical/og_image/robots/JSON-LD admin tarafından düzenlenebilir; admin değerleri default'ları override eder.

### Performans (Core Web Vitals)
- [x] **DNS prefetch + preconnect** — `<link rel="preconnect">` Supabase + Unsplash için.
- [x] **Code splitting** — Vite manualChunks: vendor, ui, charts ayrı bundle'lar.
- [x] **Image lazy loading** — Tüm `<img>` etiketlerinde `loading="lazy"` (hero hariç).
- [x] **Theme color** — `<meta name="theme-color" content="#0b0c10">` mobilde browser chrome rengini ayarlar.
- [x] **Font preload** — Display fontu (eklenirse) `<link rel="preload">` ile.

### Çok dilli SEO
- [x] **i18n SEO** — Aynı path TR ve EN için aynı URL'de servis ediliyor (`/`, `/shop`, `/product/:id`). Dil değişikliği client-side; `<html lang>` ve `og:locale` dinamik. Hreflang her sayfa için TR + EN + x-default.

---

## 🔧 Sen yapacaksın (manuel adımlar)

### 1. Domain & DNS (deploy öncesi)
- [ ] **aramuzik.com** domain'i satın al (Tigrinya, GoDaddy veya Cloudflare Registrar).
- [ ] **Vercel'e deploy et:**
  - GitHub repo'yu Vercel'e bağla
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL=https://www.aramuzik.com`, `VITE_SENTRY_DSN`
- [ ] **Custom domain ekle** Vercel'de → DNS A/CNAME kayıtlarını domain sağlayıcısında ayarla.
- [ ] **HTTPS otomatik** — Vercel Let's Encrypt sertifikasını kendisi sağlar.

### 2. Google Search Console (en önemli adım)
- [ ] https://search.google.com/search-console
- [ ] Domain property ekle: `aramuzik.com` (subdomain'leri de kapsar)
- [ ] DNS TXT kaydı ile doğrula (Vercel domain sağlayıcısında)
- [ ] **Sitemap gönder:** `https://www.aramuzik.com/sitemap.xml`
- [ ] **URL Inspection** ile anasayfayı manuel index'le (ilk hızlı görünürlük için)

### 3. Bing Webmaster Tools
- [ ] https://www.bing.com/webmasters
- [ ] Site ekle, GSC'den otomatik import et (kolay yol)
- [ ] Sitemap gönder

### 4. Google Merchant Center (Google Shopping için kritik)
- [ ] https://merchants.google.com
- [ ] **Hesap aç** → Türkiye seçili
- [ ] **Site doğrulaması** (GSC ile bağlanır)
- [ ] **Ürün feed'i:** En kolay yol → JSON-LD Product schema'mız zaten Merchant Center tarafından otomatik scraping için yeterli ("Crawl product data from your website" seçeneği)
- [ ] Alternatif: CSV/XML feed üret (gelecek iterasyon — şu an JSON-LD yeterli)

### 5. Google Analytics 4
- [ ] https://analytics.google.com → Property oluştur (Türkiye, TRY)
- [ ] Measurement ID al (G-XXXXXXX)
- [ ] **GA4 entegrasyonu kodlanmadı** — eklemek için bana söyle, `react-ga4` ile kur veya Vercel Analytics tercih et.

### 6. Sosyal medya hesapları (OG tag/Twitter card test için)
- [ ] **Twitter:** `@ARASOUNDS` handle'ı için başvur. (`twitter:site` meta tag bu kullanıcı adını referans ediyor.)
- [ ] **Instagram, Facebook, YouTube, TikTok:** Hesapları aç. Footer'da linkler hazır.
- [ ] **Open Graph paylaşım test:**
  - Facebook: https://developers.facebook.com/tools/debug
  - Twitter: https://cards-dev.twitter.com/validator
  - LinkedIn: https://www.linkedin.com/post-inspector

### 7. Schema doğrulama
- [ ] **Rich Results Test:** https://search.google.com/test/rich-results — her ürün URL'ini test et, `Product` schema'nın geçerli olduğunu doğrula.
- [ ] **Schema Markup Validator:** https://validator.schema.org — anasayfa + ürün + FAQ sayfalarını test et.

### 8. Ürün katalogu (en yüksek SEO etkisi)
- [ ] **Ürün başlıkları:** "[Marka] [Model] - [Ana Özellik]" formatında. Örn: *"Fender Stratocaster Player Series — Sunburst Elektro Gitar"*
- [ ] **Ürün açıklamaları:** Min 150 kelime, ana özellikler + kullanım alanları + paket içeriği. Google ilk 70-100 karakter'i meta description olarak otomatik kullanır.
- [ ] **Ürün görselleri:**
  - Min 1000×1000px, beyaz arka plan (Google Shopping zorunlu)
  - Filename: `fender-stratocaster-player-sunburst.jpg` (slug formatında)
  - `alt` text doluysa Google Image Search'te göründürür → ProductCard ve ProductDetail'de `alt={product.name}` zaten var ✓
- [ ] **Slug:** Şu an URL `/product/<UUID>`. Daha SEO-dostu: `/urun/fender-stratocaster-player-sunburst`. Önemli ama kritik değil; istersen ileri faz olarak yaparız.

### 9. İçerik SEO
- [ ] **Anasayfa H1:** Şu an `"Sesin Buradan Başlar."` — anahtar kelime içermiyor. Düşün: *"Premium Müzik Aletleri | Türkiye'nin Online Enstrüman Mağazası"* daha SEO-friendly olabilir. (Ama marka tonunu kaybetmeyelim — H1 + H2'yi optimize edip H1'i marka olarak tutmak da geçerli.)
- [ ] **Blog/Learn yazıları:** Her makale için anahtar kelime hedefle. Örnekler:
  - *"Yeni Başlayanlar İçin En İyi Akustik Gitar 2026"*
  - *"Stüdyo Kalitesinde Ev Studyosu Nasıl Kurulur"*
  - *"Profesyonel Davul Setleri Karşılaştırması"*
- [ ] Her makalenin altında ilgili ürünleri öner (internal linking).

### 10. Local SEO (Türkiye)
- [ ] **Google Business Profile** — fiziksel mağaza varsa kayıt. https://www.google.com/business
- [ ] **Yandex Webmaster** — Türkiye'de hâlâ %5-10 pazar payı. https://webmaster.yandex.com.tr

### 11. Performans
- [ ] **Lighthouse audit:** Production deploy sonrası `https://www.aramuzik.com` için Lighthouse çalıştır → 90+ skor hedefi.
- [ ] **CrUX rapor:** Real-user metrics — yayın sonrası 28 gün içinde Search Console'da görünür.
- [ ] **Vercel Image Optimization:** Vercel deploy'unda `next/image` benzeri otomatik resize. Bizim `<img>` etiketlerimiz manuel CDN URL kullanıyor — gelecek iterasyon: tüm `image_url`'leri Vercel Image API'sinden geçir.

### 12. Schema FAQ ve Rich Results
- [x] FAQPage schema kodlandı; **gerçek SSS içeriği eklenmesi gerekiyor** Admin Panel → FAQs üzerinden.
- [x] Product rich result hazır; **gerçek ürün rating'leri** geldikçe AggregateRating schema otomatik dolacak.

---

## 🚀 Lansman Sırası (özet)

```
1. Domain satın al + Vercel'e bağla
2. .env Vercel'e gir (SITE_URL = www.aramuzik.com)
3. Production deploy
4. Google Search Console doğrula → sitemap gönder
5. Bing Webmaster ekle
6. Twitter handle al → meta tag güncelle (eğer @ARASOUNDS değilse)
7. OG tag debugger ile paylaşım önizlemesi test et
8. Schema Rich Results Test ile JSON-LD doğrula
9. İlk 50 ürünü adminden ekle (başlık + açıklama + 1000px görseller)
10. Lighthouse audit → 90+ Performance, 100 SEO, 100 Accessibility hedefi
```

---

## 🔄 Sürekli SEO işleri (deploy sonrası, haftalık)

- **Search Console "Coverage" raporu** kontrol et — hatalı dizine alınan sayfalar var mı?
- **Search Console "Performance"** — hangi sorgular için göründüğümüze bak, low-hanging keyword'leri içeriğe ekle.
- **404 hataları** — Search Console'da görünür, redirect ekle veya içerik üret.
- **Sitemap güncel** — her deploy `npm run sitemap` çalışıyor (postbuild). Yeni ürün eklendiğinde otomatik sitemap'e dahil olur (build deploy edildiğinde).
- **Yeni Learn makaleleri** — ayda min 2 yazı önerilir (E-E-A-T sinyali).
- **Backlink monitoring** — Ahrefs / SemRush deneme hesaplarıyla kontrol et (ücretsiz quota var).

---

## Bot/Scraper güvenliği

`robots.txt` Ahrefs, Semrush, MJ12, DotBot gibi yağmacı bot'ları engelliyor. Buna rağmen sunucu logları temiz kalmazsa Cloudflare Bot Management (Vercel'de mevcut) açabilirsin.
