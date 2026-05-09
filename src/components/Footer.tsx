import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { useStoreSettings } from "@/lib/storeSettingsAPI";

const Footer = () => {
    const { t } = useTranslation();
    const { data: settings } = useStoreSettings();
    const supportEmail = settings?.supportEmail;
    const supportPhone = settings?.supportPhone;
    const address = settings?.address;
    const storeName = settings?.storeName ?? "ARASOUNDS";

    const quickLinks = [
        { label: t("footer.links.shop"), path: "/shop" },
        { label: t("footer.links.instruments"), path: "/instruments" },
        { label: t("footer.links.brands"), path: "/brands" },
        { label: t("footer.links.deals"), path: "/deals" },
    ];

    const supportLinks = [
        { label: t("footer.links.contact"), path: "/contact" },
        { label: t("footer.links.faqs"), path: "/faqs" },
        { label: t("footer.links.shipping"), path: "/teslimat-politikasi" },
        { label: t("footer.links.returns"), path: "/iade-politikasi" },
    ];

    const legalLinks = [
        { label: t("footer.links.terms"), path: "/kullanim-kosullari" },
        { label: t("footer.links.privacy"), path: "/gizlilik-politikasi" },
        { label: t("footer.links.cookies"), path: "/cerez-politikasi" },
        { label: t("footer.links.distance_sales"), path: "/mesafeli-satis-sozlesmesi" },
        { label: t("footer.links.imprint"), path: "/kunye" },
    ];

    return (
        <footer className="border-t border-border bg-card">
            <div className="container py-12">
                <div className="grid gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <Logo className="h-8 w-auto text-black dark:text-white transition-colors duration-300" />
                        <p className="mt-3 text-sm text-muted-foreground">
                            {t("footer.tagline")}
                        </p>
                        <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                            {supportEmail && (
                                <li className="flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5" />
                                    <a
                                        href={`mailto:${supportEmail}`}
                                        className="hover:text-foreground"
                                    >
                                        {supportEmail}
                                    </a>
                                </li>
                            )}
                            {supportPhone && (
                                <li className="flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5" />
                                    <a
                                        href={`tel:${supportPhone.replace(/\s/g, "")}`}
                                        className="hover:text-foreground"
                                    >
                                        {supportPhone}
                                    </a>
                                </li>
                            )}
                            {address && (
                                <li className="flex items-start gap-2">
                                    <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                    <span>{address}</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider">
                            {t("footer.quick_links")}
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {quickLinks.map((l) => (
                                <li key={l.path}>
                                    <Link
                                        to={l.path}
                                        className="transition-colors hover:text-foreground"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider">
                            {t("footer.support")}
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {supportLinks.map((l) => (
                                <li key={l.path}>
                                    <Link
                                        to={l.path}
                                        className="transition-colors hover:text-foreground"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider">
                            {t("footer.newsletter")}
                        </h4>
                        <p className="mb-3 text-sm text-muted-foreground">
                            {t("footer.newsletter_text")}
                        </p>
                        <div className="flex gap-2">
                            <Input
                                placeholder={t("footer.newsletter_placeholder")}
                                className="bg-secondary"
                            />
                            <Button size="sm">{t("footer.newsletter_button")}</Button>
                        </div>
                    </div>
                </div>

                {/* Legal links row */}
                <div className="mt-10 border-t border-border pt-6">
                    <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                        {legalLinks.map((l) => (
                            <li key={l.path}>
                                <Link
                                    to={l.path}
                                    className="transition-colors hover:text-foreground"
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-6 flex flex-col items-center gap-1 text-center text-xs text-muted-foreground">
                    {settings?.mersisNo && (
                        <span>
                            {t("footer.mersis_label")}: {settings.mersisNo}
                            {settings.taxOffice && <> · {t("footer.tax_office_label")}: {settings.taxOffice}</>}
                            {settings.tradeRegistryNo && <> · {t("footer.trade_registry_label")}: {settings.tradeRegistryNo}</>}
                        </span>
                    )}
                    <span>
                        © {new Date().getFullYear()} {storeName}. {t("footer.rights_reserved")}
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
