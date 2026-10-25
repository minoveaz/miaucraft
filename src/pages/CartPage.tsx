import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Truck,
  Lock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import { cartLineKey, useCart } from '../lib/cart';
import { useTranslation } from '../hooks/useTranslation';
import { CartItem } from '../components/cart/CartItem';

export default function CartPage() {
  const {
    lines,
    count,
    subtotal,
    setQuantity,
    removeLine,
    remainingForFreeShipping,
    freeShippingProgressPct,
    hasFreeShipping,
  } = useCart();
  const { t, formatPrice, isEn } = useTranslation();
  const [orderNotes, setOrderNotes] = useState('');

  return (
    <div className="min-h-[70vh] bg-[#fbf9f6] py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Cabecera de la página */}
        <div className="border-b border-[#e6dcd3] pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <nav aria-label="Breadcrumb" className="mb-2">
                <ol className="flex items-center gap-2 text-xs text-brand-ink/60">
                  <li>
                    <Link to="/" className="hover:text-brand-strong transition-colors">
                      {isEn ? 'Home' : 'Inicio'}
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="font-semibold text-brand-ink">
                    {t.cart.title}
                  </li>
                </ol>
              </nav>
              <h1 className="font-display text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
                {t.cart.title}
              </h1>
            </div>
            {count > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-soft bg-white px-3.5 py-1 text-xs font-semibold text-brand-strong shadow-2xs">
                <ShoppingBag className="h-3.5 w-3.5" />
                {count} {count === 1 ? t.cart.itemCountSingle : t.cart.itemsCount}
              </span>
            )}
          </div>
        </div>

        {lines.length === 0 ? (
          /* Estado vacío */
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-[#e6dcd3] bg-white p-10 text-center shadow-xs sm:p-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-brand-strong mb-5">
              <ShoppingBag className="h-10 w-10 stroke-[1.75]" />
            </div>
            <h2 className="font-display text-xl font-bold text-brand-ink sm:text-2xl">
              {t.cart.emptyTitle}
            </h2>
            <p className="mt-2 max-w-md text-sm text-brand-ink/70">
              {t.cart.emptyDesc}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/coleccion/tag-cat"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-strong px-7 text-sm font-semibold text-white shadow-sm hover:bg-brand-ink transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                {t.cart.exploreCatalog}
              </Link>
            </div>
          </div>
        ) : (
          /* Carrito con productos */
          <div className="mt-8 space-y-8">
            {/* Barra de progreso de envío gratis */}
            <div className="rounded-2xl border border-brand-soft/80 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    hasFreeShipping ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-soft text-brand-strong'
                  }`}
                >
                  <Truck className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-brand-ink sm:text-sm">
                    {hasFreeShipping ? (
                      <span className="font-bold text-emerald-700">
                        {t.cart.freeShippingUnlocked}
                      </span>
                    ) : (
                      <>
                        <span>{t.cart.freeShippingRemainingPrefix} </span>
                        <strong className="font-bold text-brand-strong">
                          {formatPrice(remainingForFreeShipping)}
                        </strong>{' '}
                        <span>{t.cart.freeShippingRemainingSuffix}</span>
                      </>
                    )}
                  </p>
                  <div
                    role="progressbar"
                    aria-label={t.cart.freeShippingProgressLabel}
                    aria-valuenow={freeShippingProgressPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-brand-soft/50"
                  >
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        hasFreeShipping ? 'bg-emerald-500' : 'bg-brand'
                      }`}
                      style={{ width: `${freeShippingProgressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Layout principal en 2 columnas */}
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_390px] items-start">
              {/* Columna Izquierda: Lista de productos + Notas */}
              <div className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-[#e6dcd3] bg-white shadow-xs">
                  <div className="border-b border-[#e6dcd3] bg-brand-cream/50 px-5 py-3.5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-brand-ink/80">
                      {isEn ? 'Selected Products' : 'Productos seleccionados'} ({count})
                    </h2>
                  </div>
                  <div className="divide-y divide-[#e6dcd3] p-4 sm:p-5 space-y-4">
                    {lines.map((line) => {
                      const key = cartLineKey(line);
                      return (
                        <div key={key} className="pt-4 first:pt-0">
                          <CartItem
                            line={line}
                            lineKey={key}
                            onQuantityChange={(qty) => setQuantity(key, qty)}
                            onRemove={() => removeLine(key)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Notas de pedido opcionales */}
                <div className="rounded-2xl border border-[#e6dcd3] bg-white p-5 shadow-xs">
                  <label
                    htmlFor="order-notes"
                    className="block font-display text-sm font-semibold text-brand-ink"
                  >
                    {t.cart.orderNotesTitle}
                  </label>
                  <textarea
                    id="order-notes"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows={3}
                    placeholder={t.cart.orderNotesPlaceholder}
                    className="mt-2.5 w-full rounded-xl border border-[#cfc4bb] bg-brand-cream/20 p-3 text-xs text-brand-ink placeholder:text-brand-ink/40 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>

                {/* Tarjetas de confianza */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-xl border border-[#e6dcd3] bg-white p-3.5 shadow-2xs">
                    <ShieldCheck className="h-5 w-5 text-brand-strong shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-brand-ink">
                        {isEn ? 'Lifetime Engraving' : 'Grabado de Por Vida'}
                      </p>
                      <p className="text-[11px] text-brand-ink/60">
                        {isEn ? 'High-precision laser' : 'Láser de alta precisión'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-[#e6dcd3] bg-white p-3.5 shadow-2xs">
                    <Truck className="h-5 w-5 text-brand-strong shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-brand-ink">
                        {isEn ? 'Tracked Delivery' : 'Envío con Seguimiento'}
                      </p>
                      <p className="text-[11px] text-brand-ink/60">
                        {isEn ? 'Safe doorstep delivery' : 'Entrega directa a tu puerta'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-[#e6dcd3] bg-white p-3.5 shadow-2xs">
                    <HeartHandshake className="h-5 w-5 text-brand-strong shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-brand-ink">
                        {isEn ? '100% Cat-Approved' : 'Aprobado por Felinos'}
                      </p>
                      <p className="text-[11px] text-brand-ink/60">
                        {isEn ? 'Lightweight & hypoallergenic' : 'Ultraligero e hipoalergénico'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Resumen de Orden */}
              <aside className="sticky top-24 space-y-4">
                <div className="rounded-2xl border border-[#e6dcd3] bg-white p-6 shadow-xs">
                  <h2 className="font-display text-lg font-bold text-brand-ink">
                    {t.cart.orderSummary}
                  </h2>

                  <div className="mt-5 space-y-3 border-b border-[#e6dcd3] pb-4 text-sm">
                    <div className="flex justify-between text-brand-ink/80">
                      <span>{t.cart.subtotal}</span>
                      <span className="font-bold text-brand-ink">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-brand-ink/80">
                      <span>{t.cart.shipping}</span>
                      <span className={`font-semibold ${hasFreeShipping ? 'text-emerald-700' : 'text-brand-ink/70'}`}>
                        {hasFreeShipping ? t.cart.shippingFree : (isEn ? 'Calculated at checkout' : 'Calculado en checkout')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="font-display text-base font-bold text-brand-ink">
                      {isEn ? 'Total' : 'Total estimado'}
                    </span>
                    <span className="font-display text-2xl font-bold text-brand-strong">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] leading-relaxed text-brand-ink/60">
                    {t.cart.taxIncludedNote}
                  </p>

                  {/* Botón de Checkout */}
                  <Link
                    to="/checkout"
                    className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-strong px-6 text-sm font-bold text-white shadow-sm hover:bg-brand-ink transition-colors"
                  >
                    <Lock className="h-4 w-4" />
                    <span>{t.cart.proceedToCheckout}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/coleccion/tag-cat"
                    className="mt-3 block text-center text-xs font-semibold text-brand-ink/70 hover:text-brand-strong transition-colors"
                  >
                    {t.common.continueShopping}
                  </Link>

                  {/* Garantía de Seguridad Shopify */}
                  <div className="mt-6 flex items-center justify-center gap-1.5 rounded-lg border border-[#e6dcd3] bg-brand-cream/60 py-2.5 px-3 text-[11px] text-brand-ink/70">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-center">{t.cart.pciSecurityBadge}</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}