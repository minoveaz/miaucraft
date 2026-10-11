import { Link } from 'react-router-dom';
import { useCart } from '../lib/cart';
import { formatPrice, productImage, products } from '../lib/products';

export default function CartPage() {
  const { lines, count, subtotal, setQuantity, removeLine } = useCart();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
      <h1 className="font-display text-3xl font-semibold text-brand-ink">Tu carrito</h1>
      <p className="mt-2 text-sm text-brand-ink/60">{count} {count === 1 ? 'producto' : 'productos'}</p>

      {lines.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-brand-soft p-8 text-center">
          <p className="text-brand-ink/70">Tu carrito está vacío.</p>
          <Link
            to="/coleccion/bandanas"
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-brand-strong px-6 text-sm font-semibold text-white hover:bg-brand-ink"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <ul className="divide-y divide-brand-soft rounded-2xl border border-brand-soft px-4 sm:px-6">
            {lines.map((line) => {
              const product = products.find((item) => item.handle === line.handle);
              return (
                <li key={line.handle} className="flex flex-wrap items-center gap-4 py-5 sm:flex-nowrap">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-cream">
                    {product && (
                      <img src={productImage(product)} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link to={`/producto/${line.handle}`} className="font-semibold text-brand-ink hover:text-brand-strong">
                      {line.title}
                    </Link>
                    <p className="mt-1 text-sm text-brand-ink/70">{formatPrice(line.unitPrice)} cada uno</p>
                    <div className="mt-3 flex items-center gap-3">
                      <label htmlFor={`quantity-${line.handle}`} className="text-sm text-brand-ink/70">Cantidad</label>
                      <input
                        id={`quantity-${line.handle}`}
                        type="number"
                        min={1}
                        max={10}
                        value={line.quantity}
                        onChange={(event) => setQuantity(line.handle, Number(event.target.value))}
                        className="h-9 w-16 rounded-md border border-brand-ink/20 text-center"
                      />
                      <button
                        type="button"
                        onClick={() => removeLine(line.handle)}
                        className="text-sm text-brand-strong underline hover:text-brand-ink"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <p className="font-semibold text-brand-ink">{formatPrice(line.unitPrice * line.quantity)}</p>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit rounded-2xl border border-brand-soft p-5">
            <h2 className="font-display text-xl font-semibold text-brand-ink">Resumen</h2>
            <div className="mt-5 flex justify-between border-b border-brand-soft pb-4 text-sm">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-4 text-xs leading-5 text-brand-ink/60">
              Envío e impuestos no están calculados. Este carrito es una vista previa local, no un pedido real.
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
    </div>
  );
}
