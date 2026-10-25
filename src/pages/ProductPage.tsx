import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  BadgeCheck,
  Check,
  ChevronDown,
  Clock,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { collectionLinks } from '../lib/navigation';
import { productImage, products, type Product } from '../lib/products';
import { useCart } from '../lib/cart';
import { useTranslation } from '../hooks/useTranslation';
import TagStudio, { type TagStudioValue } from '../components/shop/TagStudio';
import { FaceToggle, ProductViewer, ViewToggle, type Layer, type ProductFace, type ViewMode } from '@minoveaz/product-viewer';
import type { TagStudioConfig } from '../lib/products';
import { tagDimensionsMm, tagHole, tagOutline } from '../lib/tag-outlines';
import StaticPage from './StaticPage';

const base = import.meta.env.BASE_URL;
const image = (file: string) => `${base}images/${encodeURI(file)}`;

type GallerySlot = { kind: 'tag' } | { kind: 'image'; image: string; alt: string };

const nameFontSize = (name: string) =>
  Math.max(0.07, Math.min(0.11, 0.11 - Math.max(0, name.length - 6) * 0.004));

function TagViewer({
  config,
  value,
  view,
  side,
  className,
}: {
  config: TagStudioConfig;
  value: TagStudioValue;
  view: ViewMode;
  side: ProductFace;
  className?: string;
}) {
  const design = config.designs.find((item) => item.value === value.design) ?? config.designs[0];
  const font = config.fonts.find((item) => item.value === value.font) ?? config.fonts[0];
  const name = value.name.trim();
  const finish = config.finishes.find((item) => item.value === value.finish);
  const engravingColor = '#292622';

  const nameLayer: Layer = {
    id: 'name',
    type: 'text',
    text: name || 'Text here',
    x: 0.5,
    y: 0.6,
    fontSize: nameFontSize(name || 'Text here'),
    fontFamily: font.previewFontFamily,
    fontWeight: font.previewFontWeight,
    fontStyle: font.previewFontStyle,
    color: name ? engravingColor : 'rgba(41, 38, 34, 0.35)',
  };

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
    ...(design.nameSide === 'front' ? [nameLayer] : []),
  ];

  const backLayers: Layer[] = design.nameSide === 'back' ? [nameLayer] : [];

  return (
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
      className={className}
      label={`Tag ${design.label}, ${side === 'front' ? 'frontal' : 'reverso'}${name ? `, nombre ${name}` : ''}`}
    />
  );
}

export default function ProductPage() {
  const { isEn, t, formatPrice } = useTranslation();
  const { handle } = useParams();
  const navigate = useNavigate();
  const { addLine, openDrawer } = useCart();

  const product = products.find((item) => item.handle === handle);

  const [tagStudioValue, setTagStudioValue] = useState<TagStudioValue>(() => ({
    design: product?.tagStudio?.defaultDesign ?? product?.tagStudio?.designs[0]?.value ?? '',
    finish: product?.tagStudio?.defaultFinish ?? '',
    name: '',
    font: product?.tagStudio?.defaultFont ?? product?.tagStudio?.fonts[0]?.value ?? '',
    phone: '',
  }));

  const [tagView, setTagView] = useState<ViewMode>('3d');
  const [tagSide, setTagSide] = useState<ProductFace>('front');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('desc');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [handle]);

  if (!product) {
    return (
      <StaticPage
        title={isEn ? 'Product Not Found' : 'Producto no encontrado'}
        body={isEn ? 'This product is no longer available in the store.' : 'Este producto ya no está disponible.'}
      />
    );
  }

  const collection = collectionLinks.find((item) => product.collections.includes(item.handle));
  const tagConfig = product.tagStudio;
  const lifestylePhotos = product.media ?? [{ image: productImage(product), alt: product.title }];

  const canPurchase = !tagConfig || Boolean(tagStudioValue.name.trim().length > 0);

  const tagStudioOptions = tagConfig
    ? {
        [isEn ? 'Tag Shape' : 'Diseño del tag']: tagStudioValue.design,
        [isEn ? 'Metallic Finish' : 'Color']: tagConfig.finishes.find((f) => f.value === tagStudioValue.finish)?.label ?? tagStudioValue.finish,
        [isEn ? 'Pet Name' : 'Nombre grabado']: tagStudioValue.name.trim(),
        [isEn ? 'Font' : 'Tipografía']: tagStudioValue.font,
        ...(tagConfig.phoneEnabled && tagStudioValue.phone.trim()
          ? { [isEn ? 'Emergency Phone' : 'Teléfono']: tagStudioValue.phone.trim() }
          : {}),
      }
    : {};

  const handleAddToCart = () => {
    if (!canPurchase) return;
    addLine({
      handle: product.handle,
      title: product.title,
      unitPrice: product.priceFrom,
      image: productImage(product),
      options: tagStudioOptions,
    }, quantity);

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 5000);
    if (openDrawer) openDrawer();
  };

  const handleBuyNow = () => {
    if (!canPurchase) return;
    handleAddToCart();
    navigate('/carrito');
  };

  const purchaseHighlights = [
    { Icon: Clock, title: t.product.highlights.deliveryTitle, desc: t.product.highlights.deliveryDesc },
    { Icon: RotateCcw, title: t.product.highlights.returnsTitle, desc: t.product.highlights.returnsDesc },
    { Icon: Truck, title: t.product.highlights.shippingTitle, desc: t.product.highlights.shippingDesc },
  ];

  const specsList = [
    { label: t.product.specs.material, value: t.product.specs.materialVal },
    { label: t.product.specs.size, value: t.product.specs.sizeVal },
    { label: t.product.specs.thickness, value: t.product.specs.thicknessVal },
    { label: t.product.specs.engraving, value: t.product.specs.engravingVal },
    { label: t.product.specs.text, value: t.product.specs.textVal },
  ];

  const accordionSections = [
    { id: 'desc', title: t.product.description, content: t.product.details.descriptionContent },
    { id: 'shipping', title: t.product.shippingReturns, content: t.product.details.shippingContent },
    { id: 'sizing', title: t.product.sizingFit, content: t.product.details.sizingContent },
    { id: 'care', title: t.product.materialsCare, content: t.product.details.materialsContent },
  ];

  const localizedDescription = product.handle === 'golden-cat'
    ? (isEn
        ? 'Deeply laser-engraved 316L surgical stainless steel pet ID tag. Includes reinforced split ring for immediate attachment.'
        : 'Placa identificativa grabada con láser en acero quirúrgico 316L con acabados de alta gama y anilla de unión reforzada.')
    : product.description;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb navigation" className="mb-5 flex items-center gap-1.5 text-xs text-brand-ink/65 sm:text-sm">
        <Link to="/" className="hover:text-brand-strong hover:underline transition-colors">{t.nav.home}</Link>
        <span aria-hidden="true" className="text-brand-ink/40">/</span>
        {collection && (
          <>
            <Link to={`/coleccion/${collection.handle}`} className="hover:text-brand-strong hover:underline transition-colors">
              {collection.title}
            </Link>
            <span aria-hidden="true" className="text-brand-ink/40">/</span>
          </>
        )}
        <span aria-current="page" className="font-semibold text-brand-ink">{product.title}</span>
      </nav>

      {/* SPLIT LAYOUT (Sticky Viewer on Left / Continuous Customizer on Right) */}
      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_490px] xl:grid-cols-[1.15fr_530px] xl:gap-14">
        
        {/* COLUMNA IZQUIERDA: VISOR 3D & GALERÍA (STICKY DESKTOP) */}
        <div className="lg:sticky lg:top-24 space-y-5">
          {/* Main Visualizer Container */}
          <div className="relative overflow-hidden rounded-3xl border border-[#e6dcd3] bg-gradient-to-b from-[#FBF8F5] to-[#F1EBE3] shadow-sm">
            {/* Top Bar Badges & Controls */}
            <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-3.5 sm:p-5 pointer-events-none">
              <span className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-brand-ink/10 bg-white/90 px-3 py-1 text-xs font-bold text-brand-ink shadow-xs backdrop-blur-xs">
                <ShieldCheck className="h-4 w-4 text-brand" />
                {t.product.surgicalSteelBadge}
              </span>

              {selectedPhotoIndex === null && (
                <div className="pointer-events-auto">
                  <ViewToggle
                    value={tagView}
                    onChange={setTagView}
                    className="flex overflow-hidden rounded-full border border-[#cfc4bb] bg-white text-xs font-bold shadow-xs"
                    buttonClassName="px-3.5 py-1.5 text-brand-ink transition-colors"
                    activeClassName="bg-brand text-white"
                  />
                </div>
              )}
            </div>

            {/* Viewer Screen (Height controlled for responsive ergonomics) */}
            <div className="h-[380px] sm:h-[480px] md:h-[540px] lg:h-[560px] xl:h-[600px] w-full flex items-center justify-center">
              {selectedPhotoIndex !== null ? (
                /* Foto seleccionada de la galería */
                <img
                  src={image(lifestylePhotos[selectedPhotoIndex].image)}
                  alt={lifestylePhotos[selectedPhotoIndex].alt}
                  className="h-full w-full object-contain p-4 transition-all duration-300"
                />
              ) : tagConfig ? (
                /* Visor interactivo 3D / 2D */
                <TagViewer
                  config={tagConfig}
                  value={tagStudioValue}
                  view={tagView}
                  side={tagSide}
                  className="h-full w-full"
                />
              ) : (
                <img
                  src={image(productImage(product))}
                  alt={product.title}
                  className="h-full w-full object-contain p-6"
                />
              )}
            </div>

            {/* Bottom Bar: Face Toggle & Interactive Rotate Hint */}
            {selectedPhotoIndex === null && tagConfig && (
              <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between p-3.5 sm:p-5 pointer-events-none">
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-ink/60">
                  <Sparkles className="h-3.5 w-3.5 text-brand" />
                  {t.product.dragToRotate}
                </span>

                <div className="pointer-events-auto ml-auto flex items-center gap-2">
                  <FaceToggle
                    value={tagSide}
                    onChange={setTagSide}
                    className="flex overflow-hidden rounded-full border border-[#cfc4bb] bg-white text-xs font-semibold shadow-xs"
                    buttonClassName="px-3.5 py-1.5 text-brand-ink transition-colors"
                    activeClassName="bg-brand-soft text-brand-strong font-bold"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Micro aviso de grabado */}
          <p className="text-center text-xs text-brand-ink/65">
            {t.product.livePreviewBadge}
          </p>

          {/* Galería de miniaturas y fotos de estilo de vida */}
          <div className="flex items-center gap-2.5 overflow-x-auto py-1">
            {/* Botón de acceso al visor 3D activo */}
            {tagConfig && (
              <button
                type="button"
                onClick={() => setSelectedPhotoIndex(null)}
                className={`flex-none h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 p-1 text-center transition-all overflow-hidden ${
                  selectedPhotoIndex === null
                    ? 'border-brand ring-2 ring-brand/30 shadow-xs'
                    : 'border-[#cfc4bb] hover:border-brand/50 bg-[#FAF7F2]'
                }`}
              >
                <div className="h-full w-full rounded-xl bg-brand-cream/80 flex flex-col items-center justify-center p-1">
                  <span className="text-[10px] font-bold text-brand uppercase tracking-wider">3D Live</span>
                  <span className="text-[10px] text-brand-ink font-medium truncate w-full text-center">
                    {tagStudioValue.name || 'Amber'}
                  </span>
                </div>
              </button>
            )}

            {/* Fotos de mascotas reales */}
            {lifestylePhotos.map((photo, index) => {
              const active = selectedPhotoIndex === index;
              return (
                <button
                  key={photo.image}
                  type="button"
                  onClick={() => setSelectedPhotoIndex(index)}
                  className={`flex-none h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 transition-all overflow-hidden bg-brand-cream/50 ${
                    active
                      ? 'border-brand ring-2 ring-brand/30 shadow-xs'
                      : 'border-[#cfc4bb] hover:border-brand/50'
                  }`}
                >
                  <img
                    src={image(photo.image)}
                    alt={photo.alt}
                    className="h-full w-full object-cover"
                  />
                </button>
              );
            })}
          </div>

          {/* ESPECIFICACIONES TÉCNICAS (Desktop Column) */}
          <div className="hidden lg:block space-y-4 pt-4">
            <div className="rounded-2xl border border-[#e6dcd3] bg-white p-5 shadow-xs">
              <h3 className="font-display text-base font-bold text-brand-ink mb-4">
                {t.product.tagSpecsTitle}
              </h3>
              <dl className="grid grid-cols-2 gap-4">
                {specsList.map((spec) => (
                  <div key={spec.label} className="flex items-start gap-2.5">
                    <BadgeCheck className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                    <div>
                      <dt className="text-xs font-semibold text-brand-ink/80">{spec.label}</dt>
                      <dd className="text-xs text-brand-ink font-bold mt-0.5 leading-snug">{spec.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* Acordeones informativos (Materiales, Envíos, Cuidados) */}
            <div className="rounded-2xl border border-[#e6dcd3] bg-white divide-y divide-[#f0eae4] overflow-hidden shadow-xs">
              {accordionSections.map((acc) => {
                const isOpen = openAccordion === acc.id;
                return (
                  <div key={acc.id} className="p-4 sm:p-5">
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(isOpen ? null : acc.id)}
                      className="flex w-full items-center justify-between text-left font-display text-sm font-bold text-brand-ink hover:text-brand transition-colors"
                    >
                      <span>{acc.title}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-brand-ink/60 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-brand' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-3 text-xs leading-6 text-brand-ink/75 whitespace-pre-line">
                        {acc.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: CONFIGURACIÓN CONTINUA & COMPRA */}
        <div className="space-y-6">
          {/* Cabecera del producto */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-brand-cream border border-[#e6dcd3] px-3 py-1 text-xs font-bold text-brand-strong">
                {isEn ? 'Top Pick' : 'Más Vendido'}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-brand-ink/70">
                <span className="text-amber-500 font-bold tracking-wider">★★★★★</span>
                <a href="#reviews" className="underline font-semibold hover:text-brand">
                  4.9 (128 {t.product.reviews})
                </a>
              </div>
            </div>

            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold leading-tight text-brand-ink">
              {product.title}
            </h1>

            {localizedDescription && (
              <p className="mt-2 text-sm leading-6 text-brand-ink/75">
                {localizedDescription}
              </p>
            )}

            {/* Precio & Envío Gratis */}
            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-brand-ink">
                {formatPrice(product.priceFrom)}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                {t.common.freeShippingNotice}
              </span>
            </div>
          </div>

          {/* CONFIGURADOR CONTINUO DE TAGS */}
          {tagConfig && (
            <TagStudio
              config={tagConfig}
              value={tagStudioValue}
              onChange={setTagStudioValue}
              onSideChange={(side) => setTagSide(side)}
            />
          )}

          {/* BLOQUE DE COMPRA Y CANTIDAD */}
          <div className="rounded-2xl border border-[#e6dcd3] bg-white p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              {/* Selector de cantidad */}
              <div className="flex h-12 w-32 shrink-0 items-center justify-between rounded-xl border border-[#cfc4bb] bg-white px-2">
                <button
                  type="button"
                  aria-label={t.product.decreaseQuantity}
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-ink hover:bg-brand-cream disabled:opacity-30 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-bold text-sm text-brand-ink">{quantity}</span>
                <button
                  type="button"
                  aria-label={t.product.increaseQuantity}
                  disabled={quantity >= 10}
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-ink hover:bg-brand-cream disabled:opacity-30 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Botón principal: Añadir al carrito */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canPurchase}
                className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm sm:text-base font-bold text-white shadow-md hover:bg-brand-strong transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>
                  {t.product.addToCart} · {formatPrice(product.priceFrom * quantity)}
                </span>
              </button>
            </div>

            {/* Botón secundario: Comprar ahora */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!canPurchase}
              className="w-full h-11 inline-flex items-center justify-center rounded-xl border-2 border-brand-ink/90 text-sm font-bold text-brand-ink hover:bg-brand-cream transition-colors disabled:opacity-40"
            >
              {isEn ? 'Buy Now with 1-Click' : 'Comprar ahora en 1 paso'}
            </button>

            {/* Feedback Toast de añadido */}
            {addedToast && (
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 animate-fade-in">
                <span className="flex items-center gap-1.5 font-bold">
                  <Check className="h-4 w-4 text-emerald-600" />
                  {t.product.addedToCart}
                </span>
                <Link to="/carrito" className="font-bold underline hover:text-emerald-950">
                  {t.common.viewCart} →
                </Link>
              </div>
            )}
          </div>

          {/* BENEFICIOS DESTACADOS EN PÍLDORAS */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {purchaseHighlights.map((item) => {
              const Icon = item.Icon;
              return (
                <div key={item.title} className="rounded-xl border border-[#e6dcd3] bg-white p-3">
                  <Icon className="h-5 w-5 text-brand mx-auto mb-1" />
                  <span className="block text-[11px] font-bold text-brand-ink">{item.title}</span>
                  <span className="mt-0.5 block text-[10px] text-brand-ink/65 leading-tight">{item.desc}</span>
                </div>
              );
            })}
          </div>

          {/* ESPECIFICACIONES (Móvil / Tablet solamente) */}
          <div className="block lg:hidden space-y-4 pt-2">
            <div className="rounded-2xl border border-[#e6dcd3] bg-white p-4 shadow-xs">
              <h3 className="font-display text-base font-bold text-brand-ink mb-3">
                {t.product.tagSpecsTitle}
              </h3>
              <dl className="grid grid-cols-2 gap-3">
                {specsList.map((spec) => (
                  <div key={spec.label} className="flex items-start gap-2">
                    <BadgeCheck className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                    <div>
                      <dt className="text-xs font-semibold text-brand-ink/70">{spec.label}</dt>
                      <dd className="text-xs text-brand-ink font-bold mt-0.5">{spec.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-[#e6dcd3] bg-white divide-y divide-[#f0eae4] overflow-hidden shadow-xs">
              {accordionSections.map((acc) => {
                const isOpen = openAccordion === acc.id;
                return (
                  <div key={acc.id} className="p-4">
                    <button
                      type="button"
                      onClick={() => setOpenAccordion(isOpen ? null : acc.id)}
                      className="flex w-full items-center justify-between text-left font-display text-sm font-bold text-brand-ink"
                    >
                      <span>{acc.title}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-brand-ink/60 transition-transform ${isOpen ? 'rotate-180 text-brand' : ''}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-3 text-xs leading-6 text-brand-ink/75 whitespace-pre-line">
                        {acc.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN INFERIOR 1: RESEÑAS VERIFICADAS */}
      <section id="reviews" aria-labelledby="reviews-title" className="mt-16 pt-10 border-t border-[#e6dcd3]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 id="reviews-title" className="font-display text-2xl sm:text-3xl font-bold text-brand-ink">
              {t.product.customerReviews}
            </h2>
            <p className="mt-1 text-sm text-brand-ink/70">
              {isEn ? '100% verified pet parent reviews and experiences.' : 'Opiniones de dueños de mascotas que ya disfrutan su placa Miaucraft.'}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-brand-cream border border-[#e6dcd3] px-4 py-2">
            <span className="text-2xl font-bold text-brand-ink">4.9</span>
            <div>
              <span className="text-amber-500 font-bold tracking-wider text-sm">★★★★★</span>
              <p className="text-[11px] font-semibold text-brand-ink/70">128 {t.product.reviews}</p>
            </div>
          </div>
        </div>

        {/* Muro de Reseñas de muestra de clientes reales */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              author: 'Elena R. & Thor',
              pet: 'Golden Retriever',
              text: isEn
                ? 'The gold finish looks even better in person than in the 3D viewer! The engraving is deep and sharp, Thor has been running in the mud and it remains shiny.'
                : '¡El acabado dorado se ve aún más bonito en persona que en el visor 3D! El grabado es nítido y profundo, Thor se mete en charcos y sigue impecable.',
              rating: 5,
              date: 'Hace 3 días',
            },
            {
              author: 'Carlos M. & Milo',
              pet: 'Gato Siamés',
              text: isEn
                ? 'Super lightweight for my cat, does not bother his neck at all. The phone number on the back gives us total peace of mind.'
                : 'Muy ligera para el cuello de mi gato, no le molesta nada. Tener nuestro teléfono grabado detrás nos da total tranquilidad.',
              rating: 5,
              date: 'Hace 1 semana',
            },
            {
              author: 'Sarah W. & Luna',
              pet: 'French Bulldog',
              text: isEn
                ? 'Rose gold matches her pink collar perfectly. Fast delivery and the split ring feels very solid and secure.'
                : 'El oro rosa combina perfecto con su collar. Envío rápido y la anilla de unión es súper resistente, no se abre.',
              rating: 5,
              date: 'Hace 2 semanas',
            },
          ].map((rev) => (
            <div key={rev.author} className="rounded-2xl border border-[#e6dcd3] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-amber-500 font-bold text-sm tracking-wider">{'★'.repeat(rev.rating)}</span>
                <span className="text-xs text-brand-ink/50">{rev.date}</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-brand-ink/80 italic">"{rev.text}"</p>
              <div className="mt-4 border-t border-[#f0eae4] pt-3 flex items-center justify-between text-xs">
                <span className="font-bold text-brand-ink">{rev.author}</span>
                <span className="text-brand-strong font-medium text-[11px] bg-brand-soft/50 px-2 py-0.5 rounded-full">{rev.pet}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN INFERIOR 2: PRODUCTOS RELACIONADOS */}
      <section aria-labelledby="related-title" className="mt-16 pt-10 border-t border-[#e6dcd3]">
        <h2 id="related-title" className="font-display text-2xl sm:text-3xl font-bold text-brand-ink">
          {t.product.relatedProducts}
        </h2>
        <p className="mt-1 text-sm text-brand-ink/70">
          {isEn ? 'Other handcrafted pet tags you might love.' : 'Otras siluetas y acabados que le encantarán a tu mascota.'}
        </p>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products
            .filter((p) => p.handle !== product.handle && p.collections.includes('tag-cat'))
            .slice(0, 4)
            .map((item) => (
              <div key={item.handle} className="rounded-2xl border border-[#e6dcd3] bg-white p-3 shadow-xs hover:border-brand transition-colors">
                <Link to={`/producto/${item.handle}`} className="block aspect-square overflow-hidden rounded-xl bg-brand-cream/60">
                  <img
                    src={image(productImage(item))}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="mt-3">
                  <h3 className="font-bold text-sm text-brand-ink truncate">
                    <Link to={`/producto/${item.handle}`} className="hover:text-brand transition-colors">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm font-bold text-brand-ink">{formatPrice(item.priceFrom)}</p>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* MOBILE STICKY ACTION BAR (Aparece fijo abajo en móviles) */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden border-t border-[#e6dcd3] bg-white/95 backdrop-blur-md px-4 py-3 shadow-xl">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-brand-ink">
              {tagStudioValue.name.trim() || product.title} · {tagStudioValue.finish.replace('Custom ', '')}
            </p>
            <p className="text-sm font-bold text-brand-strong">
              {formatPrice(product.priceFrom * quantity)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canPurchase}
            className="h-11 px-6 inline-flex items-center justify-center rounded-xl bg-brand text-sm font-bold text-white shadow-md hover:bg-brand-strong transition-all disabled:opacity-40"
          >
            {t.product.addToCartShort}
          </button>
        </div>
      </div>
    </div>
  );
}
