import { PolicyPage } from "@/components/PolicyPage";
import { useStoreSettings } from "@/lib/storeSettingsAPI";

const Shipping = () => {
    const { data: settings } = useStoreSettings();
    const storeName = settings?.storeName ?? "ARASOUNDS";
    const supportEmail = settings?.supportEmail || "destek@arasounds.com";

    return (
        <PolicyPage
            title="Teslimat ve Kargo Politikası"
            description="Kargo süreleri, ücret ve hasarlı teslimat süreçleri."
        >
            <h2>1. Kargo Bölgesi</h2>
            <p>
                {storeName} olarak Türkiye Cumhuriyeti sınırları içerisindeki tüm 81
                ile teslimat yapmaktayız. Yurt dışı gönderim hâlihazırda
                desteklenmemektedir.
            </p>

            <h2>2. Kargo Ücreti</h2>
            <p>
                Aksi sipariş özetinde belirtilmedikçe <strong>kargo bedeli ürün
                fiyatına dahildir</strong>. Bazı büyük/ağır enstrümanlarda istisnai
                durumlarda ek ücret uygulanabilir; bu durumda fiyat sipariş öncesinde
                ayrıca gösterilir.
            </p>

            <h2>3. Kargoya Verme Süresi</h2>
            <p>
                Onaylanan ve ödemesi alınan siparişler hafta içi 16:00'a kadar
                hazırlanarak <strong>1–3 iş günü</strong> içerisinde kargoya
                verilmektedir. Resmî tatiller ve hafta sonları bu süreye dahil değildir.
                Stok durumuna bağlı olarak özel sipariş enstrümanlarda hazırlık süresi
                uzayabilir; bu durum sipariş onay e-postanızda belirtilir.
            </p>

            <h2>4. Tahmini Teslimat Süresi</h2>
            <p>
                Kargoya verildikten sonra anlaşmalı kargo firmamız genelde{" "}
                <strong>1–4 iş günü</strong> içinde teslimat gerçekleştirir. Doğu ve
                Güneydoğu Anadolu bölgelerinde bu süre 5 iş gününe kadar uzayabilir.
            </p>

            <h2>5. Kargo Takibi</h2>
            <p>
                Siparişiniz kargoya verildiğinde tarafınıza takip numarasını içeren
                bilgilendirme e-postası gönderilir. Takip numarasını "Hesabım → Son
                Siparişler" ekranından da görüntüleyebilirsiniz.
            </p>

            <h2>6. Hasarlı / Eksik Teslimat</h2>
            <p>
                Kargo paketinin dışında belirgin bir hasar (yırtık, ezilme, ıslanma)
                gördüğünüzde:
            </p>
            <ul>
                <li><strong>Kargoyu teslim almayın</strong> ve "Hasarlı" notu ile iade edin.</li>
                <li>
                    Aldıysanız, açtıktan sonra fark ettiğiniz hasarı{" "}
                    <strong>24 saat içinde</strong> görsellerle birlikte{" "}
                    <a href={`mailto:${supportEmail}`}>{supportEmail}</a> adresine
                    bildirin.
                </li>
            </ul>
            <p>
                Hasarlı/eksik teslimatlarda ürünün ayıpsız muadili ücretsiz olarak
                gönderilir veya ödeme tutarı tarafınıza iade edilir.
            </p>

            <h2>7. Teslimat Adresi Değişikliği</h2>
            <p>
                Kargoya verilmeden önce sipariş özet sayfanızdan veya destek hattımız
                üzerinden teslimat adresinizi değiştirebilirsiniz. Kargoya verildikten
                sonra adres değişikliği yalnızca kargo firmasının imkân tanıdığı
                ölçüde mümkündür.
            </p>

            <h2>8. İletişim</h2>
            <p>
                Kargo ile ilgili tüm sorularınız için:{" "}
                <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
            </p>
        </PolicyPage>
    );
};

export default Shipping;
