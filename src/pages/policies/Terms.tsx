import { PolicyPage } from "@/components/PolicyPage";
import { useStoreSettings } from "@/lib/storeSettingsAPI";

const Terms = () => {
    const { data: settings } = useStoreSettings();
    const storeName = settings?.storeName ?? "ARASOUNDS";
    const supportEmail = settings?.supportEmail || "destek@arasounds.com";

    return (
        <PolicyPage
            title="Kullanım Koşulları"
            description="ARASOUNDS sitesinin kullanım koşulları."
        >
            <p>
                Bu Kullanım Koşulları ("Koşullar"), {storeName} tarafından işletilen web
                sitesinin ("Site") ziyaret ve kullanımına ilişkin esasları düzenler.
                Siteye erişerek veya hizmetlerimizi kullanarak bu Koşulları kabul etmiş
                sayılırsınız.
            </p>

            <h2>1. Taraflar ve Tanımlar</h2>
            <ul>
                <li>
                    <strong>Satıcı:</strong> {storeName} (Künye sayfasındaki tüzel kişi
                    bilgileri esas alınır).
                </li>
                <li>
                    <strong>Alıcı / Kullanıcı:</strong> Siteyi ziyaret eden veya
                    Site üzerinden ürün satın alan gerçek/tüzel kişi.
                </li>
                <li>
                    <strong>Site:</strong> Satıcı'ya ait{" "}
                    <a href="/">arasounds.com</a> alan adı altında yayın yapan internet
                    sitesi.
                </li>
            </ul>

            <h2>2. Üyelik ve Hesap Güvenliği</h2>
            <p>
                Üye girişi yapılarak veya misafir olarak alışveriş yapılabilir. Üyelik
                oluştururken doğru bilgi vermek Kullanıcı'nın sorumluluğundadır. Hesap
                bilgilerinin gizliliğinden ve hesabınız üzerinden yapılan tüm
                işlemlerden Kullanıcı sorumludur. Yetkisiz erişim şüphesinde derhal{" "}
                <a href={`mailto:${supportEmail}`}>{supportEmail}</a> adresine bildirim
                yapılmalıdır.
            </p>

            <h2>3. Ürünler ve Sipariş</h2>
            <p>
                Site'de yer alan ürün görsellerinin ve açıklamalarının doğru olması için
                makul özen gösterilmektedir; ancak basım, dizgi ve görüntüleme kaynaklı
                farklılıklar olabilir. Fiyatlar Türk Lirası (TL) cinsinden ve KDV
                dahildir. Stokların tükendiği veya fiyatın hatalı yansıdığı durumlarda
                Satıcı, siparişi onaylamama ve ödemenin tamamını iade etme hakkını
                saklı tutar.
            </p>

            <h2>4. Fikri Mülkiyet Hakları</h2>
            <p>
                Site'deki tüm görsel ve metin içerik, tasarım, logo, marka ve yazılım,
                Satıcı veya lisans sağlayıcıları'nın mülkiyetindedir. Önceden yazılı
                izin olmaksızın çoğaltılamaz, dağıtılamaz veya ticari amaçla
                kullanılamaz.
            </p>

            <h2>5. Yasaklı Davranışlar</h2>
            <ul>
                <li>Site'nin güvenliğini tehdit eden veya hizmetlerini aksatan eylemler.</li>
                <li>Sahte veya yanıltıcı bilgilerle sipariş oluşturma.</li>
                <li>İçeriklerin izinsiz kopyalanması veya tersine mühendisliği.</li>
                <li>Üçüncü kişilerin haklarını ihlal eden paylaşımlar (yorum, inceleme vb.).</li>
            </ul>

            <h2>6. Sorumluluğun Sınırlandırılması</h2>
            <p>
                Satıcı; Site'nin kesintisiz, hatasız ve güvenli olacağını taahhüt etmez.
                Site'nin kullanımından doğabilecek dolaylı, arızi veya sonuç olarak
                ortaya çıkan zararlardan, yürürlükteki mevzuatın izin verdiği azami
                ölçüde, sorumlu tutulamaz.
            </p>

            <h2>7. Değişiklikler</h2>
            <p>
                Satıcı bu Koşulları herhangi bir zamanda güncelleyebilir. Güncellemeler
                bu sayfada yayımlandığı tarihte yürürlüğe girer. Site'yi kullanmaya
                devam etmeniz, güncel Koşulları kabul ettiğiniz anlamına gelir.
            </p>

            <h2>8. Uyuşmazlıkların Çözümü</h2>
            <p>
                Bu Koşullar Türkiye Cumhuriyeti hukukuna tabidir. Doğabilecek
                uyuşmazlıklarda, 6502 sayılı Tüketicinin Korunması Hakkında Kanun
                kapsamında ilan edilen parasal sınırlar dahilinde Tüketici Hakem
                Heyetleri ve Tüketici Mahkemeleri yetkilidir.
            </p>

            <h2>9. İletişim</h2>
            <p>
                Sorularınız için: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
                {settings?.supportPhone ? <> · {settings.supportPhone}</> : null}
            </p>
        </PolicyPage>
    );
};

export default Terms;
