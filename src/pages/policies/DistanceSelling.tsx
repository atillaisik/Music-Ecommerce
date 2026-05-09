import { PolicyPage } from "@/components/PolicyPage";
import { useStoreSettings } from "@/lib/storeSettingsAPI";

const DistanceSelling = () => {
    const { data: settings } = useStoreSettings();
    const storeName = settings?.legalName || settings?.storeName || "ARASOUNDS";
    const supportEmail = settings?.supportEmail || "destek@arasounds.com";
    const address = settings?.address || "—";
    const phone = settings?.supportPhone || "—";
    const mersisNo = settings?.mersisNo;
    const taxOffice = settings?.taxOffice;
    const taxNumber = settings?.taxNumber;
    const tradeRegistryNo = settings?.tradeRegistryNo;

    return (
        <PolicyPage
            title="Mesafeli Satış Sözleşmesi (Ön Bilgilendirme Formu)"
            description="6502 sayılı kanun kapsamında ön bilgilendirme formu ve mesafeli satış sözleşmesi."
        >
            <p>
                İşbu Mesafeli Satış Sözleşmesi ("Sözleşme"), 6502 sayılı Tüketicinin
                Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği
                hükümlerine tabidir. Sözleşmenin elektronik ortamda kabulü ile
                taraflar karşılıklı hak ve yükümlülüklerini kabul etmiş olur.
            </p>

            <h2>1. Taraflar</h2>
            <p>
                <strong>SATICI</strong>
                <br />
                Unvan: {storeName}
                <br />
                Adres: {address}
                <br />
                Telefon: {phone}
                <br />
                E-posta: <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
                {mersisNo && (
                    <>
                        <br />
                        MERSIS No: {mersisNo}
                    </>
                )}
                {(taxOffice || taxNumber) && (
                    <>
                        <br />
                        Vergi Dairesi / No: {taxOffice ?? "—"} / {taxNumber ?? "—"}
                    </>
                )}
                {tradeRegistryNo && (
                    <>
                        <br />
                        Ticaret Sicil No: {tradeRegistryNo}
                    </>
                )}
            </p>
            <p>
                <strong>ALICI</strong>
                <br />
                Sipariş esnasında verilen ad, adres, telefon ve e-posta bilgilerine
                sahip gerçek/tüzel kişi.
            </p>

            <h2>2. Sözleşmenin Konusu</h2>
            <p>
                Sözleşmenin konusu, ALICI'nın SATICI'ya ait Site üzerinden elektronik
                ortamda siparişini verdiği, sözleşmede ürün özellikleri, satış
                fiyatı, ödeme şekli ve teslimatına ilişkin koşullar belirtilen ürünün
                satışı ve teslimi ile ilgili tarafların hak ve yükümlülüklerinin
                belirlenmesidir.
            </p>

            <h2>3. Sözleşme Konusu Ürün</h2>
            <p>
                Ürünlerin türü, miktarı, marka/modeli, satış bedeli, ödeme şekli ve
                teslim alacak kişi/teslim adresi sipariş özet ekranında ve
                tarafınıza gönderilen sipariş onay e-postasında yer almaktadır. Tüm
                fiyatlara KDV dahildir.
            </p>

            <h2>4. Genel Hükümler</h2>
            <ul>
                <li>
                    ALICI, sipariş öncesinde ürünün temel nitelikleri, satış fiyatı,
                    ödeme şekli, teslimat süresi ve cayma hakkına ilişkin bilgileri
                    okuyup sipariş özet ekranında onayladığını kabul eder.
                </li>
                <li>
                    SATICI, sözleşme konusu ürünün sağlam, eksiksiz, siparişte
                    belirtilen niteliklere uygun ve varsa garanti belgeleri ve
                    kullanım kılavuzları ile teslim edilmesinden sorumludur.
                </li>
                <li>
                    Ürün, ALICI'dan başka bir kişi/kuruluşa teslim edilecekse, teslim
                    edilecek kişi/kuruluşun teslimatı kabul etmemesinden SATICI sorumlu
                    tutulamaz.
                </li>
                <li>
                    SATICI, mücbir sebepler veya nakliyeyi engelleyen olağanüstü
                    durumlar dolayısıyla 30 gün içinde ürünü teslim edemezse durumu
                    ALICI'ya bildirir; ALICI siparişi iptal etme hakkına sahiptir.
                </li>
            </ul>

            <h2>5. Cayma Hakkı</h2>
            <p>
                ALICI, ürünü teslim aldığı tarihten itibaren <strong>14 (on dört) gün
                </strong> içinde herhangi bir gerekçe göstermeksizin ve cezai şart
                ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma hakkının
                kullanılması ve istisnaları için lütfen{" "}
                <a href="/iade-politikasi">İade ve Cayma Hakkı</a> sayfamızı inceleyin.
            </p>

            <h2>6. Cayma Hakkının Kullanılamayacağı Hâller</h2>
            <ul>
                <li>
                    Ambalajı ALICI tarafından açılmış ses/video kayıtları veya yazılım
                    programları.
                </li>
                <li>
                    ALICI'nın istek veya kişisel ihtiyaçları doğrultusunda
                    kişiselleştirilen ürünler (kişiye özel gravür, ölçü ile yapılmış
                    enstrüman vb.).
                </li>
                <li>
                    Niteliği itibariyle iadesi mümkün olmayan veya çabuk bozulma
                    tehlikesi olan ürünler.
                </li>
            </ul>

            <h2>7. Ödeme</h2>
            <p>
                Ödeme, Site üzerinden kredi/banka kartı veya Site'de sunulan diğer
                ödeme yöntemleri ile yapılır. Ödeme onayı alındıktan sonra sipariş
                hazırlanmaya başlanır.
            </p>

            <h2>8. Teslimat</h2>
            <p>
                Sipariş, ödemenin onaylanmasını takiben en geç 30 gün içerisinde
                anlaşmalı kargo firması aracılığıyla ALICI'nın belirttiği adrese
                teslim edilir. Pratikte teslimat süresi 1–7 iş günü arasındadır.
                Detaylar için <a href="/teslimat-politikasi">Teslimat Politikası</a>{" "}
                sayfasına bakınız.
            </p>

            <h2>9. Yetkili Mahkeme</h2>
            <p>
                İşbu Sözleşme'nin uygulanmasında, 6502 sayılı Kanun çerçevesinde
                Sanayi ve Ticaret Bakanlığı'nca ilan edilen değere kadar Tüketici
                Hakem Heyetleri, aşan durumlarda ise Tüketici Mahkemeleri yetkilidir.
            </p>

            <h2>10. Yürürlük</h2>
            <p>
                ALICI, Site üzerinden verdiği siparişe ait ödemeyi gerçekleştirdiğinde
                işbu Sözleşmenin tüm koşullarını kabul etmiş sayılır.
            </p>
        </PolicyPage>
    );
};

export default DistanceSelling;
