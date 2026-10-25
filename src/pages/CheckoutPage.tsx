import { Link } from 'react-router-dom';
import { useCart } from '../lib/cart';
import { useTranslation } from '../hooks/useTranslation';

export default function CheckoutPage() {
  const { lines, subtotal } = useCart();
  const { t, formatPrice, isEn } = useTranslation();

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="rounded-2xl border border-brand-soft p-6 sm:p-9">
        <p className="text-sm font-semibold text-brand-strong">
          {isEn ? 'Shopify Hosted Checkout' : 'Checkout alojado por Shopify'}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-brand-ink">
          {isEn ? 'Checkout Preview' : 'La compra aún no está disponible'}
        </h1>
        <p className="mt-4 leading-7 text-brand-ink/70">
          {isEn
            ? 'This preview storefront is not yet connected to the live Shopify Storefront API. In Phase 5, this page automatically redirects directly to Shopify’s encrypted, PCI-compliant checkout (Apple Pay, Shop Pay, PayPal).'
            : 'Esta vista previa no está conectada a Shopify Storefront todavía. En la Fase 5, este paso redirige directamente al checkout seguro de Shopify (Shop Pay, Apple Pay, tarjetas).'}
        </p>
        {lines.length > 0 && (
          <p className="mt-5 rounded-xl bg-brand-cream p-4 text-sm text-brand-ink">
            {lines.length} {isEn ? (lines.length === 1 ? 'item' : 'items') : (lines.length === 1 ? 'producto' : 'productos')} · {isEn ? 'Sample subtotal' : 'Subtotal de muestra'} {formatPrice(subtotal)}
          </p>
        )}
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to="/carrito"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-strong px-6 text-sm font-semibold text-white hover:bg-brand-ink"
          >
            {t.common.viewCart}
          </Link>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-ink/20 px-6 text-sm font-semibold text-brand-ink hover:bg-brand-cream"
          >
            {t.common.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
