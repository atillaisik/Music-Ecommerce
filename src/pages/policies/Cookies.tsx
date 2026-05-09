import { PolicyPage } from "@/components/PolicyPage";

const Cookies = () => (
    <PolicyPage
        title="Çerez Politikası"
        description="Çerez kullanımı, kategoriler ve tercihlerin yönetilmesi."
    >
        <p>
            Site'mizi ziyaret ettiğinizde tarayıcınıza küçük metin dosyaları
            ("çerezler") yerleştirilebilir. Bu Politika, hangi çerezleri ne amaçla
            kullandığımızı ve tercihlerinizi nasıl yönetebileceğinizi açıklar.
        </p>

        <h2>1. Çerez Nedir?</h2>
        <p>
            Çerezler, ziyaret ettiğiniz sitelerin tarayıcınızda sakladığı küçük metin
            dosyalarıdır. Bir sonraki ziyaretinizde sitenin sizi tanımasını,
            tercihlerinizi hatırlamasını ve hizmetin işlevselliğini sağlar.
        </p>

        <h2>2. Kullandığımız Çerez Türleri</h2>
        <h3>2.1. Zorunlu (Strictly Necessary) Çerezler</h3>
        <p>
            Sitenin temel işlevleri için gereklidir; oturum yönetimi, sepet,
            güvenlik. Bu çerezler kapatılamaz; izninize tabi değildir.
        </p>
        <ul>
            <li><code>sb-*-auth-token</code> — Supabase oturum bilgisi.</li>
            <li><code>arasounds-cart</code> — sepet içeriği.</li>
            <li><code>arasounds-theme</code> — açık/koyu tema tercihi.</li>
            <li><code>arasounds-cookie-consent</code> — çerez tercihiniz.</li>
        </ul>

        <h3>2.2. İşlevsellik Çerezleri</h3>
        <p>
            Tercihlerinizi (favoriler, görüntüleme ayarları) hatırlamak için
            kullanılır.
        </p>
        <ul>
            <li><code>arasounds-wishlist</code> — favori listeniz.</li>
            <li><code>arasounds-carousel</code> — ürün galeri tercihleri.</li>
        </ul>

        <h3>2.3. Analitik Çerezler (İsteğe bağlı, açık rıza)</h3>
        <p>
            Site'nin nasıl kullanıldığını anonim olarak ölçmek için kullanılabilir.
            Şu an aktif değildir; ileride eklenirse açık rızanız alınacaktır.
        </p>

        <h3>2.4. Pazarlama Çerezleri (İsteğe bağlı, açık rıza)</h3>
        <p>
            Ürün önerileri ve reklam takibi için kullanılabilir. Şu an aktif değildir;
            ileride eklenirse açık rızanız alınacaktır.
        </p>

        <h2>3. Çerez Tercihlerinizi Yönetme</h2>
        <p>
            Sayfanın altında yer alan çerez tercih merkezinden veya tarayıcınızın
            ayarlarından çerezleri her zaman silebilir, engelleyebilir veya kabul
            edebilirsiniz. Zorunlu çerezleri devre dışı bırakırsanız Site'nin bazı
            özelliklerinden faydalanamayabilirsiniz.
        </p>
        <ul>
            <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer">
                    Chrome
                </a>
            </li>
            <li>
                <a href="https://support.mozilla.org/tr/kb/cerezler-bilgi" target="_blank" rel="noreferrer">
                    Firefox
                </a>
            </li>
            <li>
                <a href="https://support.apple.com/tr-tr/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer">
                    Safari
                </a>
            </li>
            <li>
                <a href="https://support.microsoft.com/tr-tr/microsoft-edge/microsoft-edge-de-tan%C4%B1mlama-bilgilerini-silme-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noreferrer">
                    Edge
                </a>
            </li>
        </ul>

        <h2>4. Üçüncü Taraf Çerezleri</h2>
        <p>
            Site'mizde gömülü ürün görselleri (Unsplash, vb.) ve altyapı
            sağlayıcılarımız (Supabase) tarafından yerleştirilebilecek çerezler
            bulunabilir. Bu hizmet sağlayıcılarının kendi gizlilik politikaları
            geçerlidir.
        </p>

        <h2>5. Değişiklikler</h2>
        <p>
            Bu Politika ihtiyaca göre güncellenebilir; güncel sürüm her zaman bu
            sayfada yayımlanır.
        </p>
    </PolicyPage>
);

export default Cookies;
