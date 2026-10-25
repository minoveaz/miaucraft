import { useState, useEffect, useId } from 'react';
import {
  ShieldCheck,
  RotateCcw,
  Plus,
  Trash2,
  Type,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import type { TagStudioConfig } from '../../lib/products';
import { useTranslation } from '../../hooks/useTranslation';

const base = import.meta.env.BASE_URL;
const designImage = (file: string) => `${base}images/${encodeURI(file)}`;

export type TagZone = 'top' | 'center' | 'bottom';
export type TagSide = 'front' | 'back';

export interface TagEngravingItem {
  id: string;
  side: TagSide;
  zone: TagZone;
  text: string;
  font: string;
  scale?: number; // relative size: 0.75 to 1.35 (default 1.0)
  yOffset?: number; // vertical nudge: -0.05 to +0.05 (default 0)
  xOffset?: number; // horizontal nudge: -0.07 to +0.07 (default 0)
  uppercase?: boolean; // uppercase transform
}

export interface TagStudioValue {
  design: string;
  finish: string;
  name: string;
  font: string;
  phone: string;
  contactLine2?: string;
  showNameOnBack?: boolean;
  engravings?: TagEngravingItem[];
}

export function getInitialEngravings(
  value: TagStudioValue,
  design: { nameSide: 'front' | 'back' },
  defaultFont = 'FT12',
): TagEngravingItem[] {
  if (value.engravings && value.engravings.length > 0) {
    return value.engravings;
  }
  const items: TagEngravingItem[] = [];
  const name = value.name?.trim() || '';
  const phone = value.phone?.trim() || '';
  const contact2 = value.contactLine2?.trim() || '';
  const mainFont = value.font || defaultFont;

  if (design.nameSide === 'front') {
    items.push({
      id: 'front-center',
      side: 'front',
      zone: 'center',
      text: name || 'Amber',
      font: mainFont,
      scale: 1.0,
      yOffset: 0,
      xOffset: 0,
      uppercase: false,
    });
    if (phone) {
      items.push({
        id: 'back-center',
        side: 'back',
        zone: 'center',
        text: phone,
        font: 'FT18',
        scale: 1.0,
        yOffset: 0,
        xOffset: 0,
        uppercase: false,
      });
    }
    if (contact2) {
      items.push({
        id: 'back-bottom',
        side: 'back',
        zone: 'bottom',
        text: contact2,
        font: 'FT18',
        scale: 1.0,
        yOffset: 0,
        xOffset: 0,
        uppercase: false,
      });
    }
  } else {
    items.push({
      id: 'back-top',
      side: 'back',
      zone: 'top',
      text: name || 'Amber',
      font: mainFont,
      scale: 1.0,
      yOffset: 0,
      xOffset: 0,
      uppercase: false,
    });
    if (phone) {
      items.push({
        id: 'back-center',
        side: 'back',
        zone: 'center',
        text: phone,
        font: 'FT18',
        scale: 1.0,
        yOffset: 0,
        xOffset: 0,
        uppercase: false,
      });
    }
    if (contact2) {
      items.push({
        id: 'back-bottom',
        side: 'back',
        zone: 'bottom',
        text: contact2,
        font: 'FT18',
        scale: 1.0,
        yOffset: 0,
        xOffset: 0,
        uppercase: false,
      });
    }
  }
  return items;
}

function ZoneMiniIcon({ zone, active }: { zone: TagZone; active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0" aria-hidden="true">
      <rect
        x="2"
        y="2"
        width="16"
        height="16"
        rx="3.5"
        fill={active ? '#fff' : '#faf7f2'}
        stroke={active ? '#C81E63' : '#cfc4bb'}
        strokeWidth={active ? 1.5 : 1}
      />
      <rect
        x="4.5"
        y="4"
        width="11"
        height="3"
        rx="1"
        fill={zone === 'top' ? '#E52C77' : active ? '#f4d5de' : '#e6dcd3'}
      />
      <rect
        x="4.5"
        y="8.5"
        width="11"
        height="3"
        rx="1"
        fill={zone === 'center' ? '#E52C77' : active ? '#f4d5de' : '#e6dcd3'}
      />
      <rect
        x="4.5"
        y="13"
        width="11"
        height="3"
        rx="1"
        fill={zone === 'bottom' ? '#E52C77' : active ? '#f4d5de' : '#e6dcd3'}
      />
    </svg>
  );
}

interface TagStudioProps {
  config: TagStudioConfig;
  value: TagStudioValue;
  onChange: (value: TagStudioValue) => void;
  activeSide?: 'front' | 'back';
  onSideChange?: (side: 'front' | 'back') => void;
}

export default function TagStudio({
  config,
  value,
  onChange,
  activeSide = 'front',
  onSideChange,
}: TagStudioProps) {
  const { t, isEn } = useTranslation();
  const instanceId = useId().replace(/:/g, '');
  const design = config.designs.find((item) => item.value === value.design) ?? config.designs[0];
  const finish = config.finishes.find((item) => item.value === value.finish);
  const isFrontDesign = design.nameSide === 'front';

  const [selectedFace, setSelectedFace] = useState<TagSide>(activeSide);
  const [openFontPickerId, setOpenFontPickerId] = useState<string | null>(null);

  useEffect(() => {
    if (activeSide) setSelectedFace(activeSide);
  }, [activeSide]);

  const update = (next: Partial<TagStudioValue>) => onChange({ ...value, ...next });

  const currentEngravings =
    value.engravings && value.engravings.length > 0
      ? value.engravings
      : getInitialEngravings(value, design, config.defaultFont || 'FT12');

  const updateEngravings = (nextEngravings: TagEngravingItem[]) => {
    const mainItem =
      nextEngravings.find((e) => e.side === 'front' && e.zone === 'center' && e.text.trim()) ??
      nextEngravings.find((e) => e.side === 'back' && e.zone === 'top' && e.text.trim()) ??
      nextEngravings.find((e) => e.side === 'back' && e.zone === 'center' && e.text.trim()) ??
      nextEngravings.find((e) => e.text.trim());

    const phoneItem =
      nextEngravings.find((e) => e.side === 'back' && e.zone === 'center' && e.text.trim()) ??
      nextEngravings.find((e) => e.side === 'back' && e.zone === 'bottom' && e.text.trim());

    onChange({
      ...value,
      name: mainItem ? mainItem.text : '',
      font: mainItem ? mainItem.font : value.font || config.defaultFont || 'FT12',
      phone: phoneItem && phoneItem !== mainItem ? phoneItem.text : value.phone,
      engravings: nextEngravings,
    });
  };

  const handleFaceChange = (face: TagSide) => {
    setSelectedFace(face);
    onSideChange?.(face);
  };

  const addZone = (side: TagSide, zone: TagZone) => {
    const existing = currentEngravings.find((e) => e.side === side && e.zone === zone);
    if (existing) return;
    const defaultZoneFont =
      zone === 'center' && side === 'front'
        ? value.font || config.defaultFont || 'FT12'
        : 'FT18';
    const newItem: TagEngravingItem = {
      id: `${side}-${zone}-${Date.now()}`,
      side,
      zone,
      text: '',
      font: defaultZoneFont,
      scale: 1.0,
      yOffset: 0,
      xOffset: 0,
      uppercase: false,
    };
    updateEngravings([...currentEngravings, newItem]);
    onSideChange?.(side);
  };

  const removeZone = (id: string) => {
    updateEngravings(currentEngravings.filter((e) => e.id !== id));
    if (openFontPickerId === id) setOpenFontPickerId(null);
  };

  const updateZoneText = (id: string, text: string) => {
    updateEngravings(currentEngravings.map((e) => (e.id === id ? { ...e, text } : e)));
  };

  const updateZoneFont = (id: string, font: string) => {
    updateEngravings(currentEngravings.map((e) => (e.id === id ? { ...e, font } : e)));
  };

  // Fine-tuning position & formatting controls
  const adjustSize = (id: string, delta: number) => {
    updateEngravings(
      currentEngravings.map((e) => {
        if (e.id !== id) return e;
        const current = e.scale ?? 1.0;
        const next = Math.max(0.75, Math.min(1.35, Math.round((current + delta) * 10) / 10));
        return { ...e, scale: next };
      }),
    );
  };

  const adjustY = (id: string, delta: number) => {
    updateEngravings(
      currentEngravings.map((e) => {
        if (e.id !== id) return e;
        const current = e.yOffset ?? 0;
        const next = Math.max(-0.05, Math.min(0.05, Math.round((current + delta) * 1000) / 1000));
        return { ...e, yOffset: next };
      }),
    );
  };

  const adjustX = (id: string, delta: number) => {
    updateEngravings(
      currentEngravings.map((e) => {
        if (e.id !== id) return e;
        const current = e.xOffset ?? 0;
        const next = Math.max(-0.07, Math.min(0.07, Math.round((current + delta) * 1000) / 1000));
        return { ...e, xOffset: next };
      }),
    );
  };

  const setXOffset = (id: string, value: number) => {
    updateEngravings(
      currentEngravings.map((e) => (e.id === id ? { ...e, xOffset: value } : e)),
    );
  };

  const toggleUppercase = (id: string) => {
    updateEngravings(
      currentEngravings.map((e) => (e.id === id ? { ...e, uppercase: !e.uppercase } : e)),
    );
  };

  const resetItemTransform = (id: string) => {
    updateEngravings(
      currentEngravings.map((e) =>
        e.id === id
          ? { ...e, scale: 1.0, yOffset: 0, xOffset: 0, uppercase: false }
          : e,
      ),
    );
  };

  const frontItems = currentEngravings.filter((e) => e.side === 'front' && e.text.trim());
  const backItems = currentEngravings.filter((e) => e.side === 'back' && e.text.trim());

  const zoneTitle = (zone: TagZone) => {
    if (zone === 'top') return isEn ? 'Top Zone' : 'Zona Superior';
    if (zone === 'center') return isEn ? 'Center Zone' : 'Zona Central';
    return isEn ? 'Bottom Zone' : 'Zona Inferior';
  };

  const zoneSuggestion = (side: TagSide, zone: TagZone) => {
    if (side === 'front') {
      if (zone === 'top') return isEn ? 'Title or nickname (e.g. MEOW)' : 'Apodo o detalle (ej. MIAU)';
      if (zone === 'center') return isEn ? 'Pet name (e.g. Amber)' : 'Nombre de tu mascota (ej. Amber)';
      return isEn ? 'Year or tag detail (e.g. 2024)' : 'Año o detalle (ej. 2024)';
    }
    if (zone === 'top') return isEn ? 'Emergency phrase or name' : 'Frase de auxilio o nombre';
    if (zone === 'center') return isEn ? 'Primary phone' : 'Teléfono principal (ej. +34 612...)';
    return isEn ? 'Backup phone or address' : 'Teléfono 2 o dirección corta';
  };

  const zonePlaceholder = (side: TagSide, zone: TagZone) => {
    if (side === 'front') {
      if (zone === 'center') return t.product.namePlaceholder;
      return t.product.zoneTextPlaceholder;
    }
    if (zone === 'center') return t.product.phonePlaceholder;
    return t.product.zoneTextPlaceholder;
  };

  return (
    <section aria-labelledby={`${instanceId}-title`} className="mt-6 rounded-2xl border border-[#e6dcd3] bg-white p-4 sm:p-5">
      <div>
        <h2 id={`${instanceId}-title`} className="font-display text-xl font-semibold text-brand-ink">
          {t.product.designYourTag}
        </h2>
        <p className="mt-1 text-sm text-brand-ink/70">{t.product.designYourTagSubtitle}</p>
      </div>

      <div className="mt-5 space-y-5">
        {/* Paso 01: Diseño */}
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

        {/* Paso 02: Color / Acabado */}
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

        {/* Paso 03 Unificado: Textos, Zonas de la Cuadrícula y Tipografías */}
        <div className="space-y-3.5 border-t border-[#e6dcd3] pt-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-brand-ink">
                {t.product.step3CustomEngraving}
              </h3>
              <p className="mt-0.5 text-xs text-brand-ink/70">
                {t.product.engravingSubtitle}
              </p>
            </div>
            {onSideChange && (
              <button
                type="button"
                onClick={() => handleFaceChange(selectedFace === 'front' ? 'back' : 'front')}
                className="flex items-center gap-1 rounded-full border border-[#cfc4bb] bg-white px-2.5 py-1 text-xs font-semibold text-brand hover:border-brand hover:text-brand-strong transition-colors shrink-0"
              >
                <RotateCcw className="h-3 w-3" />
                <span>{selectedFace === 'front' ? t.product.viewBackSide : t.product.viewFrontSide}</span>
              </button>
            )}
          </div>

          {/* Pestañas de Cara: Frontal / Reverso */}
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#e6dcd3] bg-[#faf7f2] p-1.5">
            <button
              type="button"
              onClick={() => handleFaceChange('front')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                selectedFace === 'front'
                  ? 'border border-brand/30 bg-white text-brand-strong shadow-xs ring-1 ring-brand/20'
                  : 'text-brand-ink/70 hover:text-brand-ink'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${isFrontDesign ? 'bg-brand' : 'bg-brand-ink/30'}`} />
              <span>{t.product.faceFront}</span>
              {isFrontDesign ? (
                <span className="rounded-full bg-brand-soft px-1.5 py-0.2 text-[10px] font-semibold text-brand-strong">
                  {frontItems.length}
                </span>
              ) : (
                <span className="rounded-full bg-[#e6dcd3] px-1.5 py-0.2 text-[9px] font-normal text-brand-ink/60 uppercase">
                  {isEn ? 'Art' : 'Arte'}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleFaceChange('back')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                selectedFace === 'back'
                  ? 'border border-brand/30 bg-white text-brand-strong shadow-xs ring-1 ring-brand/20'
                  : 'text-brand-ink/70 hover:text-brand-ink'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-brand" />
              <span>{t.product.faceBack}</span>
              <span className="rounded-full bg-brand-soft px-1.5 py-0.2 text-[10px] font-semibold text-brand-strong">
                {backItems.length}
              </span>
            </button>
          </div>

          {/* Advertencia si la cara frontal tiene arte completo */}
          {selectedFace === 'front' && !isFrontDesign ? (
            <div className="rounded-xl border border-brand/20 bg-brand-cream/90 p-4 text-xs text-brand-ink">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-brand mt-0.5" strokeWidth={2} />
                <div className="space-y-2">
                  <p className="font-semibold text-brand-ink leading-relaxed">
                    {t.product.frontFullArtNotice}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleFaceChange('back')}
                    className="inline-flex items-center gap-1 font-bold text-brand hover:underline"
                  >
                    {t.product.viewBackSide} →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Cuadrícula de Zonas: Superior, Central, Inferior */
            <div className="space-y-2.5">
              {(['top', 'center', 'bottom'] as TagZone[]).map((zone) => {
                const item = currentEngravings.find((e) => e.side === selectedFace && e.zone === zone);
                const itemFont = config.fonts.find((f) => f.value === item?.font) ?? config.fonts[0];
                const isFontPickerOpen = openFontPickerId === item?.id;

                if (!item) {
                  return (
                    <button
                      key={zone}
                      type="button"
                      onClick={() => addZone(selectedFace, zone)}
                      className="group flex w-full items-center justify-between rounded-xl border border-dashed border-[#cfc4bb] bg-white/70 p-3 text-xs text-brand-ink/70 hover:border-brand hover:bg-brand-soft/20 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <ZoneMiniIcon zone={zone} />
                        <div className="text-left">
                          <span className="block font-semibold text-brand-ink group-hover:text-brand-strong">
                            {zoneTitle(zone)}
                          </span>
                          <span className="block text-[11px] text-brand-ink/50">
                            {zoneSuggestion(selectedFace, zone)}
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft/70 px-2.5 py-1 text-[11px] font-bold text-brand-strong group-hover:bg-brand-soft">
                        <Plus className="h-3 w-3" />
                        {t.product.addTextToZone}
                      </span>
                    </button>
                  );
                }

                return (
                  <div
                    key={zone}
                    className="rounded-xl border border-[#e6dcd3] bg-white p-3 shadow-2xs space-y-2.5 transition-all hover:border-brand/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ZoneMiniIcon zone={zone} active />
                        <span className="text-xs font-bold text-brand-ink">
                          {zoneTitle(zone)}
                        </span>
                        <span className="rounded-full bg-brand-soft px-1.5 py-0.2 text-[10px] font-semibold text-brand-strong">
                          {itemFont.label}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeZone(item.id)}
                        className="flex items-center gap-1 text-[11px] text-brand-ink/50 hover:text-red-600 transition-colors"
                        title={t.product.removeZoneText}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>{t.product.removeZoneText}</span>
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={item.text}
                        maxLength={32}
                        onChange={(e) => updateZoneText(item.id, e.target.value)}
                        placeholder={zonePlaceholder(selectedFace, zone)}
                        className="h-10 w-full rounded-lg border border-[#cfc4bb] bg-white px-3 text-sm text-brand-ink outline-none placeholder:text-[#888] focus:border-brand focus:ring-2 focus:ring-brand/20"
                        style={{
                          fontFamily: itemFont.previewFontFamily,
                          fontWeight: itemFont.previewFontWeight ?? 'normal',
                          fontStyle: itemFont.previewFontStyle ?? 'normal',
                          textTransform: item.uppercase ? 'uppercase' : 'none',
                        }}
                      />
                      <div className="mt-1 flex items-center justify-between text-[11px] text-brand-ink/60">
                        <span>{zoneSuggestion(selectedFace, zone)}</span>
                        <span>{item.text.length} / 32</span>
                      </div>
                    </div>

                    {/* Barra de herramientas: Tamaño, Micro-ajuste de Posición y Estilo */}
                    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-[#e6dcd3] bg-[#faf7f2]/90 p-1.5 text-xs text-brand-ink">
                      {/* Tamaño del texto: A- / A+ */}
                      <div className="flex items-center rounded-md border border-[#cfc4bb] bg-white shadow-2xs">
                        <button
                          type="button"
                          onClick={() => adjustSize(item.id, -0.1)}
                          disabled={(item.scale ?? 1.0) <= 0.75}
                          className="flex h-7 w-7 items-center justify-center font-bold text-brand-ink hover:bg-brand-soft disabled:opacity-40 transition-colors"
                          title={isEn ? 'Decrease size' : 'Reducir tamaño'}
                        >
                          A-
                        </button>
                        <span className="px-1 text-[11px] font-semibold text-brand-ink/75 tabular-nums">
                          {Math.round((item.scale ?? 1.0) * 100)}%
                        </span>
                        <button
                          type="button"
                          onClick={() => adjustSize(item.id, +0.1)}
                          disabled={(item.scale ?? 1.0) >= 1.35}
                          className="flex h-7 w-7 items-center justify-center font-bold text-brand-ink hover:bg-brand-soft disabled:opacity-40 transition-colors"
                          title={isEn ? 'Increase size' : 'Aumentar tamaño'}
                        >
                          A+
                        </button>
                      </div>

                      {/* Desplazamiento Vertical: Subir / Bajar */}
                      <div className="flex items-center rounded-md border border-[#cfc4bb] bg-white shadow-2xs">
                        <button
                          type="button"
                          onClick={() => adjustY(item.id, -0.015)}
                          disabled={(item.yOffset ?? 0) <= -0.05}
                          className="flex h-7 w-7 items-center justify-center text-brand-ink hover:bg-brand-soft disabled:opacity-40 transition-colors"
                          title={isEn ? 'Move up' : 'Mover arriba'}
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustY(item.id, +0.015)}
                          disabled={(item.yOffset ?? 0) >= 0.05}
                          className="flex h-7 w-7 items-center justify-center text-brand-ink hover:bg-brand-soft disabled:opacity-40 transition-colors"
                          title={isEn ? 'Move down' : 'Mover abajo'}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Desplazamiento Horizontal / Alineación: Izquierda / Centro / Derecha */}
                      <div className="flex items-center rounded-md border border-[#cfc4bb] bg-white shadow-2xs">
                        <button
                          type="button"
                          onClick={() => adjustX(item.id, -0.02)}
                          disabled={(item.xOffset ?? 0) <= -0.07}
                          className="flex h-7 w-7 items-center justify-center text-brand-ink hover:bg-brand-soft disabled:opacity-40 transition-colors"
                          title={isEn ? 'Nudge left' : 'Mover a la izquierda'}
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setXOffset(item.id, 0)}
                          className={`flex h-7 w-6 items-center justify-center text-[10px] font-bold transition-colors ${
                            (item.xOffset ?? 0) === 0 ? 'bg-brand-soft text-brand-strong' : 'text-brand-ink/75 hover:bg-brand-soft'
                          }`}
                          title={isEn ? 'Center horizontally' : 'Centrar'}
                        >
                          •
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustX(item.id, +0.02)}
                          disabled={(item.xOffset ?? 0) >= 0.07}
                          className="flex h-7 w-7 items-center justify-center text-brand-ink hover:bg-brand-soft disabled:opacity-40 transition-colors"
                          title={isEn ? 'Nudge right' : 'Mover a la derecha'}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Mayúsculas: AA */}
                      <button
                        type="button"
                        onClick={() => toggleUppercase(item.id)}
                        className={`flex h-7 items-center gap-1 rounded-md border px-2 text-[11px] font-bold transition-colors ${
                          item.uppercase
                            ? 'border-brand bg-brand-soft text-brand-strong ring-1 ring-brand'
                            : 'border-[#cfc4bb] bg-white text-brand-ink hover:bg-brand-soft'
                        }`}
                        title={isEn ? 'Toggle uppercase' : 'Convertir a mayúsculas'}
                      >
                        <span>AA</span>
                      </button>

                      {/* Restablecer posición y tamaño original */}
                      <button
                        type="button"
                        onClick={() => resetItemTransform(item.id)}
                        disabled={
                          (item.scale ?? 1.0) === 1.0 &&
                          (item.yOffset ?? 0) === 0 &&
                          (item.xOffset ?? 0) === 0 &&
                          !item.uppercase
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-[#cfc4bb] bg-white text-brand-ink/60 hover:text-brand-strong hover:bg-brand-soft disabled:opacity-30 transition-colors ml-auto"
                        title={isEn ? 'Reset position and size' : 'Restablecer posición y tamaño'}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Selector de tipografía independiente para esta zona */}
                    <div className="border-t border-[#f0eae4] pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-brand-ink/75">
                          {t.product.fontForThisText}:
                        </span>
                        <button
                          type="button"
                          onClick={() => setOpenFontPickerId(isFontPickerOpen ? null : item.id)}
                          className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition-all ${
                            isFontPickerOpen
                              ? 'border-brand bg-brand text-white shadow-xs'
                              : 'border-brand/40 bg-brand-soft text-brand-strong hover:bg-brand-soft/80'
                          }`}
                        >
                          <Type className="h-3 w-3" />
                          <span>{itemFont.label}</span>
                          <span className="text-[9px]">{isFontPickerOpen ? '▲' : '▼'}</span>
                        </button>
                      </div>

                      {isFontPickerOpen && (
                        <div className="mt-2 max-h-[175px] overflow-y-auto rounded-lg border border-[#e6dcd3] bg-[#faf7f2]/80 p-2">
                          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                            {config.fonts.map((f) => {
                              const isSelected = item.font === f.value;
                              return (
                                <button
                                  key={f.value}
                                  type="button"
                                  onClick={() => {
                                    updateZoneFont(item.id, f.value);
                                    setOpenFontPickerId(null);
                                  }}
                                  className={`flex flex-col items-center justify-center rounded-lg border p-1.5 text-center transition-all ${
                                    isSelected
                                      ? 'border-brand bg-white ring-1.5 ring-brand shadow-xs'
                                      : 'border-[#e6dcd3] bg-white/80 hover:border-brand/40 hover:bg-white'
                                  }`}
                                >
                                  <span
                                    className="block w-full truncate text-sm leading-tight text-brand-ink"
                                    style={{
                                      fontFamily: f.previewFontFamily,
                                      fontWeight: f.previewFontWeight ?? 'normal',
                                      fontStyle: f.previewFontStyle ?? 'normal',
                                      textTransform: item.uppercase ? 'uppercase' : 'none',
                                    }}
                                  >
                                    {item.text.trim() || 'Texto'}
                                  </span>
                                  <span className={`mt-0.5 text-[9px] uppercase tracking-wider ${isSelected ? 'font-bold text-brand-strong' : 'text-brand-ink/60'}`}>
                                    {f.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Nota de zona segura */}
          <div className="flex items-start gap-2 rounded-lg bg-brand-cream/80 p-2.5 text-xs text-brand-ink/80 border border-[#e6dcd3]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-brand mt-0.5" strokeWidth={2} />
            <p className="text-[11px] leading-relaxed text-brand-ink/80">
              {t.product.safeZoneNote}
            </p>
          </div>
        </div>

        {/* Resumen del diseño */}
        <div className="rounded-lg bg-brand-cream px-3.5 py-3 text-sm">
          <p className="font-semibold text-brand-ink">{t.product.yourDesign}</p>
          <p className="mt-1 text-xs text-brand-ink/80 leading-relaxed">
            {design.label} · {finish?.label ?? t.product.chooseAColor} ·{' '}
            {currentEngravings.filter((e) => e.text.trim()).length}{' '}
            {isEn ? 'custom engravings' : 'textos personalizados'}
            {value.name ? ` ("${value.name}")` : ''}
          </p>
        </div>
      </div>
    </section>
  );
}
