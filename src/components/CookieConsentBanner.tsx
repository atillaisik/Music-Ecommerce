import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "arasounds-cookie-consent";

type ConsentChoice = "all" | "essential" | "rejected";

interface ConsentRecord {
    choice: ConsentChoice;
    timestamp: string;
    version: 1;
}

export const getCookieConsent = (): ConsentRecord | null => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as ConsentRecord;
        if (parsed?.version !== 1) return null;
        return parsed;
    } catch {
        return null;
    }
};

const setCookieConsent = (choice: ConsentChoice) => {
    const record: ConsentRecord = {
        choice,
        timestamp: new Date().toISOString(),
        version: 1,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    window.dispatchEvent(new CustomEvent("cookie-consent-change", { detail: record }));
};

export const CookieConsentBanner = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const existing = getCookieConsent();
        if (!existing) {
            // Show after a short delay so it doesn't block first paint LCP
            const t = setTimeout(() => setVisible(true), 600);
            return () => clearTimeout(t);
        }
    }, []);

    if (!visible) return null;

    const handle = (choice: ConsentChoice) => {
        setCookieConsent(choice);
        setVisible(false);
    };

    return (
        <div
            role="dialog"
            aria-live="polite"
            aria-label="Çerez tercihleri"
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto p-3 md:p-4"
        >
            <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card text-card-foreground shadow-2xl backdrop-blur-md">
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-5">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                            <Cookie className="h-4 w-4" />
                        </div>
                        <div className="flex-1 text-sm">
                            <p className="font-bold mb-1">Çerez tercihleriniz</p>
                            <p className="text-muted-foreground leading-relaxed">
                                Sitemizi kullanırken hizmet sunabilmemiz için zorunlu
                                çerezler kullanırız. Detaylar için{" "}
                                <Link
                                    to="/cerez-politikasi"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Çerez Politikası
                                </Link>
                                'nı inceleyebilirsiniz.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => handle("rejected")}
                            aria-label="Banner'ı kapat"
                            className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handle("essential")}
                            className="text-xs font-bold uppercase tracking-widest"
                        >
                            Yalnızca zorunlu
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => handle("all")}
                            className="text-xs font-bold uppercase tracking-widest"
                        >
                            Tümünü kabul et
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsentBanner;
