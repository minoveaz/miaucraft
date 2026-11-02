import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Clock,
  Minus,
  Plus,
  RotateCcw,
  Ruler,
  ShieldCheck,
  Sparkles,
  Truck,
  Edit3,
  Check,
} from 'lucide-react';
import { collectionLinks } from '../lib/navigation';
import { productImage, products, type Product } from '../lib/products';
import { useCart } from '../lib/cart';
import { useTranslation } from '../hooks/useTranslation';
import type { TagStudioValue, TagSide } from '../components/shop/TagStudio';
import { getInitialEngravings } from '../components/shop/TagStudio';
import { FaceToggle, ViewToggle, type ProductFace, type ViewMode } from '@minoveaz/product-viewer';
import { TagViewer } from '../components/shop/TagViewer';
import { TagStudioModal } from '../components/shop/TagStudioModal';
import StaticPage from './StaticPage';

const base = import.meta.env.BASE_URL;
const image = (file: string) => `${base}images/${encodeURI(file)}`;

type GallerySlot = { kind: 'tag' } | { kind: 'image'; image: string; alt: string };

function ProductGallery({
  product,
  tagValue,
  tagSide,
  setTagSide,
  onOpenStudio,
}: {
  product: Product;
  tagValue: TagStudioValue;
  tagSide: ProductFace;
  setTagSide: (side: ProductFace) => void;
  onOpenStudio?: () => void;
}) {
  const { t, isEn } = useTranslation();
  const photos = product.media ?? [];
  const tagConfig = product.tagStudio;
  const slots: GallerySlot[] = [
    ...(tagConfig ? [{ kind: 'tag' as const }] : []),
    ...photos.map((item) => ({ kind: 'image' as const, image: item.image, alt: item.alt })),
  ];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tagView, setTagView] = useState<ViewMode>('3d');
  const [showSafeZone, setShowSafeZone] = useState(false);

  useEffect(() => setSelectedIndex(0), [tagValue.finish]);
  const selected = slots[selectedIndex] ?? slots[0];
  const slotKey = (slot: GallerySlot) => (slot.kind === 'tag' ? 'tag' : slot.image);
  const slotLabel = (slot: GallerySlot) => (slot.kind === 'tag' ? t.product.myCustomTag : slot.alt);

  const petPhotoIndex = slots.findIndex(
    (s) => s.kind === 'image' && (s.image.includes('tag-Cat-Gold-7') || s.image.includes('tag-Cat-Gold-5') || s.image.includes('Cat-Gold-4')),
  );
  const specsPhotoIndex = slots.findIndex(
    (s) => s.kind === 'image' && (s.image.includes('tag view') || s.image.includes('tag-Cat-Gold-2')),
  );

  return (
    <section aria-label={`Media for ${product.title}`}>
      <div className="grid gap-2 sm:gap-3 md:grid-cols-[68px_minmax(0,1fr)] lg:grid-cols-[76px_minmax(0,1fr)]">
        {/* Miniaturas */}
        <div className="order-2 flex gap-1.5 overflow-x-auto py-0.5 md:order-1 md:h-[460px] md:flex-col md:overflow-y-auto lg:h-[490px]">
          {slots.map((slot, index) => (
            <button
              key={slotKey(slot)}
              type="button"
              aria-label={`View ${slot.kind === 'tag' ? t.product.myCustomTag : `image ${index}`}: ${slotLabel(slot)}`}
              aria-pressed={selectedIndex === index}
              onClick={() => setSelectedIndex(index)}
              className={`h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 bg-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:h-12 sm:w-12 md:h-[68px] md:w-[68px] lg:h-[76px] lg:w-[76px] ${
                selectedIndex === index ? 'border-brand shadow-xs' : 'border-transparent opacity-80 hover:opacity-100'
              }`}
            >
              {slot.kind === 'tag' && tagConfig ? (
                <span className="block h-full w-full p-0.5 sm:p-1">
                  <TagViewer config={tagConfig} value={tagValue} view="2d" side="front" className="h-full w-full" />
                </span>
              ) : (
                slot.kind === 'image' && <img src={image(slot.image)} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>

        {/* Visor Principal */}
        <div className="relative order-1 h-[260px] sm:h-[320px] overflow-hidden rounded-2xl bg-brand-cream md:order-2 md:h-[460px] lg:h-[490px] shadow-2xs border border-[#e6dcd3]">
          {selected.kind === 'tag' && tagConfig ? (
            <div className="flex h-full flex-col p-2.5 sm:p-4">
              <div className="flex shrink-0 items-center justify-between gap-2">
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-strong">
                  {isEn ? '3D Live Preview' : 'Vista en Vivo 3D'}
                </span>
                <div className="flex items-center gap-1.5">
                  <FaceToggle
                    value={tagSide}
                    onChange={(newSide) => setTagSide(newSide as ProductFace)}
                    className="flex overflow-hidden rounded-full border border-[#cfc4bb] bg-white/90 text-[10px] sm:text-xs font-medium"
                    buttonClassName="px-2.5 py-0.5 sm:px-3 sm:py-1 text-brand-ink/75 transition-colors"
                    activeClassName="bg-brand-soft text-brand-strong font-semibold"
                  />
                  <ViewToggle
                    value={tagView}
                    onChange={setTagView}
                    className="flex overflow-hidden rounded-full border border-brand-strong/20 bg-white text-[10px] sm:text-xs font-bold shadow-2xs"
                    buttonClassName="px-2.5 py-0.5 sm:px-3 sm:py-1 text-brand-ink transition-colors"
                    activeClassName="bg-brand-strong text-white"
                  />
                </div>
              </div>

              <div className="min-h-0 w-full flex-1 my-1">
                <TagViewer
                  config={tagConfig}
                  value={tagValue}
                  view={tagView}
                  side={tagSide}
                  showSafeZone={showSafeZone}
                  className="h-full w-full"
                />
              </div>

              <div className="flex shrink-0 items-center justify-between pt-1 border-t border-[#e6dcd3]/60">
                <button
                  type="button"
                  onClick={() => setShowSafeZone(!showSafeZone)}
                  className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] sm:text-xs transition-all ${
                    showSafeZone
                      ? 'border-brand bg-brand-soft text-brand-strong font-semibold'
                      : 'border-[#cfc4bb] bg-white text-brand-ink/75 hover:border-brand/40'
                  }`}
                  aria-pressed={showSafeZone}
                >
                  <ShieldCheck className="h-3 w-3 text-brand" strokeWidth={2} />
                  <span>{t.product.safeZoneToggle}</span>
                </button>

                {onOpenStudio && (
                  <button
                    type="button"
                    onClick={onOpenStudio}
                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-brand-strong hover:underline"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{t.product.editCustomizer}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            selected.kind === 'image' && (
              <img
                key={selected.image}
                src={image(selected.image)}
                alt={selected.alt}
                width={1200}
                height={1000}
                fetchPriority="high"
                className="h-full w-full object-contain p-2 sm:p-4"
              />
            )
          )}
        </div>
      </div>

      {/* Escala real y accesos rápidos */}
      {tagConfig && (
        <div className="hidden sm:flex mt-3 flex-wrap items-center justify-between gap-2 rounded-xl border border-[#e6dcd3] bg-brand-cream/60 p-2.5 px-3 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-brand-ink/80">
            <Ruler className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
            <span>
              {isEn
                ? 'Real size: 35 × 32 mm · ~12g (coin size in palm)'
                : 'Escala real: 35 × 32 mm · ~12g (tamaño moneda en mano)'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedIndex(0)}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                selectedIndex === 0
                  ? 'bg-brand text-white shadow-xs'
                  : 'border border-[#cfc4bb] bg-white text-brand-ink hover:bg-brand-soft'
              }`}
            >
              {isEn ? 'Custom Tag' : 'Personalizar'}
            </button>
            {petPhotoIndex !== -1 && (
              <button
                type="button"
                onClick={() => setSelectedIndex(petPhotoIndex)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                  selectedIndex === petPhotoIndex
                    ? 'bg-brand text-white shadow-xs'
                    : 'border border-[#cfc4bb] bg-white text-brand-ink hover:bg-brand-soft'
                }`}
              >
                {isEn ? 'On Pet' : 'En mascota'}
              </button>
            )}
            {specsPhotoIndex !== -1 && (
              <button
                type="button"
                onClick={() => setSelectedIndex(specsPhotoIndex)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                  selectedIndex === specsPhotoIndex
                    ? 'bg-brand text-white shadow-xs'
                    : 'border border-[#cfc4bb] bg-white text-brand-ink hover:bg-brand-soft'
                }`}
              >
                {isEn ? 'Measures' : 'Medidas'}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function ProductOptions({
  product,
  selectedOptions,
  onSelect,
  activeFinish,
  onFinishChange,
}: {
  product: Product;
  selectedOptions: Record<string, string>;
  onSelect: (name: string, value: string) => void;
  activeFinish?: string;
  onFinishChange?: (finish: string) => void;
}) {
  const { isEn } = useTranslation();

  return (
    <div className="mt-5 space-y-4">
      {/* Selector de Acabados / Colores */}
      {product.tagStudio && (
        <fieldset>
          <div className="flex items-center justify-between mb-2">
            <legend className="text-sm font-semibold text-brand-ink">
              {isEn ? 'Finish / Material' : 'Acabado Metálico'}
            </legend>
            <span className="text-xs font-bold text-brand-strong">
              {product.tagStudio.finishes.find((f) => f.value === activeFinish)?.label ?? activeFinish}
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {product.tagStudio.finishes.map((finish) => {
              const selected = activeFinish === finish.value;
              const swatchColor = product.tagStudio?.finishSwatches?.[finish.value] ?? '#cfc4bb';

              return (
                <button
                  key={finish.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onFinishChange?.(finish.value)}
                  className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                    selected
                      ? 'border-brand-strong bg-brand-soft text-brand-strong shadow-xs ring-1 ring-brand-strong'
                      : 'border-[#cfc4bb] bg-white text-brand-ink hover:border-brand/50'
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full ring-1 ring-black/10 shrink-0"
                    style={{ backgroundColor: swatchColor }}
                  />
                  <span>{finish.label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Otras opciones (Talla) */}
      {product.options?.map((option) => (
        <fieldset key={option.name}>
          <legend className="mb-2 text-sm font-semibold text-brand-ink">{option.label}</legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const selected = selectedOptions[option.name] === value.value;
              return (
                <button
                  key={value.value}
                  type="button"
                  disabled={value.available === false}
                  aria-pressed={selected}
                  onClick={() => onSelect(option.name, value.value)}
                  className={`min-h-10 rounded-xl border px-3.5 text-xs font-bold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40 ${
                    selected
                      ? 'border-brand-strong bg-brand-soft text-brand-strong shadow-xs ring-1 ring-brand-strong'
                      : 'border-[#cfc4bb] bg-white text-brand-ink hover:border-brand'
                  }`}
                >
                  {value.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

function ProductInfoBlocks({ product }: { product: Product }) {
  const { t } = useTranslation();

  const purchaseHighlights = [
    { Icon: Clock, title: t.product.highlights.deliveryTitle, desc: t.product.highlights.deliveryDesc },
    { Icon: RotateCcw, title: t.product.highlights.returnsTitle, desc: t.product.highlights.returnsDesc },
    { Icon: Truck, title: t.product.highlights.shippingTitle, desc: t.product.highlights.shippingDesc },
  ];

  const specsList = product.tagStudio ? [
    { label: t.product.specs.material, value: t.product.specs.materialVal },
    { label: t.product.specs.size, value: t.product.specs.sizeVal },
    { label: t.product.specs.thickness, value: t.product.specs.thicknessVal },
    { label: t.product.specs.engraving, value: t.product.specs.engravingVal },
    { label: t.product.specs.text, value: t.product.specs.textVal },
  ] : [];

  return (
    <div className="mt-8 space-y-6">
      <ul className="grid gap-3 sm:grid-cols-3">
        {purchaseHighlights.map((highlight) => {
          const Icon = highlight.Icon;
          return (
            <li key={highlight.title} className="flex items-start gap-3 rounded-2xl border border-[#e6dcd3] bg-white p-4 shadow-2xs">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
                <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <span>
                <span className="block text-xs font-bold text-brand-ink">{highlight.title}</span>
                <span className="mt-0.5 block text-xs leading-5 text-brand-ink/70">{highlight.desc}</span>
              </span>
            </li>
          );
        })}
      </ul>

      {specsList.length > 0 && (
        <section aria-labelledby="tag-specs-title" className="rounded-2xl border border-[#e6dcd3] bg-white p-5 sm:p-6 shadow-2xs">
          <h3 id="tag-specs-title" className="font-display text-base font-bold text-brand-ink">
            {t.product.tagSpecsTitle}
          </h3>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
            {specsList.map((spec) => (
              <div key={spec.label} className="border-b border-[#e6dcd3]/60 pb-2">
                <dt className="font-semibold text-brand-ink/60">{spec.label}</dt>
                <dd className="mt-0.5 font-bold text-brand-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}

function ProductDetails({
  product,
  tagStudioValue,
  setTagStudioValue,
  selectedOptions,
  setSelectedOptions,
  added,
  setAdded,
  onOpenStudio,
}: {
  product: Product;
  tagStudioValue: TagStudioValue;
  setTagStudioValue: (value: TagStudioValue) => void;
  selectedOptions: Record<string, string>;
  setSelectedOptions: (value: Record<string, string>) => void;
  added: boolean;
  setAdded: (value: boolean) => void;
  onOpenStudio: () => void;
}) {
  const { t, formatPrice, isEn } = useTranslation();
  const { addLine } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const activeDesign = product.tagStudio?.designs.find((d) => d.value === tagStudioValue.design);
  const activeEngravings = (tagStudioValue.engravings ?? []).filter((e) => e.text.trim().length > 0);
  const frontItem = activeEngravings.find((e) => e.side === 'front');
  const backItem = activeEngravings.find((e) => e.side === 'back');

  const tagStudioOptions: Record<string, string> = {};
  if (product.tagStudio) {
    tagStudioOptions[isEn ? 'Tag Design' : 'Diseño del tag'] = tagStudioValue.design;
    tagStudioOptions[isEn ? 'Finish' : 'Color'] =
      product.tagStudio.finishes.find((finish) => finish.value === tagStudioValue.finish)?.label ??
      tagStudioValue.finish;

    if (activeEngravings.length > 0) {
      activeEngravings.forEach((e) => {
        const sideLabel = e.side === 'front' ? (isEn ? 'Front' : 'Frontal') : (isEn ? 'Back' : 'Reverso');
        const zoneLabel =
          e.zone === 'top'
            ? (isEn ? 'Top' : 'Superior')
            : e.zone === 'center'
            ? (isEn ? 'Center' : 'Centro')
            : (isEn ? 'Bottom' : 'Inferior');
        const rawText = e.text.trim();
        const textToSave = e.uppercase ? rawText.toUpperCase() : rawText;
        const fontName = product.tagStudio?.fonts.find((f) => f.value === e.font)?.label ?? e.font;
        const scaleLabel = e.scale && e.scale !== 1.0 ? `, ${Math.round(e.scale * 100)}%` : '';
        tagStudioOptions[`${sideLabel} (${zoneLabel})`] = `${textToSave} [${fontName}${scaleLabel}]`;
      });
    } else if (tagStudioValue.name.trim()) {
      tagStudioOptions[isEn ? 'Engraved Name' : 'Nombre grabado'] = tagStudioValue.name.trim();
      tagStudioOptions[isEn ? 'Typography' : 'Tipografía'] = tagStudioValue.font;
      if (tagStudioValue.phone.trim()) {
        tagStudioOptions[isEn ? 'Phone' : 'Teléfono'] = tagStudioValue.phone.trim();
      }
    }
  }

  const cartOptions = {
    ...selectedOptions,
    ...(product.tagStudio ? tagStudioOptions : {}),
  };

  const addConfiguredProduct = () => {
    addLine({
      handle: product.handle,
      title: product.title,
      unitPrice: product.priceFrom,
      ...(Object.keys(cartOptions).length > 0 ? { options: cartOptions } : {}),
    }, quantity);
    setAdded(true);
  };

  const localizedDescription = product.handle === 'golden-cat'
    ? (isEn
        ? 'Surgical grade stainless steel cat ID tag with custom metallic finishes and personalized engraved text.'
        : product.description)
    : product.description;

  return (
    <section aria-labelledby="product-title">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand-strong">
          {isEn ? '3D Customizable' : 'Personalizable en 3D'}
        </span>
        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-ink/80">
          <span className="tracking-[1px] text-brand">★★★★★</span>
          <span>4.9 (128 {t.product.reviews})</span>
        </div>
      </div>

      <h1 id="product-title" className="mt-2.5 font-display text-3xl font-bold leading-tight text-brand-ink sm:text-4xl">
        {product.title}
      </h1>
      {localizedDescription && <p className="mt-2 text-sm leading-6 text-brand-ink/75">{localizedDescription}</p>}
      <p className="mt-4 font-display text-3xl font-bold text-brand-ink">{formatPrice(product.priceFrom)}</p>

      {/* Opciones estándar (Acabado & Talla) */}
      <ProductOptions
        product={product}
        selectedOptions={selectedOptions}
        onSelect={(name, value) => {
          setSelectedOptions({ ...selectedOptions, [name]: value });
          setAdded(false);
        }}
        activeFinish={tagStudioValue.finish}
        onFinishChange={(newFinish) => {
          setTagStudioValue({ ...tagStudioValue, finish: newFinish });
          setAdded(false);
        }}
      />

      {/* Tarjeta de Personalización 3D Desacoplada */}
      {product.tagStudio && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-brand/40 bg-gradient-to-br from-brand-soft/40 via-white to-brand-cream/60 p-5 sm:p-6 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong shadow-2xs">
                <Sparkles className="h-6 w-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-bold text-brand-ink">
                    {t.product.customizationIncluded}
                  </h3>
                  <span className="rounded-full bg-brand-strong px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    3D Studio
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-brand-ink/70">
                  {t.product.customizationHelp}
                </p>
              </div>
            </div>
          </div>

          {/* Resumen del grabado activo */}
          <div className="mt-4 rounded-xl border border-[#e6dcd3] bg-white p-3.5 text-xs shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6dcd3]/60 pb-2">
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                <Check className="h-3.5 w-3.5" />
                {t.product.customizationReady}
              </span>
              <span className="font-bold text-brand-ink">
                {activeDesign?.label} · {tagStudioValue.finish}
              </span>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {frontItem?.text && (
                <span className="text-brand-ink/80">
                  <span className="font-bold text-brand-strong">{isEn ? 'Front:' : 'Frente:'}</span> "{frontItem.text}"
                </span>
              )}
              {backItem?.text && (
                <span className="text-brand-ink/80">
                  <span className="font-bold text-brand-strong">{isEn ? 'Back:' : 'Reverso:'}</span> "{backItem.text}"
                </span>
              )}
              {!frontItem?.text && !backItem?.text && (
                <span className="text-brand-ink/60">
                  {isEn ? 'Using default design & sample text' : 'Diseño y texto de muestra activo'}
                </span>
              )}
            </div>
          </div>

          {/* Botón protagonista para abrir el Estudio 3D */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenStudio}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand-strong px-6 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-brand-ink transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t.product.editCustomizer}</span>
            </button>
          </div>
        </div>
      )}

      {/* Botones de Compra y Carrito */}
      <div className="mt-6 flex items-center gap-2.5">
        <div className="flex h-11 w-28 shrink-0 items-center justify-between rounded-xl border border-[#cfc4bb] bg-white px-2">
          <button
            type="button"
            aria-label={t.product.decreaseQuantity}
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="flex h-8 w-8 items-center justify-center rounded text-brand-ink hover:bg-brand-cream disabled:opacity-40"
          >
            <Minus aria-hidden="true" className="h-4 w-4" />
          </button>
          <span aria-live="polite" className="min-w-5 text-center text-sm font-bold">{quantity}</span>
          <button
            type="button"
            aria-label={t.product.increaseQuantity}
            disabled={quantity >= 10}
            onClick={() => setQuantity((current) => Math.min(10, current + 1))}
            className="flex h-8 w-8 items-center justify-center rounded text-brand-ink hover:bg-brand-cream disabled:opacity-40"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={addConfiguredProduct}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-brand px-4 text-sm font-bold text-white shadow-xs hover:bg-brand-strong transition-colors"
        >
          {added ? (
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4" />
              {t.product.addedToCart}
            </span>
          ) : (
            <span>{t.product.addToCart} · {formatPrice(product.priceFrom * quantity)}</span>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          addConfiguredProduct();
          navigate('/carrito');
        }}
        className="mt-2.5 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-brand-ink px-4 text-sm font-semibold text-brand-ink hover:bg-brand-cream transition-colors"
      >
        {t.common.checkout}
      </button>
    </section>
  );
}

function ProductReviews({ product }: { product: Product }) {
  const { t, isEn } = useTranslation();

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="mt-14">
      <div className="mb-4">
        <h2 id="reviews-title" className="font-display text-2xl font-bold text-brand-ink">
          {t.product.customerReviews}
        </h2>
        <p className="mt-1 text-xs text-brand-ink/70">
          {isEn ? 'Real reviews from pet parents.' : 'Opiniones reales de dueños de mascotas.'}
        </p>
      </div>
      <div className="rounded-2xl border border-[#e6dcd3] bg-white p-6 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="font-display text-3xl font-bold text-brand-ink">4.9</span>
          <div>
            <div className="tracking-[1px] text-brand">★★★★★</div>
            <p className="text-xs text-brand-ink/60">{isEn ? 'Based on 128 verified ratings' : 'Basado en 128 valoraciones verificadas'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RelatedProducts({ product }: { product: Product }) {
  const { t, formatPrice, isEn } = useTranslation();
  const explicitRelated = (product.relatedHandles ?? [])
    .map((handle) => products.find((item) => item.handle === handle))
    .filter((item): item is Product => item !== undefined);
  const sameCollection = products.filter(
    (item) => item.handle !== product.handle && item.collections.some((collection) => product.collections.includes(collection)),
  );
  const related = [...explicitRelated, ...sameCollection]
    .filter((item, index, all) => item.handle !== product.handle && all.findIndex((candidate) => candidate.handle === item.handle) === index)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-title" className="mt-14">
      <h2 id="related-title" className="font-display text-2xl font-bold text-brand-ink sm:text-[26px]">
        {t.product.relatedProducts}
      </h2>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {related.map((item) => (
          <li key={item.handle} className="rounded-2xl border border-[#e6dcd3] bg-white p-3 shadow-2xs">
            <Link to={`/producto/${item.handle}`} className="block aspect-square overflow-hidden rounded-xl bg-brand-cream">
              <img
                src={image(productImage(item))}
                alt=""
                width={800}
                height={800}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="px-0.5 py-2.5">
              <h3 className="text-sm font-semibold text-brand-ink">
                <Link to={`/producto/${item.handle}`} className="hover:text-brand-strong">{item.title}</Link>
              </h3>
              <p className="mt-0.5 text-sm font-bold text-brand-ink">{formatPrice(item.priceFrom)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProductDetail({ product }: { product: Product }) {
  const { t } = useTranslation();
  const collection = collectionLinks.find((item) => product.collections.includes(item.handle));
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  const [tagStudioValue, setTagStudioValue] = useState<TagStudioValue>(() => {
    const defaultDesign = product.tagStudio?.defaultDesign ?? product.tagStudio?.designs[0]?.value ?? '';
    const defaultFinish = product.tagStudio?.defaultFinish ?? 'Custom Gold';
    const defaultFont = product.tagStudio?.defaultFont ?? product.tagStudio?.fonts[0]?.value ?? 'FT12';
    const designObj = product.tagStudio?.designs.find((d) => d.value === defaultDesign) ?? { nameSide: 'front' as const };
    const initialEngravings = getInitialEngravings(
      { design: defaultDesign, finish: defaultFinish, name: 'Amber', font: defaultFont, phone: '' },
      designObj,
      defaultFont,
    );
    return {
      design: defaultDesign,
      finish: defaultFinish,
      name: 'Amber',
      font: defaultFont,
      phone: '',
      engravings: initialEngravings,
    };
  });
  const [tagSide, setTagSide] = useState<ProductFace>('front');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries((product.options ?? []).map((option) => [option.name, option.values[0]?.value ?? ''])),
  );
  const [added, setAdded] = useState(false);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb navigation" className="mb-5 text-xs text-brand-ink/70 sm:text-sm">
        <Link to="/" className="hover:text-brand-strong hover:underline">{t.nav.home}</Link>
        {collection && (
          <>
            <span aria-hidden="true"> / </span>
            <Link to={`/coleccion/${collection.handle}`} className="hover:text-brand-strong hover:underline">
              {collection.title}
            </Link>
          </>
        )}
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{product.title}</span>
      </nav>

      {/* Grid Principal Desacoplado: Galería a la izquierda y Detalles/Personalización a la derecha */}
      <div className="grid items-start gap-8 lg:grid-cols-2 xl:gap-12">
        <div className="md:sticky md:top-24">
          <ProductGallery
            product={product}
            tagValue={tagStudioValue}
            tagSide={tagSide}
            setTagSide={setTagSide}
            onOpenStudio={() => setIsStudioOpen(true)}
          />
        </div>

        <div className="min-w-0">
          <ProductDetails
            key={product.handle}
            product={product}
            tagStudioValue={tagStudioValue}
            setTagStudioValue={setTagStudioValue}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            added={added}
            setAdded={setAdded}
            onOpenStudio={() => setIsStudioOpen(true)}
          />
          <ProductInfoBlocks product={product} />
        </div>
      </div>

      <ProductReviews product={product} />
      <RelatedProducts product={product} />

      {/* Modal Desacoplado de Estudio 3D */}
      {product.tagStudio && (
        <TagStudioModal
          isOpen={isStudioOpen}
          onClose={() => setIsStudioOpen(false)}
          onSave={(newValue) => {
            setTagStudioValue(newValue);
            setAdded(false);
          }}
          config={product.tagStudio}
          initialValue={tagStudioValue}
          productTitle={product.title}
          productPrice={product.priceFrom}
        />
      )}
    </div>
  );
}

export default function ProductPage() {
  const { isEn } = useTranslation();
  const { handle } = useParams();
  const product = products.find((item) => item.handle === handle);

  if (!product) {
    return (
      <StaticPage
        title={isEn ? 'Product Not Found' : 'Producto no encontrado'}
        body={isEn ? 'This product is no longer available.' : 'Este producto ya no está disponible.'}
      />
    );
  }

  return <ProductDetail key={product.handle} product={product} />;
}
