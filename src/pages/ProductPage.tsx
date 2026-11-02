import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ChevronDown,
  Clock,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
  Check,
  Eye,
  Camera,
} from 'lucide-react';
import { collectionLinks } from '../lib/navigation';
import { productImage, products, type Product } from '../lib/products';
import { useCart } from '../lib/cart';
import { useTranslation } from '../hooks/useTranslation';
import type { TagStudioValue } from '../components/shop/TagStudio';
import { getInitialEngravings } from '../components/shop/TagStudio';
import { FaceToggle, type ProductFace } from '@minoveaz/product-viewer';
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
  const selected = slots[selectedIndex] ?? slots[0];

  return (
    <section aria-label={`Media for ${product.title}`} className="flex flex-col items-center">
      {/* Contenedor Principal de Imagen / 3D con proporción fija */}
      <div className="relative aspect-square w-full max-w-[500px] overflow-hidden rounded-2xl border border-[#e6dcd3] bg-[#fbf9f6] shadow-xs">
        {selected.kind === 'tag' && tagConfig ? (
          <div className="relative h-full w-full p-4 flex flex-col justify-between">
            {/* Cabecera sutil sobre el visor */}
            <div className="flex items-center justify-between z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-brand-strong shadow-2xs border border-[#e6dcd3]">
                <Eye className="h-3 w-3" />
                {isEn ? '3D Interactive' : 'Interactivo 3D'}
              </span>

              <FaceToggle
                value={tagSide}
                onChange={(newSide) => setTagSide(newSide as ProductFace)}
                className="flex overflow-hidden rounded-full border border-[#cfc4bb] bg-white text-xs font-semibold shadow-2xs"
                buttonClassName="px-3 py-1 text-brand-ink/75 transition-colors"
                activeClassName="bg-brand-soft text-brand-strong font-bold"
              />
            </div>

            {/* Modelo 3D */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <TagViewer
                config={tagConfig}
                value={tagValue}
                view="3d"
                side={tagSide}
                className="h-full w-full"
              />
            </div>

            {/* Botón flotante inferior para abrir el estudio */}
            <div className="flex justify-end z-10 mt-auto">
              {onOpenStudio && (
                <button
                  type="button"
                  onClick={onOpenStudio}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-strong px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-brand-ink transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isEn ? 'Open 3D Studio' : 'Personalizar en 3D'}</span>
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
              width={1000}
              height={1000}
              fetchPriority="high"
              className="h-full w-full object-cover p-1 sm:p-2"
            />
          )
        )}
      </div>

      {/* Miniaturas compactas en fila */}
      <div className="mt-3.5 flex flex-wrap justify-center gap-2">
        {slots.map((slot, index) => {
          const isSelected = selectedIndex === index;
          return (
            <button
              key={slot.kind === 'tag' ? 'tag' : slot.image}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all ${
                isSelected
                  ? 'border-brand-strong ring-2 ring-brand-soft shadow-xs scale-105'
                  : 'border-[#e6dcd3] opacity-70 hover:opacity-100 hover:border-brand/40'
              }`}
            >
              {slot.kind === 'tag' ? (
                <div className="flex h-full w-full flex-col items-center justify-center bg-brand-cream/60 text-[10px] font-bold text-brand-strong">
                  <Eye className="h-4 w-4 mb-0.5" />
                  3D
                </div>
              ) : (
                <img src={image(slot.image)} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          );
        })}
      </div>
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
    <div className="mt-4 space-y-3.5">
      {/* Selector de Acabados / Colores */}
      {product.tagStudio && (
        <fieldset>
          <div className="flex items-center justify-between mb-1.5">
            <legend className="text-xs font-bold uppercase tracking-wider text-brand-ink/70">
              {isEn ? 'Finish / Material' : 'Acabado Metálico'}
            </legend>
            <span className="text-xs font-bold text-brand-strong">
              {product.tagStudio.finishes.find((f) => f.value === activeFinish)?.label ?? activeFinish}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.tagStudio.finishes.map((finish) => {
              const selected = activeFinish === finish.value;
              const swatchColor = product.tagStudio?.finishSwatches?.[finish.value] ?? '#cfc4bb';

              return (
                <button
                  key={finish.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onFinishChange?.(finish.value)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                    selected
                      ? 'border-brand-strong bg-brand-soft/60 text-brand-strong shadow-2xs ring-1 ring-brand-strong'
                      : 'border-[#cfc4bb] bg-white text-brand-ink/80 hover:border-brand/40'
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10 shrink-0"
                    style={{ backgroundColor: swatchColor }}
                  />
                  <span>{finish.label}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Selector de Tallas */}
      {product.options?.map((option) => (
        <fieldset key={option.name}>
          <legend className="mb-1.5 text-xs font-bold uppercase tracking-wider text-brand-ink/70">
            {option.label}
          </legend>
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
                  className={`min-h-9 rounded-xl border px-3 text-xs font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40 ${
                    selected
                      ? 'border-brand-strong bg-brand-soft/60 text-brand-strong shadow-2xs ring-1 ring-brand-strong font-bold'
                      : 'border-[#cfc4bb] bg-white text-brand-ink/80 hover:border-brand/40'
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

function ProductAccordions({ product }: { product: Product }) {
  const { t, isEn } = useTranslation();
  const [openId, setOpenId] = useState<string | null>('specs');

  const toggle = (id: string) => {
    setOpenId((curr) => (curr === id ? null : id));
  };

  const specsList = product.tagStudio ? [
    { label: t.product.specs.material, value: t.product.specs.materialVal },
    { label: t.product.specs.size, value: `${t.product.specs.sizeVal} (1.38 × 1.26 in)` },
    { label: t.product.specs.thickness, value: t.product.specs.thicknessVal },
    { label: t.product.specs.engraving, value: t.product.specs.engravingVal },
    { label: t.product.specs.text, value: t.product.specs.textVal },
  ] : [];

  return (
    <div className="mt-6 border-t border-[#e6dcd3] divide-y divide-[#e6dcd3] text-xs">
      {/* Acordeón: Especificaciones */}
      <div>
        <button
          type="button"
          onClick={() => toggle('specs')}
          className="flex w-full items-center justify-between py-3.5 text-left font-bold text-brand-ink hover:text-brand-strong transition-colors"
        >
          <span>{t.product.tagSpecsTitle}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openId === 'specs' ? 'rotate-180' : ''}`} />
        </button>
        {openId === 'specs' && (
          <div className="pb-4 pt-1 grid grid-cols-2 gap-3 text-brand-ink/80">
            {specsList.map((item) => (
              <div key={item.label}>
                <span className="text-[11px] font-semibold text-brand-ink/50 block">{item.label}</span>
                <span className="font-medium text-brand-ink">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Acordeón: Descripción */}
      <div>
        <button
          type="button"
          onClick={() => toggle('desc')}
          className="flex w-full items-center justify-between py-3.5 text-left font-bold text-brand-ink hover:text-brand-strong transition-colors"
        >
          <span>{t.product.description}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openId === 'desc' ? 'rotate-180' : ''}`} />
        </button>
        {openId === 'desc' && (
          <div className="pb-4 pt-1 leading-relaxed text-brand-ink/75">
            <p>
              {isEn
                ? 'High-precision surgical stainless steel pet ID tag with custom feline artwork and deep black laser engraving. Water-resistant, rust-free, and designed to comfortably accompany your cat on every adventure.'
                : 'Placa identificativa de acero inoxidable quirúrgico de alta precisión con diseños felinos y grabado láser permanente negro. Resistente al agua, no se raya y acompaña a tu gato con total comodidad.'}
            </p>
          </div>
        )}
      </div>

      {/* Acordeón: Envíos y Garantía */}
      <div>
        <button
          type="button"
          onClick={() => toggle('shipping')}
          className="flex w-full items-center justify-between py-3.5 text-left font-bold text-brand-ink hover:text-brand-strong transition-colors"
        >
          <span>{t.product.shippingReturns}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openId === 'shipping' ? 'rotate-180' : ''}`} />
        </button>
        {openId === 'shipping' && (
          <div className="pb-4 pt-1 leading-relaxed text-brand-ink/75 space-y-1">
            <p>• {isEn ? 'Estimated delivery: 3–5 business days.' : 'Entrega estimada: 3–5 días hábiles.'}</p>
            <p>• {isEn ? '14-day return and exchange policy.' : 'Política de devolución y cambio de 14 días.'}</p>
            <p>• {isEn ? 'Free tracking included on all orders.' : 'Seguimiento con tracking incluido en todos los pedidos.'}</p>
          </div>
        )}
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

  return (
    <section aria-labelledby="product-title" className="flex flex-col">
      {/* Título, Calificación y Precio */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-ink/70">
            <span className="tracking-[1px] text-brand">★★★★★</span>
            <span>4.9 (128)</span>
          </span>
          <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[10px] font-bold text-brand-strong">
            {t.product.surgicalSteelBadge}
          </span>
        </div>

        <h1 id="product-title" className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-brand-ink">
          {product.title}
        </h1>

        <p className="mt-1 font-display text-2xl font-bold text-brand-ink">
          {formatPrice(product.priceFrom)}
        </p>
      </div>

      {/* Opciones (Color & Talla) */}
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

      {/* Bloque Limpio de Personalización 3D */}
      {product.tagStudio && (
        <div className="mt-4 rounded-2xl border border-brand/30 bg-brand-cream/40 p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-brand-ink truncate">
                  {t.product.customizationIncluded}
                </p>
                <p className="text-[11px] text-brand-ink/65 truncate">
                  {activeDesign?.label} · {frontItem?.text ? `"${frontItem.text}"` : (isEn ? 'Sample name' : 'Nombre de muestra')}
                  {backItem?.text ? ` · ${backItem.text}` : ''}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenStudio}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-strong bg-white px-3.5 py-1.5 text-xs font-bold text-brand-strong hover:bg-brand-strong hover:text-white transition-colors shadow-2xs"
            >
              <Sparkles className="h-3 w-3" />
              <span>{isEn ? 'Edit in 3D' : 'Editar en 3D'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Fila de Compra: Cantidad + Botón Añadir al Carrito en una sola línea */}
      <div className="mt-5 flex items-center gap-2.5">
        <div className="flex h-11 w-24 shrink-0 items-center justify-between rounded-xl border border-[#cfc4bb] bg-white px-2">
          <button
            type="button"
            aria-label={t.product.decreaseQuantity}
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="flex h-7 w-7 items-center justify-center rounded text-brand-ink hover:bg-brand-cream disabled:opacity-40"
          >
            <Minus aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
          <span aria-live="polite" className="min-w-4 text-center text-xs font-bold">{quantity}</span>
          <button
            type="button"
            aria-label={t.product.increaseQuantity}
            disabled={quantity >= 10}
            onClick={() => setQuantity((current) => Math.min(10, current + 1))}
            className="flex h-7 w-7 items-center justify-center rounded text-brand-ink hover:bg-brand-cream disabled:opacity-40"
          >
            <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={addConfiguredProduct}
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-bold text-white shadow-xs hover:bg-brand-strong transition-colors"
        >
          {added ? (
            <>
              <Check className="h-4 w-4" />
              <span>{t.product.addedToCart}</span>
            </>
          ) : (
            <span>{t.product.addToCart} · {formatPrice(product.priceFrom * quantity)}</span>
          )}
        </button>
      </div>

      {/* Barra de Confianza Compacta */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#e6dcd3]/60 pt-3 text-[11px] text-brand-ink/70">
        <span className="flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5 text-brand" />
          {t.common.freeShippingNotice}
        </span>
        <span className="flex items-center gap-1.5">
          <RotateCcw className="h-3.5 w-3.5 text-brand" />
          {isEn ? '14-Day Returns' : 'Devolución 14 días'}
        </span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-brand" />
          {isEn ? '316L Stainless Steel' : 'Acero Quirúrgico 316L'}
        </span>
      </div>

      {/* Acordeones plegables de Información (Reemplaza las tablas masivas estáticas) */}
      <ProductAccordions product={product} />
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

  useEffect(() => {
    document.title = `${product.title} · Miaucraft`;
  }, [product.title]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      {/* Breadcrumbs Compactos */}
      <nav aria-label="Breadcrumb navigation" className="mb-4 text-xs text-brand-ink/60">
        <Link to="/" className="hover:text-brand-strong">{t.nav.home}</Link>
        {collection && (
          <>
            <span aria-hidden="true"> / </span>
            <Link to={`/coleccion/${collection.handle}`} className="hover:text-brand-strong">
              {collection.title}
            </Link>
          </>
        )}
        <span aria-hidden="true"> / </span>
        <span aria-current="page" className="font-semibold text-brand-ink">{product.title}</span>
      </nav>

      {/* Grid 2 Columnas Equilibrado: Galería a la izquierda y Detalles a la derecha */}
      <div className="grid items-start gap-8 md:grid-cols-2 lg:gap-12">
        <ProductGallery
          product={product}
          tagValue={tagStudioValue}
          tagSide={tagSide}
          setTagSide={setTagSide}
          onOpenStudio={() => setIsStudioOpen(true)}
        />

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
      </div>

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
