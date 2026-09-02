"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import id from "./id.json";
import en from "./en.json";

type Locale = "id" | "en";
type Translations = typeof id;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Translations> = { id, en };

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("id");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale;
    if (saved && (saved === "id" || saved === "en")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".");
      let result: any = translations[locale];
      for (const k of keys) {
        result = result?.[k];
      }
      return result || key;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context)
    throw new Error("useTranslation must be used within I18nProvider");
  return context;
}
