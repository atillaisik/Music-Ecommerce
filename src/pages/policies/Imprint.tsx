import { PolicyPage } from "@/components/PolicyPage";
import { useStoreSettings } from "@/lib/storeSettingsAPI";

const Field = ({ label, value }: { label: string; value: string | undefined }) => (
    <li>
        <strong>{label}:</strong>{" "}
        {value && value.trim().length > 0 ? value : <span className="italic text-muted-foreground">—</span>}
    </li>
);

const Imprint = () => {
    const { data: settings } = useStoreSettings();
    const storeName = settings?.legalName || settings?.storeName || "ARASOUNDS";
    const supportEmail = settings?.supportEmail;
    const address = settings?.address;
    const phone = settings?.supportPhone;
    const mersisNo = settings?.mersisNo;
    const taxOffice = settings?.taxOffice;
    const taxNumber = settings?.taxNumber;
    const tradeRegistryNo = settings?.tradeRegistryNo;
    const kepAddress = settings?.kepAddress;
    const etbisNo = settings?.etbisNo;

    return (
        <PolicyPage
            title="Künye / Firma Bilgileri"
            description="6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ve Bilgi Toplumu Hizmetleri kapsamında firma bilgileri."
        >
            <p>
                6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun, 5651
                sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi Kanunu ve
                Bilgi Toplumu Hizmetleri Yönetmeliği uyarınca aşağıda firmamıza ait
                bilgileri yayımlıyoruz.
            </p>

            <h2>Firma Bilgileri</h2>
            <ul>
                <Field label="Ticari Unvan" value={storeName} />
                <Field label="MERSIS No" value={mersisNo} />
                <Field label="Vergi Dairesi" value={taxOffice} />
                <Field label="Vergi Kimlik No" value={taxNumber} />
                <Field label="Ticaret Sicil No" value={tradeRegistryNo} />
                <Field label="Merkez Adresi" value={address} />
                <Field label="Telefon" value={phone} />
                <li>
                    <strong>E-posta:</strong>{" "}
                    {supportEmail ? (
                        <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
                    ) : (
                        <span className="italic text-muted-foreground">—</span>
                    )}
                </li>
                <li>
                    <strong>Web Sitesi:</strong>{" "}
                    <a href="/">arasounds.com</a>
                </li>
                <Field label="KEP Adresi" value={kepAddress} />
                <Field label="ETBİS Kayıt No" value={etbisNo} />
            </ul>

            <h2>Yetkili Kurum</h2>
            <p>
                Faaliyetlerimiz Türkiye Cumhuriyeti Ticaret Bakanlığı ile T.C. Sanayi
                ve Teknoloji Bakanlığı'nın ilgili mevzuatına tabidir. Tüketici şikayetleri
                için Tüketici Hakem Heyetleri ve Tüketici Mahkemelerine başvurabilir,
                ayrıca <a href="https://www.tuketici.gov.tr" target="_blank" rel="noreferrer">
                www.tuketici.gov.tr</a> üzerinden çevrim içi başvuru yapabilirsiniz.
            </p>

            <h2>Veri Sorumlusu</h2>
            <p>
                6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında
                veri sorumlusu sıfatıyla {storeName} hareket etmektedir. Detaylı
                aydınlatma metni için{" "}
                <a href="/gizlilik-politikasi">Gizlilik Politikası</a> sayfasına
                bakınız.
            </p>
        </PolicyPage>
    );
};

export default Imprint;
