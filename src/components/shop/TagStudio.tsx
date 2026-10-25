import { useId } from 'react';
import { ShieldCheck, RotateCcw } from 'lucide-react';
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
  contactLine2?: string;
  showNameOnBack?: boolean;
}

interface TagStudioProps {
  config: TagStudioConfig;
  value: TagStudioValue;
  onChange: (value: TagStudioValue) => void;
  activeSide?: 'front' | 'back';
  onSideChange?: (side: 'front' | 'back') => void;
}

export default function TagStudio({ config, value, onChange, activeSide = 'front', onSideChange }: TagStudioProps) {
  const { t, isEn } = useTranslation();
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
            <div className="mb-2 flex items-center justify-between">
              <legend className="text-sm font-semibold text-brand-ink">
                {t.product.step1Design}
              </legend>
              <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand-strong">
                {design.label}
              </span>
            </div>
            <div className="max-h-[220px] overflow-y-auto rounded-xl border border-[#e6dcd3] bg-[#faf7f2]/50 p-2 pr-1.5">
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
                {config.designs.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-label={`${t.product.step1Design}: ${option.value}`}
                    aria-pressed={value.design === option.value}
                    onClick={() => update({ design: option.value })}
                    className={`group relative flex flex-col items-center rounded-lg border p-1 text-center transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand ${
                      value.design === option.value
                        ? 'border-brand bg-white shadow-xs ring-1 ring-brand'
                        : 'border-transparent bg-white/70 hover:border-brand/40 hover:bg-white'
                    }`}
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded bg-brand-cream/60 p-0.5">
                      <img
                        src={designImage(option.image)}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform group-hover:scale-105"
                      />
                    </div>
                    <span
                      className={`mt-1 block truncate text-[10px] font-semibold ${
                        value.design === option.value ? 'text-brand-strong' : 'text-brand-ink/80'
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
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
            onFocus={() => onSideChange?.('front')}
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor={`${instanceId}-phone`} className="block text-sm font-semibold text-brand-ink">
                {t.product.step4Phone}
              </label>
              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-semibold text-brand-strong">
                {isEn ? 'Back side' : 'Reverso'}
              </span>
            </div>

            {/* Si el diseño muestra el nombre adelante, permitir elegir si se graba también en el reverso */}
            {design.nameSide === 'front' && (
              <label className="flex items-start gap-2.5 rounded-lg border border-[#e6dcd3] bg-[#faf7f2]/80 p-2.5 text-xs text-brand-ink cursor-pointer hover:bg-[#faf7f2] transition-colors">
                <input
                  type="checkbox"
                  checked={Boolean(value.showNameOnBack)}
                  onChange={(event) => {
                    update({ showNameOnBack: event.target.checked });
                    onSideChange?.('back');
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-[#cfc4bb] text-brand focus:ring-brand accent-brand cursor-pointer"
                />
                <div className="flex-1 leading-snug">
                  <span className="font-semibold text-brand-ink">{t.product.showNameOnBackLabel}</span>
                  <p className="mt-0.5 text-[11px] text-brand-ink/70">
                    {isEn
                      ? 'Off by default: leaves 100% of the back safe zone for emergency contact and address.'
                      : 'Por defecto desactivado: deja el 100% de la zona segura trasera para teléfono y dirección.'}
                  </p>
                </div>
              </label>
            )}

            <div className="space-y-2">
              <div>
                <input
                  id={`${instanceId}-phone`}
                  type="text"
                  value={value.phone}
                  maxLength={36}
                  onChange={(event) => update({ phone: event.target.value })}
                  onFocus={() => onSideChange?.('back')}
                  placeholder={t.product.contactLine1Placeholder}
                  aria-describedby={`${instanceId}-phone-help`}
                  className="h-10 w-full rounded-lg border border-[#cfc4bb] bg-white px-3 text-sm text-brand-ink outline-none placeholder:text-[#6b6b6b] focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div>
                <input
                  id={`${instanceId}-contact2`}
                  type="text"
                  value={value.contactLine2 ?? ''}
                  maxLength={40}
                  onChange={(event) => update({ contactLine2: event.target.value })}
                  onFocus={() => onSideChange?.('back')}
                  placeholder={t.product.contactLine2Placeholder}
                  className="h-10 w-full rounded-lg border border-[#cfc4bb] bg-white px-3 text-sm text-brand-ink outline-none placeholder:text-[#6b6b6b] focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>

            <div className="flex items-start justify-between gap-2 rounded-lg bg-brand-cream/80 p-2.5 text-xs text-brand-ink/80 border border-[#e6dcd3]">
              <div className="flex items-start gap-1.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-brand mt-0.5" strokeWidth={2} />
                <p className="text-[11px] leading-relaxed text-brand-ink/80">
                  {t.product.safeZoneNote}
                </p>
              </div>
              {onSideChange && (
                <button
                  type="button"
                  onClick={() => onSideChange(activeSide === 'back' ? 'front' : 'back')}
                  className="shrink-0 flex items-center gap-1 font-semibold text-brand hover:text-brand-strong underline text-[11px] whitespace-nowrap pt-0.5"
                >
                  <RotateCcw className="h-3 w-3" />
                  {activeSide === 'back' ? t.product.viewFrontSide : t.product.viewBackSide}
                </button>
              )}
            </div>
          </div>
        )}

        <fieldset>
          <div className="mb-2 flex items-center justify-between">
            <legend className="text-sm font-semibold text-brand-ink">
              {t.product.step5Font}
            </legend>
            <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand-strong">
              {font.label}
            </span>
          </div>

          <div className="max-h-[210px] overflow-y-auto rounded-xl border border-[#e6dcd3] bg-[#faf7f2]/50 p-2 pr-1.5">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {config.fonts.map((option) => {
                const isSelected = value.font === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-label={`${option.label}: ${previewName}`}
                    aria-pressed={isSelected}
                    onClick={() => update({ font: option.value })}
                    className={`group relative flex flex-col items-center justify-center rounded-xl border px-3 py-2.5 text-center transition-all ${
                      isSelected
                        ? 'border-brand bg-white shadow-xs ring-1.5 ring-brand'
                        : 'border-[#e6dcd3] bg-white/80 hover:border-brand/40 hover:bg-white'
                    }`}
                  >
                    <span
                      className="block w-full truncate text-base leading-tight text-brand-ink sm:text-lg"
                      style={{
                        fontFamily: option.previewFontFamily,
                        fontWeight: option.previewFontWeight ?? 'normal',
                        fontStyle: option.previewFontStyle ?? 'normal',
                      }}
                    >
                      {previewName}
                    </span>
                    <span
                      className={`mt-1 block text-[10px] font-semibold uppercase tracking-wider ${
                        isSelected ? 'font-bold text-brand-strong' : 'text-brand-ink/60'
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
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
