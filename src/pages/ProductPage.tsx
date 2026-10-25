import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BadgeCheck, Clock, Minus, Plus, RotateCcw, Ruler, ShieldCheck, Truck, type LucideIcon } from 'lucide-react';
import { collectionLinks } from '../lib/navigation';
import { productImage, products, type Product } from '../lib/products';
import { useCart } from '../lib/cart';
import { useTranslation } from '../hooks/useTranslation';
import TagStudio, {
  type TagStudioValue,
  type TagEngravingItem,
  type TagSide,
  type TagZone,
  getInitialEngravings,
} from '../components/shop/TagStudio';
import { FaceToggle, ViewToggle, type Layer, type ProductFace, type ViewMode } from '@minoveaz/product-viewer';
import { ProductViewer } from '../components/viewer/ProductViewer';
import type { TagStudioConfig } from '../lib/products';
import { tagDimensionsMm, tagHole, tagOutline } from '../lib/tag-outlines';
import StaticPage from './StaticPage';

const base = import.meta.env.BASE_URL;
const image = (file: string) => `${base}images/${encodeURI(file)}`;

type GallerySlot = { kind: 'tag' } | { kind: 'image'; image: string; alt: string };

// Name size relative to the tag's image height; shrinks for longer names.
const nameFontSize = (name: string) => Math.max(0.07, Math.min(0.11, 0.11 - Math.max(0, name.length - 6) * 0.004));

function wrapTextToLines(text: string, maxCharsPerLine = 19): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

const clampFontSize = (desired: number, text: string) => {
  const maxAllowable = 0.78 / Math.max(1, text.length * 0.52);
  return Math.min(desired, maxAllowable);
};

function buildFaceLayers(
  engravings: TagEngravingItem[],
  face: TagSide,
  fonts: TagStudioConfig['fonts'],
  engravingColor = '#292622',
): Layer[] {
  const items = engravings.filter((item) => item.side === face && item.text.trim().length > 0);
  if (items.length === 0) return [];

  const topItem = items.find((i) => i.zone === 'top');
  const centerItem = items.find((i) => i.zone === 'center');
  const bottomItem = items.find((i) => i.zone === 'bottom');

  const layers: Layer[] = [];

  const hasTop = Boolean(topItem);
  const hasCenter = Boolean(centerItem);
  const hasBottom = Boolean(bottomItem);

  let topY = 0.44;
  let topSize = 0.055;
  let centerY = 0.58;
  let centerSize = 0.082;
  let bottomY = 0.70;
  let bottomSize = 0.052;

  if (hasTop && hasCenter && hasBottom) {
    topY = 0.42;
    topSize = 0.048;
    centerY = 0.56;
    centerSize = 0.065;
    bottomY = 0.70;
    bottomSize = 0.046;
  } else if (hasTop && hasCenter && !hasBottom) {
    topY = 0.44;
    topSize = 0.052;
    centerY = 0.63;
    centerSize = 0.076;
  } else if (!hasTop && hasCenter && hasBottom) {
    centerY = 0.52;
    centerSize = 0.076;
    bottomY = 0.68;
    bottomSize = 0.052;
  } else if (hasTop && !hasCenter && hasBottom) {
    topY = 0.45;
    topSize = 0.055;
    bottomY = 0.68;
    bottomSize = 0.055;
  } else if (!hasTop && hasCenter && !hasBottom) {
    centerY = 0.58;
    centerSize = 0.088;
  } else if (hasTop && !hasCenter && !hasBottom) {
    topY = 0.46;
    topSize = 0.068;
  } else if (!hasTop && !hasCenter && hasBottom) {
    bottomY = 0.67;
    bottomSize = 0.062;
  }

  const renderItem = (item: TagEngravingItem, baseY: number, baseSize: number) => {
    const fontConfig = fonts.find((f) => f.value === item.font) ?? fonts[0];
    const rawText = item.text.trim();
    const displayText = item.uppercase ? rawText.toUpperCase() : rawText;

    const scale = item.scale ?? 1.0;
    const finalSize = clampFontSize(baseSize * scale, displayText);

    const yNudge = item.yOffset ?? 0;
    const finalY = Math.max(0.38, Math.min(0.80, baseY + yNudge));

    const xNudge = item.xOffset ?? 0;
    const finalX = Math.max(0.18, Math.min(0.82, 0.5 + xNudge));

    const wrapped = wrapTextToLines(displayText, 19);

    if (wrapped.length <= 1) {
      layers.push({
        id: `${face}-${item.zone}-0`,
        type: 'text',
        text: displayText,
        x: finalX,
        y: finalY,
        fontSize: finalSize,
        fontFamily: fontConfig.previewFontFamily,
        fontWeight: fontConfig.previewFontWeight,
        fontStyle: fontConfig.previewFontStyle,
        color: engravingColor,
      });
    } else {
      const lineStep = 0.054 * scale;
      const startY = finalY - ((wrapped.length - 1) * lineStep) / 2;
      wrapped.forEach((line, idx) => {
        layers.push({
          id: `${face}-${item.zone}-${idx}`,
          type: 'text',
          text: line,
          x: finalX,
          y: Math.max(0.38, Math.min(0.75, startY + idx * lineStep)),
          fontSize: clampFontSize(finalSize * 0.88, line),
          fontFamily: fontConfig.previewFontFamily,
          fontWeight: fontConfig.previewFontWeight ?? 'normal',
          fontStyle: fontConfig.previewFontStyle,
          color: engravingColor,
        });
      });
    }
  };

  if (topItem) renderItem(topItem, topY, topSize);
  if (centerItem) renderItem(centerItem, centerY, centerSize);
  if (bottomItem) renderItem(bottomItem, bottomY, bottomSize);

  return layers;
}

function TagViewer({
  config,
  value,
  view,
  side,
  showSafeZone = false,
  className,
}: {
  config: TagStudioConfig;
  value: TagStudioValue;
  view: ViewMode;
  side: ProductFace;
  showSafeZone?: boolean;
  className?: string;
}) {
  const design = config.designs.find((item) => item.value === value.design) ?? config.designs[0];
  const font = config.fonts.find((item) => item.value === value.font) ?? config.fonts[0];
  const finish = config.finishes.find((item) => item.value === value.finish);
  const engravingColor = '#292622';
  const isFrontDesign = design.nameSide === 'front';

  const engravings =
    value.engravings && value.engravings.length > 0
      ? value.engravings
      : getInitialEngravings(value, design, config.defaultFont || 'FT12');

  const frontTextLayers = isFrontDesign
    ? buildFaceLayers(engravings, 'front', config.fonts, engravingColor)
    : [];

  const backTextLayers = buildFaceLayers(engravings, 'back', config.fonts, engravingColor);

  const frontLayers: Layer[] = [
    {
      id: 'design',
      type: 'image',
      src: image(design.artwork),
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    },
    ...frontTextLayers,
  ];

  const backLayers: Layer[] =
    backTextLayers.length > 0
      ? backTextLayers
      : [
          {
            id: 'back-placeholder',
            type: 'text',
            text: 'Datos de contacto',
            x: 0.5,
            y: 0.58,
            fontSize: 0.054,
            fontFamily: font.previewFontFamily,
            color: 'rgba(41, 38, 34, 0.28)',
          },
        ];

  const mainName = value.name.trim() || 'Tag';

  return (
    <div className={`relative ${className ?? ''}`}>
      <ProductViewer
        view={view}
        source={{
          baseImage: image(finish?.baseImage ?? 'tag-cats/base/tag-golden.png'),
          sideColor: finish?.sideColor,
          outline: tagOutline.map(([x, y]) => ({ x, y })),
          hole: tagHole,
          widthMm: tagDimensionsMm.width,
          heightMm: tagDimensionsMm.height,
          thicknessMm: tagDimensionsMm.thickness,
        }}
        frontLayers={frontLayers}
        backLayers={backLayers}
        side={side}
        className="h-full w-full"
        label={`Tag ${design.label}, ${side === 'front' ? 'frontal' : 'reverso'}${mainName ? `, ${mainName}` : ''}`}
      />
      {showSafeZone && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="h-full w-full max-h-full max-w-full">
            <rect
              x="13"
              y="37"
              width="74"
              height="41"
              rx="14"
              fill="rgba(229, 44, 119, 0.05)"
              stroke="#E52C77"
              strokeWidth="0.9"
              strokeDasharray="2.5 2"
            />
            <line x1="15" y1="48" x2="85" y2="48" stroke="#E52C77" strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.6" />
            <line x1="15" y1="63" x2="85" y2="63" stroke="#E52C77" strokeWidth="0.5" strokeDasharray="1.5 1.5" opacity="0.6" />

            <text x="85" y="44" textAnchor="end" fontSize="2.2" fontWeight="bold" fill="#C81E63" opacity="0.8">
              ARRIBA
            </text>
            <text x="85" y="56" textAnchor="end" fontSize="2.2" fontWeight="bold" fill="#C81E63" opacity="0.8">
              CENTRO
            </text>
            <text x="85" y="71" textAnchor="end" fontSize="2.2" fontWeight="bold" fill="#C81E63" opacity="0.8">
              ABAJO
            </text>
          </svg>
        </div>
      )}
    </div>
  );
}

function ProductGallery({
  product,
  tagValue,
  tagSide,
  setTagSide,
}: {
  product: Product;
  tagValue: TagStudioValue;
  tagSide: ProductFace;
  setTagSide: (side: ProductFace) => void;
}) {
  const { t, isEn } = useTranslation();
  const photos = product.media ?? [{ image: productImage(product), alt: product.title }];
  const tagConfig = product.tagStudio;
  const slots: GallerySlot[] = [
    ...(tagConfig ? [{ kind: 'tag' as const }] : []),
    ...photos.map((item) => ({ kind: 'image' as const, image: item.image, alt: item.alt })),
  ];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tagView, setTagView] = useState<ViewMode>('2d');
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
        <div className="relative order-1 h-[190px] sm:h-[220px] overflow-hidden rounded-xl bg-brand-cream md:order-2 md:h-[460px] lg:h-[490px] md:rounded-2xl">
          {selected.kind === 'tag' && tagConfig ? (
            <div className="flex h-full flex-col p-2 sm:p-3.5 md:p-5">
              <div className="flex shrink-0 items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-brand-strong">
                  {isEn ? 'Live 3D/2D' : 'Vista en Vivo'}
                </span>
                <ViewToggle
                  value={tagView}
                  onChange={setTagView}
                  className="flex overflow-hidden rounded-full border border-brand-strong/20 bg-white text-[11px] sm:text-xs md:text-sm font-bold shadow-xs"
                  buttonClassName="px-2.5 py-0.5 sm:px-4 sm:py-1 md:px-5 md:py-2 text-brand-ink transition-colors"
                  activeClassName="bg-brand-strong text-white"
                />
              </div>
              <div className="min-h-0 w-full flex-1">
                <TagViewer config={tagConfig} value={tagValue} view={tagView} side={tagSide} showSafeZone={showSafeZone} className="h-full w-full" />
              </div>
              {tagView === '2d' && (
                <div className="flex shrink-0 items-center justify-between pt-0.5 sm:pt-1">
                  <button
                    type="button"
                    onClick={() => setShowSafeZone(!showSafeZone)}
                    className={`flex items-center gap-1 rounded-full border px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs transition-all ${
                      showSafeZone
                        ? 'border-brand bg-brand-soft text-brand-strong font-semibold shadow-xs'
                        : 'border-[#e6dcd3] bg-white/90 text-brand-ink/75 hover:border-brand/40'
                    }`}
                    aria-pressed={showSafeZone}
                  >
                    <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-brand" strokeWidth={2} />
                    <span>{t.product.safeZoneToggle}</span>
                  </button>
                  <FaceToggle
                    value={tagSide}
                    onChange={setTagSide}
                    className="flex overflow-hidden rounded-full border border-[#e6dcd3] bg-white/90 text-[10px] sm:text-xs font-medium"
                    buttonClassName="px-2.5 py-0.5 sm:px-3 sm:py-1 text-brand-ink/75 transition-colors"
                    activeClassName="bg-brand-soft text-brand-strong font-semibold"
                  />
                </div>
              )}
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

      {/* Escala real y accesos rápidos en mano / en mascota */}
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
}: {
  product: Product;
  selectedOptions: Record<string, string>;
  onSelect: (name: string, value: string) => void;
}) {
  if (!product.options?.length) return null;

  return (
    <div className="mt-6 space-y-5">
      {product.options.map((option) => (
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
                  className={`min-h-11 rounded-lg border px-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40 ${
                    selected
                      ? 'border-brand bg-brand-soft text-brand-strong'
                      : 'border-[#e6dcd3] bg-white text-brand-ink hover:border-brand'
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
  const { t, isEn } = useTranslation();

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

  const details = [
    { title: t.product.description, content: t.product.details.descriptionContent },
    { title: t.product.shippingReturns, content: t.product.details.shippingContent },
    { title: t.product.sizingFit, content: t.product.details.sizingContent },
    { title: t.product.materialsCare, content: t.product.details.materialsContent },
  ];

  return (
    <div className="mt-6 space-y-6">
      <ul className="grid gap-3 sm:grid-cols-3">
        {purchaseHighlights.map((highlight) => {
          const Icon = highlight.Icon;
          return (
            <li key={highlight.title} className="flex items-start gap-3 rounded-xl border border-[#e6dcd3] bg-white p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
                <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-brand-ink">{highlight.title}</span>
                <span className="mt-1 block text-sm leading-6 text-brand-ink/70">{highlight.desc}</span>
              </span>
            </li>
          );
        })}
      </ul>

      {specsList.length > 0 && (
        <section aria-labelledby="tag-specs-title" className="rounded-xl border border-[#e6dcd3] bg-white p-5">
          <h3 id="tag-specs-title" className="font-display text-lg font-semibold text-brand-ink">
            {t.product.tagSpecsTitle}
          </h3>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {specsList.map((spec) => (
              <div key={spec.label} className="flex items-start gap-3">
                <BadgeCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.8} />
                <div>
                  <dt className="text-sm font-semibold text-brand-ink">{spec.label}</dt>
                  <dd className="text-sm leading-6 text-brand-ink/70">{spec.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="space-y-5">
        {details.map((detail) => (
          <section key={detail.title} aria-labelledby={`detail-${detail.title.replace(/\s+/g, '-')}`} className="border-t border-[#e6dcd3] pt-5">
            <h3 id={`detail-${detail.title.replace(/\s+/g, '-')}`} className="font-display text-lg font-semibold text-brand-ink">
              {detail.title}
            </h3>
            {detail.content.split('\n\n').map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm leading-7 text-brand-ink/75 first:mt-2">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
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
  tagSide,
  setTagSide,
}: {
  product: Product;
  tagStudioValue: TagStudioValue;
  setTagStudioValue: (value: TagStudioValue) => void;
  selectedOptions: Record<string, string>;
  setSelectedOptions: (value: Record<string, string>) => void;
  added: boolean;
  setAdded: (value: boolean) => void;
  tagSide: ProductFace;
  setTagSide: (side: ProductFace) => void;
}) {
  const { t, formatPrice, isEn } = useTranslation();
  const { addLine } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [personalization, setPersonalization] = useState('');
  const [personalizationStyle, setPersonalizationStyle] = useState('');
  const hasEngravings =
    (tagStudioValue.engravings && tagStudioValue.engravings.some((e) => e.text.trim().length > 0)) ||
    Boolean(tagStudioValue.name.trim());

  const tagStudioReady = Boolean(
    product.tagStudio && tagStudioValue.design && tagStudioValue.finish && hasEngravings,
  );
  const canPurchase = !product.tagStudio || tagStudioReady;

  const tagStudioOptions: Record<string, string> = {};
  if (product.tagStudio) {
    tagStudioOptions[isEn ? 'Tag Design' : 'Diseño del tag'] = tagStudioValue.design;
    tagStudioOptions[isEn ? 'Finish' : 'Color'] =
      product.tagStudio.finishes.find((finish) => finish.value === tagStudioValue.finish)?.label ??
      tagStudioValue.finish;

    const activeEngravings = (tagStudioValue.engravings ?? []).filter((e) => e.text.trim().length > 0);
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
    ...(product.tagStudio
      ? tagStudioOptions
      : product.personalization && personalizationStyle
      ? {
          [product.personalization.label]: personalizationStyle,
          ...(personalization.trim() ? { [t.product.engravedText]: personalization.trim() } : {}),
        }
      : {}),
  };
  const addConfiguredProduct = () => {
    if (!canPurchase) return;
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
        {product.badge && (
          <span className="rounded-full bg-brand-soft px-2 py-1 text-[11px] font-bold text-brand-strong">
            {product.badge}
          </span>
        )}
        {product.rating !== undefined && product.reviewCount !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <span className="tracking-[2px] text-brand" aria-label={`${product.rating} de 5 estrellas`}>
              {'★'.repeat(Math.round(product.rating))}
              {'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <a href="#reviews" className="text-brand-ink/70 underline-offset-2 hover:underline">
              {product.rating.toFixed(1)} ({product.reviewCount} {t.product.reviews})
            </a>
          </div>
        )}
        {product.personalization && !product.badge && (
          <span className="rounded-full bg-brand-soft px-2 py-1 text-[11px] font-bold text-brand-strong">
            {t.product.customizable}
          </span>
        )}
      </div>

      <h1 id="product-title" className="mt-3 font-display text-3xl font-bold leading-tight text-brand-ink sm:text-4xl">
        {product.title}
      </h1>
      {localizedDescription && <p className="mt-3 text-sm leading-6 text-brand-ink/70">{localizedDescription}</p>}
      <p className="mt-5 text-2xl font-bold text-brand-ink">{formatPrice(product.priceFrom)}</p>

      <ProductOptions
        product={product}
        selectedOptions={selectedOptions}
        onSelect={(name, value) => {
          setSelectedOptions({ ...selectedOptions, [name]: value });
          setAdded(false);
        }}
      />

      {product.tagStudio ? (
        <TagStudio
          config={product.tagStudio}
          value={tagStudioValue}
          onChange={(value) => {
            setTagStudioValue(value);
            setAdded(false);
          }}
          activeSide={tagSide}
          onSideChange={setTagSide}
        />
      ) : product.personalization ? (
        <div className="mt-5">
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-brand-ink">
              {product.personalization.label}
            </legend>
            {product.personalization.values && (
              <div className="flex flex-wrap gap-2">
                {product.personalization.values.map((value) => {
                  const selected = personalizationStyle === value.value;
                  return (
                    <button
                      key={value.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setPersonalizationStyle(value.value);
                        setAdded(false);
                      }}
                      className={`min-h-10 rounded-full border px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                        selected
                          ? 'border-brand bg-brand-soft text-brand-strong'
                          : 'border-[#e6dcd3] bg-white text-brand-ink hover:border-brand'
                      }`}
                    >
                      {value.label}
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>
          <label htmlFor="product-personalization" className="mb-2 mt-3 block text-sm font-semibold text-brand-ink">
            {t.product.engravedText}
          </label>
          <input
            id="product-personalization"
            type="text"
            value={personalization}
            onChange={(event) => {
              setPersonalization(event.target.value);
              setAdded(false);
            }}
            placeholder={t.product.writeName}
            className="h-11 w-full rounded-lg border border-[#cfc4bb] bg-white px-3 text-sm text-brand-ink outline-none placeholder:text-[#6b6b6b] focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          {product.personalization.description && (
            <p className="mt-1.5 text-xs text-brand-ink/70">{product.personalization.description}</p>
          )}
        </div>
      ) : null}

      {product.collections.includes('bandanas') && (
        <section aria-labelledby="size-guide-title" className="mt-6">
          <h2 id="size-guide-title" className="font-display text-lg font-semibold text-brand-ink">
            {t.product.sizeGuide}
          </h2>
          <p className="mt-1 text-sm text-brand-ink/70">
            {t.product.sizeGuideHelp}
          </p>
          <img
            src={image('9_guia blog.png')}
            alt=""
            width={1200}
            height={675}
            loading="lazy"
            className="mt-3 w-full rounded-xl object-cover"
          />
        </section>
      )}

      <div className="mt-5 flex items-center gap-2.5">
        <div className="flex h-11 w-28 shrink-0 items-center justify-between rounded-lg border border-[#cfc4bb] bg-white px-2">
          <button
            type="button"
            aria-label={t.product.decreaseQuantity}
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="flex h-8 w-8 items-center justify-center rounded text-brand-ink hover:bg-brand-cream disabled:opacity-40"
          >
            <Minus aria-hidden="true" className="h-4 w-4" />
          </button>
          <span aria-live="polite" className="min-w-5 text-center text-sm">{quantity}</span>
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
          disabled={!canPurchase}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-brand px-4 text-sm font-bold text-white hover:bg-brand-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="sm:hidden">{t.product.addToCartShort} · {formatPrice(product.priceFrom)}</span>
          <span className="hidden sm:inline">{t.product.addToCart} · {formatPrice(product.priceFrom)}</span>
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          addConfiguredProduct();
          if (canPurchase) navigate('/carrito');
        }}
        disabled={!canPurchase}
        className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-full border border-brand-ink px-4 text-sm font-semibold text-brand-ink hover:bg-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isEn ? 'Buy Now' : 'Comprar ahora'}
      </button>
      {added && (
        <p role="status" className="mt-3 text-sm font-medium text-brand-strong">
          {t.product.addedToCart} <Link to="/carrito" className="underline">{t.product.viewCart}</Link>
        </p>
      )}
    </section>
  );
}

function ProductReviews({ product }: { product: Product }) {
  const { t, isEn } = useTranslation();

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="mt-12 grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10">
      <div className="rounded-[14px] border border-[#e6dcd3] bg-white p-5 sm:p-6">
        <h2 id="reviews-title" className="font-display text-2xl font-semibold text-brand-ink">{t.product.customerReviews}</h2>
        {product.rating !== undefined && product.reviewCount !== undefined ? (
          <>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-4xl font-bold text-brand-ink">{product.rating.toFixed(1)}</span>
              <div>
                <span className="tracking-[2px] text-brand" aria-hidden="true">
                  {'★'.repeat(Math.round(product.rating))}
                  {'☆'.repeat(5 - Math.round(product.rating))}
                </span>
                <p className="text-xs text-brand-ink/70">{product.reviewCount} {t.product.reviews}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-brand-ink/70">
              {isEn ? 'Verified customer ratings for this item.' : 'Opiniones de clientes sobre este producto.'}
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm leading-6 text-brand-ink/70">
            {isEn ? 'No reviews yet for this product.' : 'Todavía no hay reseñas para este producto.'}
          </p>
        )}
      </div>
      <div className="rounded-[14px] border border-[#e6dcd3] bg-white p-5 sm:p-6">
        {product.rating !== undefined && product.reviewCount !== undefined ? (
          <p className="text-sm text-brand-ink/70">
            {isEn ? 'Verified customer reviews will appear here.' : 'Las opiniones verificadas aparecerán aquí.'}
          </p>
        ) : (
          <div className="flex h-full min-h-24 items-center justify-center text-center text-sm text-brand-ink/70">
            {isEn ? 'Share your experience once reviews are enabled.' : 'Comparte tu experiencia cuando las reseñas estén disponibles.'}
          </div>
        )}
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
      <p className="mt-1 text-sm text-brand-ink/70">
        {isEn ? 'Discover matching accessories for your pet.' : 'Descubre otros accesorios para tu mascota.'}
      </p>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {related.map((item) => (
          <li key={item.handle} className="rounded-[14px] border border-[#e6dcd3] bg-white p-2.5 sm:p-3.5">
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
  const [tagStudioValue, setTagStudioValue] = useState<TagStudioValue>(() => {
    const defaultDesign = product.tagStudio?.defaultDesign ?? product.tagStudio?.designs[0]?.value ?? '';
    const defaultFinish = product.tagStudio?.defaultFinish ?? '';
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

      <div className="grid items-start gap-8 lg:grid-cols-2 xl:gap-12">
        <div className="sticky top-14 z-30 -mx-4 border-b border-[#e6dcd3]/80 bg-white/95 px-4 pb-2.5 pt-2 shadow-[0_4px_12px_rgba(16,16,16,0.06)] backdrop-blur-md md:static md:mx-0 md:border-b-0 md:bg-transparent md:p-0 md:shadow-none lg:sticky lg:top-24">
          <ProductGallery
            product={product}
            tagValue={tagStudioValue}
            tagSide={tagSide}
            setTagSide={setTagSide}
          />
        </div>
        <div className="min-w-0 pt-2 md:pt-0">
          <ProductDetails
            key={product.handle}
            product={product}
            tagStudioValue={tagStudioValue}
            setTagStudioValue={setTagStudioValue}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            added={added}
            setAdded={setAdded}
            tagSide={tagSide}
            setTagSide={setTagSide}
          />
          <ProductInfoBlocks product={product} />
        </div>
      </div>

      <ProductReviews product={product} />
      <RelatedProducts product={product} />
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
