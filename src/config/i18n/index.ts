import type { I18nDictionary, LocaleConfig, SupportedLocale } from '../../types/i18n';
import esDict from './es.json';
import enDict from './en.json';

export const dictionaries: Record<SupportedLocale, I18nDictionary> = {
  es: esDict as I18nDictionary,
  en: enDict as I18nDictionary,
};

export const localeConfigs: Record<SupportedLocale, LocaleConfig> = {
  es: {
    locale: 'es',
    currency: 'USD',
    currencySymbol: '$',
    name: 'Español',
    flag: 'ES',
  },
  en: {
    locale: 'en',
    currency: 'USD',
    currencySymbol: '$',
    name: 'English',
    flag: 'EN',
  },
};

export const DEFAULT_LOCALE: SupportedLocale = 'es';
