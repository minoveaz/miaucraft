import { useTranslation } from '../../hooks/useTranslation';
import type { SupportedLocale } from '../../types/i18n';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale, isEn, isEs } = useTranslation();

  const handleToggle = (targetLocale: SupportedLocale) => {
    if (locale !== targetLocale) {
      setLocale(targetLocale);
    }
  };

  return (
    <div
      role="group"
      aria-label="Selector de idioma / Language selector"
      className={`inline-flex items-center rounded-full border border-[#cfc4bb] bg-brand-cream/60 p-0.5 text-xs font-semibold ${className}`}
    >
      <button
        type="button"
        aria-pressed={isEs}
        onClick={() => handleToggle('es')}
        className={`rounded-full px-2 py-1 transition-colors ${
          isEs
            ? 'bg-brand text-white shadow-xs'
            : 'text-brand-ink/70 hover:text-brand-ink'
        }`}
      >
        ES
      </button>
      <button
        type="button"
        aria-pressed={isEn}
        onClick={() => handleToggle('en')}
        className={`rounded-full px-2 py-1 transition-colors ${
          isEn
            ? 'bg-brand text-white shadow-xs'
            : 'text-brand-ink/70 hover:text-brand-ink'
        }`}
      >
        EN
      </button>
    </div>
  );
}
