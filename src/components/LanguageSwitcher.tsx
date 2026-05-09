import { useTranslation } from "react-i18next";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/i18n";

const FlagTR = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
        <rect width="30" height="20" fill="#e30a17" />
        <circle cx="11.5" cy="10" r="4.5" fill="#fff" />
        <circle cx="12.5" cy="10" r="3.5" fill="#e30a17" />
        <polygon
            points="16.5,10 18.6,10.7 17.3,8.9 17.3,11.1 18.6,9.3"
            fill="#fff"
        />
    </svg>
);

const FlagEN = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 60 30" className={className} aria-hidden="true">
        <clipPath id="t">
            <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path
            d="M0,0 L60,30 M60,0 L0,30"
            stroke="#fff"
            strokeWidth="6"
        />
        <path
            d="M0,0 L60,30 M60,0 L0,30"
            clipPath="url(#t)"
            stroke="#C8102E"
            strokeWidth="4"
        />
        <path
            d="M30,0 v30 M0,15 h60"
            stroke="#fff"
            strokeWidth="10"
        />
        <path
            d="M30,0 v30 M0,15 h60"
            stroke="#C8102E"
            strokeWidth="6"
        />
    </svg>
);

const FLAGS: Record<SupportedLanguage, { Component: typeof FlagTR; labelKey: string }> = {
    tr: { Component: FlagTR, labelKey: "language_switcher.tr" },
    en: { Component: FlagEN, labelKey: "language_switcher.en" },
};

interface LanguageSwitcherProps {
    /** Visual size — `sm` for nav (default), `md` for footer/wider surfaces. */
    size?: "sm" | "md";
}

export const LanguageSwitcher = ({ size = "sm" }: LanguageSwitcherProps) => {
    const { i18n, t } = useTranslation();
    const current = (SUPPORTED_LANGUAGES as readonly string[]).includes(
        i18n.resolvedLanguage ?? "",
    )
        ? (i18n.resolvedLanguage as SupportedLanguage)
        : "tr";
    const Current = FLAGS[current];

    const dimensions = size === "sm" ? "h-7 w-9" : "h-8 w-11";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label={t("language_switcher.label")}
                className={`${dimensions} overflow-hidden rounded-md border border-border/60 transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}
            >
                <Current.Component className="h-full w-full" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
                {(SUPPORTED_LANGUAGES as readonly SupportedLanguage[]).map((lang) => {
                    const F = FLAGS[lang];
                    const isActive = lang === current;
                    return (
                        <DropdownMenuItem
                            key={lang}
                            onClick={() => i18n.changeLanguage(lang)}
                            className="cursor-pointer flex items-center gap-3 py-2"
                        >
                            <F.Component className="h-5 w-7 rounded-sm border border-border/40" />
                            <span className="text-sm font-medium flex-1">{t(F.labelKey)}</span>
                            {isActive && <Check className="h-4 w-4 text-primary" />}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSwitcher;
