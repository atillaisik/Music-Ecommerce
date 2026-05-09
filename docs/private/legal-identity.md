# ARASOUNDS — Tüzel Kişilik Bilgileri (Yasal Belgeler İçin)

> **Bu belge gizlidir.** Yalnızca yasal sözleşmeler, fatura şablonları, ETBİS/Ticaret Bakanlığı başvurusu, ödeme alt-yapısı (Iyzico/PayTR) entegrasyonu sırasında referans olarak kullanılır. **Sitede yayımlanmaz** — yalnızca aşağıda işaretli alanlar (MERSIS, Vergi Dairesi, Ticaret Sicil) Mesafeli Sözleşmeler Yönetmeliği gereği footer/künye sayfasında zaten görünür.

## Mevcut Bilgiler

| Alan | Değer | Public site'da görünür mü? |
|---|---|---|
| MERSIS Numarası | `53227139350000011` | ✅ Evet (yasal zorunluluk — Footer + /kunye) |
| Vergi Numarası (VKN) | `5322713935` | ✅ Evet (footer/künye) |
| Vergi Dairesi | `Sarıgazi` | ✅ Evet (footer/künye) |
| Ticaret Sicil No | `923664-0` | ✅ Evet (footer/künye) |
| Adres | `115. Sokak No: 4-B Alemdağ, 34794 Çekmeköy/İstanbul` | ✅ Evet (Footer + İletişim) |
| Destek E-posta | `destek@arasounds.com` | ✅ Evet |
| Mağaza Adı | `ARASOUNDS` | ✅ Evet |

> **Yasal not:** Türkiye'de e-ticaret faaliyeti gösteren tüzel kişiler için MERSIS, Vergi Dairesi, Vergi Numarası, Ticaret Sicil No ve adres bilgilerinin sitede (genellikle footer + "Künye / Yasal Bilgiler" sayfasında) **gösterilmesi yasal zorunluluktur** (6563 Sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun + Mesafeli Sözleşmeler Yönetmeliği). Şu an Footer ve `/kunye` sayfasında otomatik olarak çekilip gösteriliyor.

## Eksik / Tamamlanması Gereken Bilgiler

| Alan | Neden gerekli? | Ne yapmalı? |
|---|---|---|
| **Tüzel Ad (Legal Name)** — örn. *"Aras Sounds Müzik Aletleri Ticaret Limited Şirketi"* | Tüm yasal sözleşmelerde ve fatura/sözleşme satırında **resmi unvan** gerekir. `storeName` markadır; legal name şirket türü dahil tam unvandır. | Resmi şirket ünvanını **Admin Panel → Settings**'de "Legal Name" alanına gir. |
| **KEP Adresi** (Kayıtlı Elektronik Posta) — örn. `arasounds@hs01.kep.tr` | Türkiye'de tüzel kişiler için KEP zorunlu. Resmi ihtarname/tebligatlar bu adrese gider. KVKK/VERBIS kayıtları için de istenir. | PTT, Türkkep, eTuğra'dan KEP adresi al → Admin Panel → Settings'e ekle. |
| **ETBİS Numarası** (Elektronik Ticaret Bilgi Sistemi) | E-ticaret faaliyeti için Ticaret Bakanlığı'na **ETBİS kaydı zorunlu**. Site açılmadan önce başvurulmalı. | https://etbis.gtb.gov.tr → Şirket adına ETBİS kaydı yap → numarayı Admin Panel'e ekle. |
| **Telefon Numarası** | Footer'da görünür, Mesafeli Sözleşmeler Yön. md. 5(d) gereği zorunlu. | Mağaza/destek hattını gir (mobil olabilir). |
| **Banka / IBAN** (Havale ödemesi için) | Ödeme alıcı bilgisi olarak Mesafeli Satış Sözleşmesi'nde geçer. | Şirket banka hesabı + IBAN. Admin Panel'de saklanır, sitede gösterilmez (sadece sözleşmede). |
| **VERBIS Veri Sorumlusu Sicil No** (KVKK kapsamında) | Kişisel veri işleyen tüzel kişiler için zorunlu. Gizlilik Politikası'nda belirtilir. | https://verbis.kvkk.gov.tr → kayıt → numarayı Privacy Policy'e ekle. |
| **Ticaret Odası kaydı** (örn. İstanbul Ticaret Odası) | Ticaret Sicil ile birlikte sözleşmelerde geçer. | Hangi ticaret odasına kayıtlı? Künye'de belirt. |
| **Faaliyet konusu (NACE kodu)** | Vergi/ETBİS başvurusunda gerekli. Müzik aleti perakende → NACE 47.59.06 veya 47.78.99. | Resmî kayıttaki NACE kodunu doğrula, ETBİS'e gir. |

## Otomatik gösterim akışı

Admin Panel → **Settings** → **Yasal Bilgiler** sekmesinde tek bir form var. Buraya girdiğin değerler:

1. `public.site_content` tablosunda (`page_name='system', section_name='settings'`) JSONB olarak saklanır.
2. Footer'da MERSIS / Vergi Dairesi / Ticaret Sicil otomatik basılır.
3. `/kunye` sayfasında tüm değerler tablo halinde görüntülenir.
4. Mesafeli Satış Sözleşmesi şablonu da bu değerleri çağırır (sözleşme her sipariş için satıcı bilgileriyle birlikte oluşturulur).
5. Anasayfa + İletişim sayfasında JSON-LD `Organization` / `Store` schema'sı bu bilgileri Google'a iletir → "Knowledge Panel" eligibility için önemli.

> Uyarı: Bu değerleri değiştirdiğinde tüm footer + sözleşmeler + JSON-LD anında güncellenir. Production'da değiştirirken dikkatli ol.
