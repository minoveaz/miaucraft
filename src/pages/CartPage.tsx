import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { cartLineKey, useCart } from '../lib/cart';
import { formatPrice, productImage, products } from '../lib/products';

const base = import.meta.env.BASE_URL;

export default function CartPage() {
  const { lines, count, subtotal, setQuantity, removeLine } = useCart();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-3xl font-bold text-brand-ink">Tu carrito</h1>
      <p className="mt-2 text-sm text-brand-ink/60">{count} {count === 1 ? 'producto' : 'productos'}</p>
      {lines.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-brand-soft bg-white p-6 sm:p-8">
          <p className="text-brand-ink/70">Tu carrito está vacío.</p>
          <Link
            to="/coleccion/bandanas"
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-brand-strong px-6 text-sm font-semibold text-white hover:bg-brand-ink"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
          <ul className="divide-y divide-brand-soft rounded-2xl border border-brand-soft bg-white px-4 sm:px-6">
            {lines.map((line) => {
              const product = products.find((item) => item.handle === line.handle);
              const lineKey = cartLineKey(line);
              return (
                <li key={lineKey} className="flex flex-wrap gap-4 py-5 sm:flex-nowrap sm:gap-6">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-cream sm:h-24 sm:w-24">
                    {product && (
                      <img
                        src={`${base}images/${productImage(product)}`}
                        alt=""
                        width={160}
                        height={160}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link to={`/producto/${line.handle}`} className="font-semibold text-brand-ink hover:text-brand-strong">
                      {line.title}
                    </Link>
                    <p className="mt-1 text-sm text-brand-ink/70">{formatPrice(line.unitPrice)} cada uno</p>
                    {line.options && Object.keys(line.options).length > 0 && (
                      <ul className="mt-1 space-y-0.5 text-xs text-brand-ink/70">
                        {Object.entries(line.options).map(([name, value]) => (
                          <li key={name}>{name}: {value}</li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Reducir cantidad de ${line.title}`}
                        onClick={() => setQuantity(lineKey, line.quantity - 1)}
                        className="rounded border border-brand-soft p-1.5 text-brand-ink hover:border-brand"
                      >
                        <Minus aria-hidden="true" className="h-4 w-4" />
                      </button>
                      <span aria-live="polite" className="min-w-5 text-center text-sm">{line.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Aumentar cantidad de ${line.title}`}
                        onClick={() => setQuantity(lineKey, line.quantity + 1)}
                        className="rounded border border-brand-soft p-1.5 text-brand-ink hover:border-brand"
                      >
                        <Plus aria-hidden="true" className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Eliminar ${line.title} del carrito`}
                        onClick={() => removeLine(lineKey)}
                        className="ml-1 p-1.5 text-brand-ink/60 hover:text-brand"
                      >
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="shrink-0 font-semibold text-brand-ink">
                    {formatPrice(line.unitPrice * line.quantity)}
                  </p>
                </li>
              );
            })}
          </ul>
          <aside className="h-fit rounded-2xl border border-brand-soft bg-white p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-brand-ink">Resumen</h2>
            <div className="mt-5 flex justify-between border-b border-brand-soft pb-4 text-sm">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-4 text-xs leading-5 text-brand-ink/60">
              Envío e impuestos no están calculados. Esta vista previa no procesa pedidos; el checkout de Shopify estará disponible al conectar la tienda.
            </p>
            <Link
              to="/checkout"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-strong px-5 text-sm font-semibold text-white hover:bg-brand-ink"
            >
              Continuar al checkout
            </Link>
            <Link to="/" className="mt-4 block text-center text-sm font-medium text-brand-strong hover:underline">
              Seguir explorando
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
