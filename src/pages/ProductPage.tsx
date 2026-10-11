import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../lib/cart';
import { collectionLinks } from '../lib/navigation';
import { formatPrice, productImage, products } from '../lib/products';
import StaticPage from './StaticPage';

export default function ProductPage() {
  const { handle } = useParams();
  const product = products.find((p) => p.handle === handle);
  const { addLine } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return <StaticPage title="Producto no encontrado" body="Este producto ya no está disponible." />;
  }

  const collection = collectionLinks.find((item) => item.handle === product.collections[0]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
      <nav aria-label="Migas de pan" className="mb-6 text-sm text-brand-ink/60">
        <Link to="/" className="hover:text-brand-strong">Inicio</Link>
        <span aria-hidden="true"> / </span>
        <Link to={`/coleccion/${product.collections[0]}`} className="hover:text-brand-strong">
          {collection?.title ?? 'Colección'}
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{product.title}</span>
      </nav>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="overflow-hidden rounded-2xl bg-brand-cream">
          <img
            src={productImage(product)}
            alt=""
            className="aspect-square w-full object-cover"
          />
        </div>
        <section className="flex flex-col items-start">
          <h1 className="font-display text-3xl font-semibold text-brand-ink sm:text-4xl">{product.title}</h1>
          <p className="mt-3 text-2xl font-semibold text-brand-ink">{formatPrice(product.priceFrom)}</p>
          <p className="mt-5 text-sm leading-6 text-brand-ink/70">
            Este producto forma parte del catálogo de muestra de Miaucraft. Los detalles, variantes e inventario deben
            confirmarse en la tienda conectada.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <label htmlFor="product-quantity" className="sr-only">Cantidad</label>
            <div className="flex h-11 items-center rounded-full border border-brand-ink/20">
              <button
                type="button"
                aria-label="Reducir cantidad"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="h-full w-10 rounded-l-full hover:bg-brand-soft"
              >
                −
              </button>
              <input
                id="product-quantity"
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (Number.isFinite(next)) setQuantity(Math.min(10, Math.max(1, Math.floor(next))));
                }}
                className="w-12 appearance-none text-center outline-none"
              />
              <button
                type="button"
                aria-label="Aumentar cantidad"
                onClick={() => setQuantity((current) => Math.min(10, current + 1))}
                className="h-full w-10 rounded-r-full hover:bg-brand-soft"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                addLine({ handle: product.handle, title: product.title, unitPrice: product.priceFrom }, quantity);
                setAdded(true);
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-strong px-6 text-sm font-semibold text-white hover:bg-brand-ink"
            >
              Añadir al carrito · {formatPrice(product.priceFrom * quantity)}
            </button>
          </div>
          {added && (
            <p role="status" className="mt-3 text-sm text-brand-strong">
              Añadido al carrito de demostración. <Link to="/carrito" className="font-semibold underline">Ver carrito</Link>
            </p>
          )}
          <div className="mt-8 w-full rounded-xl border border-brand-soft p-5">
            <h2 className="font-semibold text-brand-ink">Información</h2>
            <p className="mt-2 text-sm leading-6 text-brand-ink/70">
              El precio mostrado procede del catálogo de muestra. El checkout y los datos en tiempo real de Shopify
              todavía no están conectados.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
