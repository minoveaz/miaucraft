import { useId } from 'react';
import type { TagStudioConfig } from '../../lib/products';
import { useTranslation } from '../../hooks/useTranslation';

const base = import.meta.env.BASE_URL;
const designImage = (file: string) => `${base}images/${encodeURI(file)}`;

export interface TagStudioValue {
  design: string;
  finish: string;
  name: string;
  font: string;
  phone: string;
}

interface TagStudioProps {
  config: TagStudioConfig;
  value: TagStudioValue;
  onChange: (value: TagStudioValue) => void;
}

export default function TagStudio({ config, value, onChange }: TagStudioProps) {
  const { t } = useTranslation();
  const instanceId = useId().replace(/:/g, '');
  const design = config.designs.find((item) => item.value === value.design) ?? config.designs[0];
  const font = config.fonts.find((item) => item.value === value.font) ?? config.fonts[0];
  const finish = config.finishes.find((item) => item.value === value.finish);
  const previewName = value.name || 'Amber';

  const update = (next: Partial<TagStudioValue>) => onChange({ ...value, ...next });

  return (
    <section aria-labelledby={`${instanceId}-title`} className="mt-6 rounded-2xl border border-[#e6dcd3] bg-white p-4 sm:p-5">
      <div>
        <h2 id={`${instanceId}-title`} className="font-display text-xl font-semibold text-brand-ink">
          {t.product.designYourTag}
        </h2>
        <p className="mt-1 text-sm text-brand-ink/70">{t.product.designYourTagSubtitle}</p>
      </div>

      <div className="mt-5 space-y-5">
        {config.designs.length > 1 ? (
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-brand-ink">{t.product.step1Design}</legend>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {config.designs.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-label={`${t.product.step1Design}: ${option.value}`}
                  aria-pressed={value.design === option.value}
                  onClick={() => update({ design: option.value })}
                  className={`overflow-hidden rounded-lg border text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    value.design === option.value
                      ? 'border-brand ring-1 ring-brand'
                      : 'border-[#e6dcd3] hover:border-brand'
                  }`}
                >
                  <img
                    src={designImage(option.image)}
                    alt=""
                    loading="lazy"
                    className="aspect-square w-full bg-brand-cream object-contain"
                  />
                  <span className="block px-2 py-1.5 text-center text-xs font-semibold text-brand-ink">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        ) : (
          <div>
            <p className="mb-2 text-sm font-semibold text-brand-ink">{t.product.step1SingleDesign}</p>
            <p className="rounded-lg border border-brand bg-brand-soft px-3 py-2 text-sm font-semibold text-brand-strong">
              {design.label}
            </p>
          </div>
        )}

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-brand-ink">{t.product.step2Color}</legend>
          <div className="flex flex-wrap gap-2">
            {config.finishes.map((option) => {
              const selected = value.finish === option.value;
              const swatch = config.finishSwatches?.[option.value] ?? '#d9d4cb';
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={!option.baseImage}
                  aria-label={`${t.product.step2Color}: ${option.label}`}
                  aria-pressed={selected}
                  onClick={() => update({ finish: option.value })}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40 ${
                    selected
                      ? 'border-brand bg-brand-soft/50 text-brand-strong ring-1 ring-brand'
                      : 'border-[#e6dcd3] bg-white text-brand-ink hover:border-brand'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 rounded-full border border-black/10 shadow-inner"
                    style={{ background: `linear-gradient(145deg, #fff 0%, ${swatch} 38%, ${swatch} 70%, #777 100%)` }}
                  />
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor={`${instanceId}-name`} className="mb-2 block text-sm font-semibold text-brand-ink">
            {t.product.step3Name}
          </label>
          <input
            id={`${instanceId}-name`}
            type="text"
            value={value.name}
            maxLength={config.maxNameLength}
            onChange={(event) => update({ name: event.target.value })}
            placeholder={t.product.namePlaceholder}
            aria-describedby={`${instanceId}-name-help`}
            className="h-11 w-full rounded-lg border border-[#cfc4bb] bg-white px-3 text-sm text-brand-ink outline-none placeholder:text-[#6b6b6b] focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <p id={`${instanceId}-name-help`} className="mt-1.5 flex justify-between gap-2 text-xs text-brand-ink/70">
            <span>{t.product.nameRequiredHelp}</span>
            <span className="shrink-0">
              {value.name.length}{config.maxNameLength ? ` / ${config.maxNameLength}` : ''}
            </span>
          </p>
        </div>

        {config.phoneEnabled && (
          <div>
            <label htmlFor={`${instanceId}-phone`} className="mb-2 block text-sm font-semibold text-brand-ink">
              {t.product.step4Phone}
            </label>
            <input
              id={`${instanceId}-phone`}
              type="tel"
              value={value.phone}
              maxLength={config.phoneMaxLength}
              onChange={(event) => update({ phone: event.target.value })}
              placeholder={t.product.phonePlaceholder}
              className="h-11 w-full rounded-lg border border-[#cfc4bb] bg-white px-3 text-sm text-brand-ink outline-none placeholder:text-[#6b6b6b] focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
        )}

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-brand-ink">{t.product.step5Font}</legend>
          <div className="flex items-center gap-3">
            <select
              id={`${instanceId}-font`}
              value={value.font}
              onChange={(event) => update({ font: event.target.value })}
              className="h-11 min-w-0 flex-1 rounded-lg border border-[#cfc4bb] bg-white px-3 text-sm text-brand-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              {config.fonts.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <span
              aria-label={`Muestra de ${font.label}`}
              className="max-w-28 truncate text-lg text-brand-ink"
              style={{
                fontFamily: font.previewFontFamily,
                fontWeight: font.previewFontWeight ?? 'normal',
                fontStyle: font.previewFontStyle ?? 'normal',
              }}
            >
              {previewName}
            </span>
          </div>
          <p className="mt-2 text-xs text-brand-ink/70">
            {t.product.fontHelp}
          </p>
        </fieldset>

        <div className="rounded-lg bg-brand-cream px-3 py-3 text-sm">
          <p className="font-semibold text-brand-ink">{t.product.yourDesign}</p>
          <p className="mt-1 text-brand-ink/80">
            {design.label} · {finish?.label ?? t.product.chooseAColor} · {value.name.trim() || t.product.addAName} · {font.label}
          </p>
        </div>
      </div>
    </section>
  );
}
