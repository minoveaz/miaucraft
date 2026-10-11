import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { collectionLinks } from '../lib/navigation';
import { formatPrice, productImage, products, type Product } from '../lib/products';
import { useCart } from '../lib/cart';
import TagStudio, { type TagStudioValue } from '../components/shop/TagStudio';
import StaticPage from './StaticPage';

const base = import.meta.env.BASE_URL;
const image = (file: string) => `${base}images/${encodeURI(file)}`;

function ProductGallery({ product }: { product: Product }) {
  const media = product.media ?? [{ image: productImage(product), alt: product.title }];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = media[selectedIndex] ?? media[0];

  return (
    <section aria-label={`Imágenes de ${product.title}`}>
      <div className="grid gap-3 md:grid-cols-[72px_minmax(0,1fr)] lg:grid-cols-[84px_minmax(0,1fr)]">
        <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col">
          {media.map((item, index) => (
            <button
              key={item.image}
              type="button"
              aria-label={`Ver imagen ${index + 1}: ${item.alt}`}
              aria-pressed={selectedIndex === index}
              onClick={() => setSelectedIndex(index)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:h-[72px] md:w-[72px] lg:h-[84px] lg:w-[84px] ${
                selectedIndex === index ? 'border-brand' : 'border-transparent'
              }`}
            >
              <img src={image(item.image)} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <div className="order-1 aspect-square overflow-hidden rounded-2xl bg-brand-cream md:order-2 md:aspect-[1.2/1]">
          <img
            key={selected.image}
            src={image(selected.image)}
            alt={selected.alt}
            width={1200}
            height={1000}
            fetchPriority="high"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}

function ProductDetails({ product }: { product: Product }) {
  const { addLine } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [personalization, setPersonalization] = useState('');
  const [personalizationStyle, setPersonalizationStyle] = useState('');
  const [tagStudioValue, setTagStudioValue] = useState<TagStudioValue>(() => ({
    design: product.tagStudio?.defaultDesign ?? product.tagStudio?.designs[0]?.value ?? '',
    finish: '',
    name: '',
    font: product.tagStudio?.defaultFont ?? product.tagStudio?.fonts[0]?.value ?? '',
    phone: '',
  }));
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries((product.options ?? []).map((option) => [option.name, option.values[0]?.value ?? ''])),
  );
  const tagStudioReady = Boolean(
    product.tagStudio
      && tagStudioValue.design
      && tagStudioValue.finish
      && tagStudioValue.name.trim()
      && tagStudioValue.font,
  );
  const canPurchase = !product.tagStudio || tagStudioReady;
  const tagStudioOptions = product.tagStudio
    ? {
        'Diseño del tag': product.tagStudio.designs.find((item) => item.value === tagStudioValue.design)?.label ?? tagStudioValue.design,
        Acabado: tagStudioValue.finish,
        'Nombre grabado': tagStudioValue.name.trim(),
        Tipografía: tagStudioValue.font,
        ...(product.tagStudio.phoneEnabled && tagStudioValue.phone.trim()
          ? { Teléfono: tagStudioValue.phone.trim() }
          : {}),
      }
    : {};
  const cartOptions = {
    ...selectedOptions,
    ...(product.tagStudio
      ? tagStudioOptions
      : product.personalization && personalizationStyle
      ? {
          [product.personalization.label]: personalizationStyle,
          ...(personalization.trim() ? { 'Texto grabado': personalization.trim() } : {}),
        }
      : {}),
  };
  const purchaseHighlights = product.purchaseHighlights ?? [
    'Envío gratis en pedidos superiores a $50',
    'Política de devolución de 14 días',
  ];

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
              {product.rating.toFixed(1)} ({product.reviewCount} reseñas)
            </a>
          </div>
        )}
        {product.personalization && !product.badge && (
          <span className="rounded-full bg-brand-soft px-2 py-1 text-[11px] font-bold text-brand-strong">
            Personalizable
          </span>
        )}
      </div>

      <h1 id="product-title" className="mt-3 font-display text-3xl font-bold leading-tight text-brand-ink sm:text-4xl">
        {product.title}
      </h1>
      {product.description && <p className="mt-3 text-sm leading-6 text-brand-ink/70">{product.description}</p>}
      <p className="mt-5 text-2xl font-bold text-brand-ink">{formatPrice(product.priceFrom)}</p>

      {product.options?.map((option) => (
        <fieldset key={option.name} className="mt-5">
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
                  onClick={() => {
                    setSelectedOptions((current) => ({ ...current, [option.name]: value.value }));
                    setAdded(false);
                  }}
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

      {product.tagStudio ? (
        <TagStudio
          config={product.tagStudio}
          value={tagStudioValue}
          onChange={(value) => {
            setTagStudioValue(value);
            setAdded(false);
          }}
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
            Texto grabado
          </label>
          <input
            id="product-personalization"
            type="text"
            value={personalization}
            onChange={(event) => {
              setPersonalization(event.target.value);
              setAdded(false);
            }}
            placeholder="Escribe el nombre"
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
            Guía de tallas
          </h2>
          <p className="mt-1 text-sm text-brand-ink/70">
            Mide el contorno del cuello de tu mascota antes de elegir la bandana.
          </p>
          <img
            src={image('9_guia blog.png')}
            alt="Guía visual para medir el cuello de una mascota"
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
            aria-label="Reducir cantidad"
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="flex h-8 w-8 items-center justify-center rounded text-brand-ink hover:bg-brand-cream disabled:opacity-40"
          >
            <Minus aria-hidden="true" className="h-4 w-4" />
          </button>
          <span aria-live="polite" className="min-w-5 text-center text-sm">{quantity}</span>
          <button
            type="button"
            aria-label="Aumentar cantidad"
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
          <span className="sm:hidden">Añadir · {formatPrice(product.priceFrom)}</span>
          <span className="hidden sm:inline">Añadir al carrito · {formatPrice(product.priceFrom)}</span>
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
        Comprar ahora
      </button>
      {added && (
        <p role="status" className="mt-3 text-sm font-medium text-brand-strong">
          Añadido al carrito. <Link to="/carrito" className="underline">Ver carrito</Link>
        </p>
      )}

      <ul className="mt-4 grid gap-2 text-xs leading-5 text-brand-ink/70 sm:grid-cols-3">
        {purchaseHighlights.map((highlight) => (
          <li key={highlight} className="rounded-lg border border-[#e6dcd3] bg-white px-3 py-2">
            {highlight}
          </li>
        ))}
      </ul>

      <div className="mt-6 overflow-hidden rounded-xl border border-[#e6dcd3] bg-white">
        {(product.details ?? [
          { title: 'Descripción', content: product.description ?? `Detalles de ${product.title}.` },
          { title: 'Medidas y ajuste', content: 'Consulta las opciones disponibles de este producto.' },
          { title: 'Materiales y cuidado', content: 'Consulta los detalles del producto antes de comprar.' },
          { title: 'Envíos y devoluciones', content: 'Envío gratis en pedidos superiores a $50. Devoluciones durante los 14 días posteriores a la compra.' },
        ]).map((detail) => (
          <details key={detail.title} className="group border-b border-[#e6dcd3] last:border-b-0">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
              {detail.title}
              <Plus aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-ink transition-transform group-open:rotate-45" />
            </summary>
            <p className="px-4 pb-4 text-sm leading-6 text-brand-ink/70">{detail.content}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function ProductReviews({ product }: { product: Product }) {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="mt-12 grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10">
      <div className="rounded-[14px] border border-[#e6dcd3] bg-white p-5 sm:p-6">
        <h2 id="reviews-title" className="font-display text-2xl font-semibold text-brand-ink">Reseñas</h2>
        {product.rating !== undefined && product.reviewCount !== undefined ? (
          <>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-4xl font-bold text-brand-ink">{product.rating.toFixed(1)}</span>
              <div>
                <span className="tracking-[2px] text-brand" aria-hidden="true">
                  {'★'.repeat(Math.round(product.rating))}
                  {'☆'.repeat(5 - Math.round(product.rating))}
                </span>
                <p className="text-xs text-brand-ink/70">{product.reviewCount} reseñas</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-brand-ink/70">Opiniones de clientes sobre este producto.</p>
          </>
        ) : (
          <p className="mt-3 text-sm leading-6 text-brand-ink/70">Todavía no hay reseñas para este producto.</p>
        )}
      </div>
      <div className="rounded-[14px] border border-[#e6dcd3] bg-white p-5 sm:p-6">
        {product.rating !== undefined && product.reviewCount !== undefined ? (
          <p className="text-sm text-brand-ink/70">Las opiniones verificadas aparecerán aquí.</p>
        ) : (
          <div className="flex h-full min-h-24 items-center justify-center text-center text-sm text-brand-ink/70">
            Comparte tu experiencia cuando las reseñas estén disponibles.
          </div>
        )}
      </div>
    </section>
  );
}

function RelatedProducts({ product }: { product: Product }) {
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
        Completa el look
      </h2>
      <p className="mt-1 text-sm text-brand-ink/70">Descubre otros accesorios para tu mascota.</p>
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
  const collection = collectionLinks.find((item) => product.collections.includes(item.handle));

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <nav aria-label="Ruta de navegación" className="mb-5 text-xs text-brand-ink/70 sm:text-sm">
        <Link to="/" className="hover:text-brand-strong hover:underline">Inicio</Link>
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

      <div className="grid items-start gap-7 md:gap-10 lg:grid-cols-[minmax(0,1fr)_440px] xl:gap-12">
        <ProductGallery product={product} />
        <ProductDetails key={product.handle} product={product} />
      </div>

      <ProductReviews product={product} />
      <RelatedProducts product={product} />
    </div>
  );
}

export default function ProductPage() {
  const { handle } = useParams();
  const product = products.find((item) => item.handle === handle);

  if (!product) {
    return <StaticPage title="Producto no encontrado" body="Este producto ya no está disponible." />;
  }

  return <ProductDetail key={product.handle} product={product} />;
}
