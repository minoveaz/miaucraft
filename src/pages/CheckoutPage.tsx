import { Link } from 'react-router-dom';
import { useCart } from '../lib/cart';
import { formatPrice } from '../lib/products';

export default function CheckoutPage() {
  const { lines, subtotal } = useCart();

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="rounded-2xl border border-brand-soft p-6 sm:p-9">
        <p className="text-sm font-semibold text-brand-strong">Checkout alojado por Shopify</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-brand-ink">La compra aún no está disponible</h1>
        <p className="mt-4 leading-7 text-brand-ink/70">
          Esta vista previa no está conectada a Shopify Storefront, así que no puede crear un carrito ni abrir un checkout
          seguro. No se ha iniciado ningún pedido ni se ha procesado ningún pago.
        </p>
        {lines.length > 0 && (
          <p className="mt-5 rounded-xl bg-brand-cream p-4 text-sm text-brand-ink">
            {lines.length} {lines.length === 1 ? 'producto' : 'productos'} en el carrito · subtotal de muestra {formatPrice(subtotal)}
          </p>
        )}
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/carrito"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-strong px-6 text-sm font-semibold text-white hover:bg-brand-ink"
          >
            Volver al carrito
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-ink/20 px-6 text-sm font-semibold text-brand-ink hover:bg-brand-cream"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
