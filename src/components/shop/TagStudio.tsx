import { useId, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Eye, Phone, Sparkles } from 'lucide-react';
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
  onSideChange?: (side: 'front' | 'back') => void;
}

export default function TagStudio({ config, value, onChange, onSideChange }: TagStudioProps) {
  const { t, isEn } = useTranslation();
  const instanceId = useId().replace(/:/g, '');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showAllDesigns, setShowAllDesigns] = useState(false);

  const design = config.designs.find((item) => item.value === value.design) ?? config.designs[0];
  const font = config.fonts.find((item) => item.value === value.font) ?? config.fonts[0];
  const finish = config.finishes.find((item) => item.value === value.finish) ?? config.finishes[0];
  const previewName = value.name || 'Amber';

  const update = (next: Partial<TagStudioValue>) => onChange({ ...value, ...next });

  const scrollRibbon = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // 4 curated popular fonts for fast 1-click preview
  const popularFonts = config.fonts.filter((f) => ['FT12', 'FT15', 'FT17', 'FT26'].includes(f.value));

  return (
    <section aria-labelledby={`${instanceId}-title`} className="space-y-6">
      {/* 1. SELECCIÓN DE ACABADO METÁLICO (LUXURY FINISHES) */}
      <div className="rounded-2xl border border-[#e6dcd3] bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <legend className="text-sm font-bold uppercase tracking-wider text-brand-ink">
            {t.product.step2Color}
          </legend>
          <span className="text-xs font-semibold text-brand-strong">
            {finish?.label}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2.5 sm:gap-3">
          {config.finishes.map((option) => {
            const selected = value.finish === option.value;
            const swatch = config.finishSwatches?.[option.value] ?? '#d9d4cb';
            const gradientStyle = option.value.toLowerCase().includes('rose')
              ? 'linear-gradient(135deg, #FFE4E1 0%, #E8A598 50%, #C98D8A 100%)'
              : option.value.toLowerCase().includes('gold')
              ? 'linear-gradient(135deg, #FFF3D6 0%, #E6C27C 50%, #B89243 100%)'
              : 'linear-gradient(135deg, #FFFFFF 0%, #D8DCE2 50%, #9DA3AC 100%)';

            return (
              <button
                key={option.value}
                type="button"
                disabled={!option.baseImage}
                aria-label={`${t.product.step2Color}: ${option.label}`}
                aria-pressed={selected}
                onClick={() => update({ finish: option.value })}
                className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all ${
                  selected
                    ? 'border-brand bg-brand-soft/30 shadow-xs'
                    : 'border-[#e6dcd3] bg-white hover:border-brand/40 hover:bg-[#FAF7F2]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-black/15 shadow-sm transition-transform group-hover:scale-105`}
                  style={{ background: gradientStyle }}
                >
                  {selected && (
                    <Check className="h-4 w-4 text-brand-ink drop-shadow-xs" strokeWidth={2.5} />
                  )}
                </span>
                <span className={`text-xs font-bold leading-tight ${selected ? 'text-brand-strong' : 'text-brand-ink'}`}>
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SELECCIÓN DE SILUETA / TROQUEL (COMPACT SCROLL RIBBON) */}
      <div className="rounded-2xl border border-[#e6dcd3] bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <legend className="text-sm font-bold uppercase tracking-wider text-brand-ink">
            {t.product.step1Design}
          </legend>
          <button
            type="button"
            onClick={() => setShowAllDesigns((prev) => !prev)}
            className="text-xs font-semibold text-brand hover:text-brand-strong transition-colors"
          >
            {showAllDesigns ? t.product.collapseShapes : `${t.product.allShapes} (${config.designs.length})`}
          </button>
        </div>

        {showAllDesigns ? (
          /* Cuadrícula completa expandida */
          <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-72 overflow-y-auto pr-1">
            {config.designs.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={value.design === option.value}
                onClick={() => update({ design: option.value })}
                className={`flex flex-col items-center rounded-xl border p-1.5 text-center transition-all ${
                  value.design === option.value
                    ? 'border-brand bg-brand-soft/40 ring-2 ring-brand/30'
                    : 'border-[#e6dcd3] bg-white hover:border-brand'
                }`}
              >
                <img
                  src={designImage(option.image)}
                  alt=""
                  loading="lazy"
                  className="aspect-square w-full rounded-lg bg-brand-cream/80 object-contain p-1"
                />
                <span className="mt-1 block text-[11px] font-bold text-brand-ink">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        ) : (
          /* Ribbon carrusel horizontal compacto */
          <div className="relative mt-3">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => scrollRibbon('left')}
              className="absolute -left-2.5 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#cfc4bb] bg-white shadow-md text-brand-ink hover:bg-brand-cream transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div
              ref={scrollRef}
              className="flex gap-2.5 overflow-x-auto py-1 px-1 scrollbar-none scroll-smooth"
            >
              {config.designs.map((option) => {
                const selected = value.design === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update({ design: option.value })}
                    className={`flex-none w-20 sm:w-22 flex flex-col items-center rounded-xl border-2 p-1.5 text-center transition-all ${
                      selected
                        ? 'border-brand bg-brand-soft/30 shadow-xs'
                        : 'border-[#e6dcd3] bg-white hover:border-brand/40'
                    }`}
                  >
                    <img
                      src={designImage(option.image)}
                      alt=""
                      loading="lazy"
                      className="aspect-square w-full rounded-lg bg-brand-cream/80 object-contain p-1"
                    />
                    <span className={`mt-1 block text-[11px] font-bold ${selected ? 'text-brand-strong' : 'text-brand-ink'}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => scrollRibbon('right')}
              className="absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#cfc4bb] bg-white shadow-md text-brand-ink hover:bg-brand-cream transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* 3. PERSONALIZACIÓN DEL GRABADO FRONTAL (NAME & FONT) */}
      <div className="rounded-2xl border border-[#e6dcd3] bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <label htmlFor={`${instanceId}-name`} className="text-sm font-bold uppercase tracking-wider text-brand-ink">
            {t.product.step3Name}
          </label>
          <span className="text-xs font-semibold text-brand-ink/60">
            {value.name.length}{config.maxNameLength ? ` / ${config.maxNameLength}` : ''}
          </span>
        </div>

        <div className="relative mt-2">
          <input
            id={`${instanceId}-name`}
            type="text"
            value={value.name}
            maxLength={config.maxNameLength}
            onFocus={() => onSideChange?.('front')}
            onChange={(event) => update({ name: event.target.value })}
            placeholder={t.product.namePlaceholder}
            className="h-12 w-full rounded-xl border border-[#cfc4bb] bg-white px-4 text-base font-medium text-brand-ink outline-none placeholder:text-[#8a8a8a] focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
          />
        </div>
        <p className="mt-1.5 text-xs text-brand-ink/70">
          {t.product.nameRequiredHelp}
        </p>

        {/* Tipografía interactiva */}
        <div className="mt-5 border-t border-[#f0eae4] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-ink">
              {t.product.step5Font}
            </span>
            <span className="text-xs text-brand-strong font-semibold">
              {font.label}
            </span>
          </div>

          {/* Muestrario rápido de fuentes populares */}
          <div className="mt-2.5 grid grid-cols-4 gap-2">
            {popularFonts.map((item) => {
              const selected = value.font === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => update({ font: item.value })}
                  className={`flex flex-col items-center justify-center rounded-lg border px-2 py-2 text-center transition-all ${
                    selected
                      ? 'border-brand bg-brand-soft/40 text-brand-strong font-bold ring-1 ring-brand'
                      : 'border-[#e6dcd3] bg-white text-brand-ink hover:border-brand'
                  }`}
                >
                  <span
                    className="truncate text-base"
                    style={{
                      fontFamily: item.previewFontFamily,
                      fontWeight: item.previewFontWeight ?? 'normal',
                      fontStyle: item.previewFontStyle ?? 'normal',
                    }}
                  >
                    {previewName}
                  </span>
                  <span className="mt-0.5 text-[10px] text-brand-ink/60">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Selector completo de las 17 tipografías */}
          <div className="mt-3 flex items-center gap-3">
            <select
              id={`${instanceId}-font`}
              value={value.font}
              onChange={(event) => update({ font: event.target.value })}
              className="h-10 min-w-0 flex-1 rounded-lg border border-[#cfc4bb] bg-white px-3 text-xs font-medium text-brand-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              {config.fonts.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.previewFontFamily.replace(/["',]/g, '').split(' ')[0]})
                </option>
              ))}
            </select>
            <span
              className="shrink-0 rounded-lg bg-brand-cream px-3 py-1.5 text-sm font-semibold text-brand-ink"
              style={{
                fontFamily: font.previewFontFamily,
                fontWeight: font.previewFontWeight ?? 'normal',
                fontStyle: font.previewFontStyle ?? 'normal',
              }}
            >
              {previewName}
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-brand-ink/60">
            {t.product.fontHelp}
          </p>
        </div>
      </div>

      {/* 4. GRABADO TRASERO (EMERGENCY PHONE & DETAILS) */}
      {config.phoneEnabled && (
        <div className="rounded-2xl border border-[#e6dcd3] bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <label htmlFor={`${instanceId}-phone`} className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-brand-ink">
              <Phone className="h-4 w-4 text-brand" />
              {t.product.step4Phone}
            </label>
            <button
              type="button"
              onClick={() => onSideChange?.('back')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-strong transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              {t.product.viewBack}
            </button>
          </div>
          <div className="mt-2">
            <input
              id={`${instanceId}-phone`}
              type="tel"
              value={value.phone}
              maxLength={config.phoneMaxLength}
              onFocus={() => onSideChange?.('back')}
              onChange={(event) => update({ phone: event.target.value })}
              placeholder={t.product.phonePlaceholder}
              className="h-12 w-full rounded-xl border border-[#cfc4bb] bg-white px-4 text-base font-medium text-brand-ink outline-none placeholder:text-[#8a8a8a] focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
            />
          </div>
          <p className="mt-1.5 text-xs text-brand-ink/70">
            {t.product.backPhoneHelp}
          </p>
        </div>
      )}

      {/* 5. RESUMEN EN VIVO DE CONFIGURACIÓN */}
      <div className="flex items-center justify-between rounded-xl border border-brand/20 bg-brand-soft/40 px-4 py-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand shrink-0" />
          <span className="font-semibold text-brand-ink">
            {design.label} · {finish?.label} · {value.name.trim() || t.product.addAName} · {font.label}
          </span>
        </div>
        {value.phone.trim() && (
          <span className="hidden sm:inline font-mono text-xs text-brand-strong">
            {value.phone.trim()}
          </span>
        )}
      </div>
    </section>
  );
}
