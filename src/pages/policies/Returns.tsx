import { PolicyPage } from "@/components/PolicyPage";
import { useStoreSettings } from "@/lib/storeSettingsAPI";

const Returns = () => {
    const { data: settings } = useStoreSettings();
    const storeName = settings?.storeName ?? "ARASOUNDS";
    const supportEmail = settings?.supportEmail || "destek@arasounds.com";

    return (
        <PolicyPage
            title="İade ve Cayma Hakkı"
            description="14 günlük cayma hakkı, iade koşulları ve süreçleri."
        >
            <p>
                6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
                Sözleşmeler Yönetmeliği uyarınca tüketicilerin <strong>14 günlük cayma
                hakkı</strong> bulunmaktadır.
            </p>

            <h2>1. Cayma Hakkı Süresi</h2>
            <p>
                Tüketici, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün
                içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin
                sözleşmeden cayma hakkına sahiptir. Süre, son günün mesai bitiminde
                sona erer.
            </p>

            <h2>2. Cayma Bildiriminin Yapılması</h2>
            <p>
                Cayma hakkını kullanmak için süresi içinde {storeName}'a yazılı
                bildirimde bulunmanız yeterlidir. Aşağıdaki yollardan birini
                kullanabilirsiniz:
            </p>
            <ul>
                <li>
                    E-posta: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
                </li>
                <li>
                    Hesabım sayfasındaki "Sipariş Detayı" ekranı üzerinden iade
                    talebi.
                </li>
            </ul>

            <h2>3. İade Edilecek Ürünün Durumu</h2>
            <ul>
                <li>Orijinal ambalajı, etiketi ve aksesuarları eksiksiz olmalıdır.</li>
                <li>Kullanılmamış ve hasar görmemiş olmalıdır.</li>
                <li>
                    Müzik aletlerinde özellikle: tellerin değiştirilmemiş olması, gövde
                    üzerinde çizik/leke bulunmaması, perde tellerinin yıpranmamış olması
                    aranır.
                </li>
                <li>Faturanın aslı ürünle birlikte iade edilmelidir.</li>
            </ul>

            <h2>4. İadenin Mümkün Olmadığı Durumlar (Yön. m. 15)</h2>
            <ul>
                <li>
                    Tüketicinin istekleri/kişisel ihtiyaçları doğrultusunda hazırlanan,
                    niteliği itibariyle geri gönderilmeye elverişli olmayan veya çabuk
                    bozulma tehlikesi bulunan ürünler.
                </li>
                <li>
                    Ambalajı tüketici tarafından açılmış ses/video kayıtları veya
                    yazılım programları (örn. dijital nota, eğitim yazılımı).
                </li>
                <li>
                    Tüketicinin istekleri doğrultusunda kişiselleştirilmiş ürünler
                    (örn. kişiye özel gravür yapılmış enstrümanlar).
                </li>
            </ul>

            <h2>5. İade Kargo Ücreti</h2>
            <p>
                Anlaşmalı kargo firmamız ile yapılacak iadelerde <strong>kargo ücreti
                {storeName} tarafından karşılanır</strong>. Anlaşmalı kargo dışında
                gönderilen iadelerde kargo ücreti tüketiciye aittir.
            </p>

            <h2>6. Geri Ödeme Süreci</h2>
            <p>
                İade ürünü teslim aldıktan ve uygunluğunu doğruladıktan sonra
                <strong> en geç 14 gün içinde </strong> ödeme tutarınız, sipariş
                sırasında kullandığınız ödeme aracına iade edilir. Banka/kredi kartı
                iadelerinde tutarın hesaba yansıma süresi bankanız politikalarına
                tabidir.
            </p>

            <h2>7. Ayıplı (Hatalı/Hasarlı) Ürünler</h2>
            <p>
                Teslim aldığınız ürün ayıplı (hatalı/hasarlı/eksik) ise tüketicinin
                seçimlik hakları olarak şunları talep edebilirsiniz:
            </p>
            <ul>
                <li>Ürünün ayıpsız muadili ile değiştirilmesi.</li>
                <li>Ödenen bedelin iadesi (sözleşmeden dönme).</li>
                <li>Ayıp oranında bedel indirimi.</li>
                <li>Ücretsiz onarım.</li>
            </ul>
            <p>
                Bu haklarınız teslim tarihinden itibaren 2 (iki) yıl boyunca geçerlidir
                (TKHK m. 12). Ayıbı tespit ettiğinizde 30 gün içinde bildirmeniz
                önerilir.
            </p>

            <h2>8. İletişim</h2>
            <p>
                İade ile ilgili tüm sorularınız için:{" "}
                <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
            </p>
        </PolicyPage>
    );
};

export default Returns;
