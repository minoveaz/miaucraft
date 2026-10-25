import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { I18nDictionary, LocaleConfig, SupportedLocale } from '../types/i18n';
import { DEFAULT_LOCALE, dictionaries, localeConfigs } from '../config/i18n';

interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: I18nDictionary;
  config: LocaleConfig;
  formatPrice: (amount: number) => string;
  isEn: boolean;
  isEs: boolean;
}

const LOCALE_STORAGE_KEY = 'miaucraft-locale';

const LocaleContext = createContext<LocaleContextValue | null>(null);

function detectBrowserLocale(): SupportedLocale {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY) as SupportedLocale | null;
    if (stored && (stored === 'es' || stored === 'en')) {
      return stored;
    }
    const navLang = window.navigator.language?.toLowerCase() ?? '';
    if (navLang.startsWith('en')) return 'en';
    return DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(detectBrowserLocale);

  const setLocale = (nextLocale: SupportedLocale) => {
    setLocaleState(nextLocale);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      document.documentElement.lang = nextLocale;
    } catch {
      // ignore in environments without localStorage
    }
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => {
    const config = localeConfigs[locale] ?? localeConfigs[DEFAULT_LOCALE];
    const dict = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];

    const formatPrice = (amount: number) => {
      return new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-US', {
        style: 'currency',
        currency: config.currency,
      }).format(amount);
    };

    return {
      locale,
      setLocale,
      t: dict,
      config,
      formatPrice,
      isEn: locale === 'en',
      isEs: locale === 'es',
    };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useTranslation(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useTranslation debe usarse dentro de LocaleProvider');
  }
  return context;
}
