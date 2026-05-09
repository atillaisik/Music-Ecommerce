import { PolicyPage } from "@/components/PolicyPage";
import { useStoreSettings } from "@/lib/storeSettingsAPI";

const Privacy = () => {
    const { data: settings } = useStoreSettings();
    const storeName = settings?.legalName || settings?.storeName || "ARASOUNDS";
    const supportEmail = settings?.supportEmail || "destek@arasounds.com";
    const address = settings?.address || "—";
    const mersisNo = settings?.mersisNo;

    return (
        <PolicyPage
            title="Gizlilik Politikası ve KVKK Aydınlatma Metni"
            description="Kişisel verilerin işlenmesine ilişkin aydınlatma metni ve gizlilik politikası."
        >
            <p>
                {storeName} ("Veri Sorumlusu", "Biz") olarak 6698 sayılı Kişisel
                Verilerin Korunması Kanunu ("KVKK") kapsamında kişisel verilerinizin
                güvenliğine önem veriyoruz. Bu metin, kişisel verilerinizin hangi
                amaçlarla, hangi hukuki sebeplerle işlendiğini ve haklarınızı
                açıklamak amacıyla hazırlanmıştır.
            </p>

            <h2>1. Veri Sorumlusu</h2>
            <p>
                <strong>{storeName}</strong>
                {mersisNo && <> · MERSIS: {mersisNo}</>}
                <br />
                {address}
                <br />
                E-posta: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
            </p>

            <h2>2. İşlenen Kişisel Veriler</h2>
            <ul>
                <li>
                    <strong>Kimlik bilgileri:</strong> ad, soyad.
                </li>
                <li>
                    <strong>İletişim bilgileri:</strong> e-posta adresi, telefon
                    numarası, teslimat adresi.
                </li>
                <li>
                    <strong>Müşteri işlem bilgileri:</strong> sipariş geçmişi, sepet
                    içeriği, favori listesi, ürün incelemeleri.
                </li>
                <li>
                    <strong>İşlem güvenliği:</strong> giriş tarihleri, IP adresi,
                    tarayıcı ve cihaz bilgisi (yalnızca güvenlik amacıyla).
                </li>
                <li>
                    <strong>Pazarlama bilgileri:</strong> haber bülteni aboneliği
                    (açık rıza ile).
                </li>
            </ul>

            <h2>3. Verilerin İşlenme Amaçları</h2>
            <ul>
                <li>Sipariş oluşturma, ödeme alma ve teslimatın gerçekleştirilmesi.</li>
                <li>Üyelik işlemlerinin yürütülmesi.</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi (vergi, fatura, kayıt tutma).</li>
                <li>Müşteri hizmetleri ve şikayet yönetimi.</li>
                <li>Hizmetlerimizin iyileştirilmesi ve site güvenliğinin sağlanması.</li>
                <li>Açık rıza vermeniz hâlinde pazarlama/elektronik ileti gönderimi.</li>
            </ul>

            <h2>4. Hukuki Sebepler (KVKK m. 5)</h2>
            <ul>
                <li>Sözleşmenin kurulması ve ifası (sipariş, teslimat).</li>
                <li>Veri sorumlusunun hukuki yükümlülüğü (vergi, ticari defter).</li>
                <li>Bir hakkın tesisi/kullanılması/korunması için zorunlu olması.</li>
                <li>Meşru menfaat (dolandırıcılık önleme, hizmet kalitesi).</li>
                <li>Açık rıza (pazarlama iletişimi, isteğe bağlı çerezler).</li>
            </ul>

            <h2>5. Verilerin Aktarımı</h2>
            <p>
                Kişisel verileriniz, yalnızca aşağıdaki amaçlar için ve gerekli güvenlik
                önlemleri alınarak paylaşılır:
            </p>
            <ul>
                <li>
                    <strong>Ödeme kuruluşları</strong> — sipariş ödemesinin alınması.
                </li>
                <li>
                    <strong>Kargo ve lojistik firmaları</strong> — siparişin teslim
                    edilmesi.
                </li>
                <li>
                    <strong>Bulut servis sağlayıcılar</strong> (Supabase, Vercel) —
                    altyapı barındırma.
                </li>
                <li>
                    <strong>E-posta servis sağlayıcıları</strong> — sipariş bildirimleri.
                </li>
                <li>
                    <strong>Yetkili kamu kurumları</strong> — yasal zorunluluk hâlinde.
                </li>
            </ul>

            <h2>6. Saklama Süresi</h2>
            <p>
                Kişisel verileriniz, işlenme amaçları ve ilgili mevzuatın öngördüğü
                süreler boyunca saklanır. Vergi Usul Kanunu uyarınca ticari belgeler
                en az 5 yıl, Türk Ticaret Kanunu uyarınca defter ve belgeler 10 yıl
                süreyle saklanmaktadır. Bu süreler sonunda veriler imha edilir veya
                anonim hâle getirilir.
            </p>

            <h2>7. Haklarınız (KVKK m. 11)</h2>
            <ul>
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme.</li>
                <li>İşlenmişse buna ilişkin bilgi talep etme.</li>
                <li>İşlenme amacını ve bu amaca uygun kullanılıp kullanılmadığını öğrenme.</li>
                <li>Yurt içi/dışında aktarıldığı üçüncü kişileri öğrenme.</li>
                <li>Eksik/yanlış işlenmişse düzeltilmesini isteme.</li>
                <li>KVKK'nın 7. maddesi uyarınca silinmesini/yok edilmesini isteme.</li>
                <li>Düzeltme/silme/yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme.</li>
                <li>Otomatik sistemlerle analiz edilerek aleyhe sonuç doğmasına itiraz etme.</li>
                <li>Kanuna aykırı işleme sebebiyle zarara uğramışsanız tazminat talep etme.</li>
            </ul>
            <p>
                Haklarınızı kullanmak için <a href={`mailto:${supportEmail}`}>{supportEmail}</a>{" "}
                adresine yazılı başvuru yapabilirsiniz. Talepleriniz en geç 30 gün
                içinde sonuçlandırılır.
            </p>

            <h2>8. Çerezler</h2>
            <p>
                Site'de kullanılan çerezler hakkında ayrıntı için lütfen{" "}
                <a href="/cerez-politikasi">Çerez Politikası</a> sayfamıza bakınız.
            </p>

            <h2>9. Değişiklikler</h2>
            <p>
                Bu metin gerektiğinde güncellenebilir; güncel sürüm her zaman bu
                sayfada yayımlanır.
            </p>
        </PolicyPage>
    );
};

export default Privacy;
