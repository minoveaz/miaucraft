import { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, Check, RotateCcw, Ruler } from 'lucide-react';
import { ViewToggle, FaceToggle, type ProductFace, type ViewMode } from '@minoveaz/product-viewer';
import TagStudio, { type TagStudioValue, type TagSide } from './TagStudio';
import { TagViewer } from './TagViewer';
import type { TagStudioConfig } from '../../lib/products';
import { useTranslation } from '../../hooks/useTranslation';

export interface TagStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: TagStudioValue) => void;
  config: TagStudioConfig;
  initialValue: TagStudioValue;
  productTitle?: string;
  productPrice?: number;
}

export function TagStudioModal({
  isOpen,
  onClose,
  onSave,
  config,
  initialValue,
  productTitle = 'Cat Tag',
  productPrice,
}: TagStudioModalProps) {
  const { t, isEn, formatPrice } = useTranslation();
  const [draftValue, setDraftValue] = useState<TagStudioValue>(initialValue);
  const [view, setView] = useState<ViewMode>('3d');
  const [side, setSide] = useState<ProductFace>('front');
  const [showSafeZone, setShowSafeZone] = useState(false);

  // Sync draft when opened
  useEffect(() => {
    if (isOpen) {
      setDraftValue(initialValue);
      setSide('front');
      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, initialValue]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApply = () => {
    onSave(draftValue);
    onClose();
  };

  const activeFinish = config.finishes.find((f) => f.value === draftValue.finish) ?? config.finishes[0];
  const activeDesign = config.designs.find((d) => d.value === draftValue.design) ?? config.designs[0];
  const activeEngravings = (draftValue.engravings ?? []).filter((e) => e.text.trim().length > 0);
  const frontItem = activeEngravings.find((e) => e.side === 'front');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="studio-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-3 md:p-6 animate-in fade-in duration-200"
    >
      <div className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden bg-white shadow-2xl sm:h-[94vh] sm:rounded-3xl border border-[#e6dcd3]">
        {/* Header Superior */}
        <header className="flex h-14 sm:h-16 shrink-0 items-center justify-between border-b border-[#e6dcd3] bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand-strong shadow-2xs">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="studio-modal-title" className="font-display text-sm sm:text-base font-bold text-brand-ink">
                  {t.product.studioModalTitle}
                </h2>
                <span className="hidden sm:inline-flex rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-bold text-brand-strong">
                  {productTitle}
                </span>
              </div>
              <p className="text-[11px] text-brand-ink/60">
                {activeDesign.label} · {activeFinish.label} {productPrice !== undefined && `· ${formatPrice(productPrice)}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-brand-ink/70 hover:bg-brand-cream hover:text-brand-ink transition-colors"
              aria-label={t.common.cancel}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Cuerpo Principal Dividido (Desktop: 2 Cols / Móvil: Visor arriba + Editor abajo) */}
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Columna Izquierda: Visor 3D Interactivo */}
          <div className="flex flex-col justify-between border-b border-[#e6dcd3] bg-gradient-to-b from-[#fbf9f6] to-brand-cream/30 p-3 sm:p-5 lg:col-span-6 lg:border-b-0 lg:border-r h-[38vh] sm:h-[45vh] lg:h-auto">
            {/* Controles de Vista y Cara */}
            <div className="flex shrink-0 items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <FaceToggle
                  value={side}
                  onChange={(newSide) => setSide(newSide as ProductFace)}
                  className="flex overflow-hidden rounded-full border border-[#cfc4bb] bg-white text-xs font-bold shadow-2xs"
                  buttonClassName="px-3 py-1 text-brand-ink/75 transition-colors"
                  activeClassName="bg-brand-strong text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowSafeZone(!showSafeZone)}
                  className={`hidden sm:flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-all ${
                    showSafeZone
                      ? 'border-brand bg-brand-soft text-brand-strong font-semibold shadow-xs'
                      : 'border-[#cfc4bb] bg-white text-brand-ink/75 hover:border-brand/40'
                  }`}
                  aria-pressed={showSafeZone}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
                  <span>{t.product.safeZoneToggle}</span>
                </button>
              </div>

              <ViewToggle
                value={view}
                onChange={setView}
                className="flex overflow-hidden rounded-full border border-brand-strong/20 bg-white text-xs font-bold shadow-2xs"
                buttonClassName="px-3 py-1 text-brand-ink transition-colors"
                activeClassName="bg-brand-strong text-white"
              />
            </div>

            {/* Lienzo 3D / 2D */}
            <div className="relative min-h-0 flex-1 w-full my-1 sm:my-2">
              <TagViewer
                config={config}
                value={draftValue}
                view={view}
                side={side}
                showSafeZone={showSafeZone}
                className="h-full w-full"
              />
            </div>

            {/* Pie del Visor */}
            <div className="hidden sm:flex shrink-0 items-center justify-between text-[11px] text-brand-ink/60 border-t border-[#e6dcd3]/60 pt-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Ruler className="h-3 w-3 text-brand" />
                {isEn ? 'Real size: 35 × 32 mm · ~12g' : 'Escala real: 35 × 32 mm · ~12g'}
              </span>
              <span>
                {view === '3d'
                  ? (isEn ? 'Drag to rotate 360°' : 'Arrastra para rotar en 360°')
                  : (isEn ? '2D Flat engraving view' : 'Vista plana de grabado 2D')}
              </span>
            </div>
          </div>

          {/* Columna Derecha: Controles de Personalización */}
          <div className="flex flex-col min-h-0 lg:col-span-6 bg-white overflow-y-auto p-4 sm:p-6 lg:p-7">
            <TagStudio
              config={config}
              value={draftValue}
              onChange={setDraftValue}
              onSideChange={(newSide) => setSide(newSide as ProductFace)}
              activeSide={side as TagSide}
            />
          </div>
        </div>

        {/* Footer / Barra de Acción Inferior */}
        <footer className="flex h-16 sm:h-18 shrink-0 items-center justify-between border-t border-[#e6dcd3] bg-white px-4 sm:px-6 shadow-md">
          {/* Resumen del diseño */}
          <div className="min-w-0 pr-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand-ink/50">
              {isEn ? 'Configured Tag' : 'Tu placa personalizada'}
            </p>
            <p className="truncate text-xs sm:text-sm font-bold text-brand-ink">
              {activeDesign.label} · {activeFinish.label}
              {frontItem?.text ? ` · "${frontItem.text}"` : ''}
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#cfc4bb] bg-white px-4 sm:px-5 text-xs sm:text-sm font-semibold text-brand-ink/80 hover:bg-brand-cream transition-colors"
            >
              {t.product.discardChanges}
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-brand-strong px-5 sm:px-7 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-brand-ink transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>{t.product.applyDesign}</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
