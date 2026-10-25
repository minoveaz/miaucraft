import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { cartLineKey, useCart } from '../../lib/cart';
import { useTranslation } from '../../hooks/useTranslation';
import { CartItem } from './CartItem';

export function CartDrawer() {
  const {
    lines,
    count,
    subtotal,
    isDrawerOpen,
    closeDrawer,
    setQuantity,
    removeLine,
    remainingForFreeShipping,
    freeShippingProgressPct,
    hasFreeShipping,
  } = useCart();
  const { t, formatPrice, isEn } = useTranslation();
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on ESC and trap body scroll
  useEffect(() => {
    if (!isDrawerOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const handleViewCart = () => {
    closeDrawer();
    navigate('/carrito');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform animate-in slide-in-from-right duration-250"
      >
        {/* Header */}
        <div className="border-b border-[#e6dcd3] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 id="cart-drawer-title" className="font-display text-lg font-bold text-brand-ink">
                {t.cart.title}
              </h2>
              <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-bold text-brand-strong">
                {count} {count === 1 ? t.cart.itemCountSingle : t.cart.itemsCount}
              </span>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label={isEn ? 'Close cart' : 'Cerrar carrito'}
              className="rounded-lg p-1.5 text-brand-ink/60 hover:bg-brand-cream hover:text-brand-ink transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Barra de progreso de envío gratuito estilo Inhand */}
          <div className="mt-3.5 rounded-xl border border-[#e6dcd3] bg-brand-cream/60 p-3">
            <div className="flex items-center gap-2 text-xs font-medium text-brand-ink">
              <Truck className={`h-4 w-4 shrink-0 ${hasFreeShipping ? 'text-emerald-600' : 'text-brand'}`} />
              {hasFreeShipping ? (
                <span className="font-bold text-emerald-700">
                  {t.cart.freeShippingUnlocked}
                </span>
              ) : (
                <span>
                  {t.cart.freeShippingRemainingPrefix}{' '}
                  <strong className="font-bold text-brand-strong">
                    {formatPrice(remainingForFreeShipping)}
                  </strong>{' '}
                  {t.cart.freeShippingRemainingSuffix}
                </span>
              )}
            </div>

            <div
              className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#e6dcd3]/80"
              role="progressbar"
              aria-valuenow={freeShippingProgressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t.cart.freeShippingProgressLabel}
            >
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  hasFreeShipping ? 'bg-emerald-500' : 'bg-brand'
                }`}
                style={{ width: `${freeShippingProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Listado de Artículos */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-4 py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand-strong mb-4">
                <ShoppingBag className="h-8 w-8" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-base font-bold text-brand-ink">
                {t.cart.emptyTitle}
              </h3>
              <p className="mt-1.5 text-xs text-brand-ink/70 max-w-xs leading-relaxed">
                {t.cart.emptyDesc}
              </p>
              <button
                type="button"
                onClick={() => {
                  closeDrawer();
                  navigate('/coleccion/tag-cat');
                }}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-strong px-6 text-xs font-bold text-white hover:bg-brand-ink shadow-xs transition-colors"
              >
                {t.cart.exploreCatalog}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {lines.map((line) => {
                const lineKey = cartLineKey(line);
                return (
                  <CartItem
                    key={lineKey}
                    line={line}
                    lineKey={lineKey}
                    onQuantityChange={(qty) => setQuantity(lineKey, qty)}
                    onRemove={() => removeLine(lineKey)}
                    compact
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Footer con Resumen y Checkout */}
        {lines.length > 0 && (
          <div className="border-t border-[#e6dcd3] bg-white p-4 sm:p-5 space-y-3 shadow-[0_-4px_16px_rgba(16,16,16,0.04)]">
            <div className="space-y-1.5 text-xs text-brand-ink/75">
              <div className="flex justify-between">
                <span>{t.cart.subtotal}</span>
                <span className="font-bold text-brand-ink text-sm">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t.cart.shipping}</span>
                <span className="font-semibold text-brand-strong">
                  {hasFreeShipping ? t.cart.shippingFree : (isEn ? 'Calculated at checkout' : 'Calculado en checkout')}
                </span>
              </div>
              <p className="text-[11px] text-brand-ink/60 pt-0.5">
                {t.cart.taxIncludedNote}
              </p>
            </div>

            {/* Botón principal: Ver carrito */}
            <button
              type="button"
              onClick={handleViewCart}
              className="group flex min-h-12 w-full items-center justify-between rounded-full bg-brand-strong px-5 text-sm font-bold text-white shadow-xs hover:bg-brand-ink transition-all"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span>{t.common.viewCart}</span>
              </span>
              <span className="flex items-center gap-1.5 font-display">
                <span>{formatPrice(subtotal)}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            {/* Insignia de seguridad PCI / Shopify */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-ink/60 pt-1 text-center">
              <ShieldCheck className="h-3.5 w-3.5 text-brand shrink-0" />
              <span>{t.cart.pciSecurityBadge}</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
