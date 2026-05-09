import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import tr from "./locales/tr.json";
import en from "./locales/en.json";

export const SUPPORTED_LANGUAGES = ["tr", "en"] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = "tr";
const STORAGE_KEY = "arasounds-language";

// Initialise once. SSR-safe (no `window` access at top level).
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            tr: { translation: tr },
            en: { translation: en },
        },
        fallbackLng: "tr",
        supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
        interpolation: {
            // React already escapes by default
            escapeValue: false,
        },
        detection: {
            order: ["localStorage", "navigator"],
            lookupLocalStorage: STORAGE_KEY,
            caches: ["localStorage"],
        },
        react: {
            useSuspense: false,
        },
    });

// Keep <html lang> in sync with the active language so screen readers
// and search engines see the right value.
const syncHtmlLang = (lng: string) => {
    if (typeof document !== "undefined") {
        document.documentElement.lang = lng.split("-")[0] || DEFAULT_LANGUAGE;
    }
};

syncHtmlLang(i18n.resolvedLanguage ?? DEFAULT_LANGUAGE);
i18n.on("languageChanged", syncHtmlLang);

export default i18n;
