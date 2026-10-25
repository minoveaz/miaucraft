import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartLine } from '../../types/cart';
import { productImage, products } from '../../lib/products';
import { useTranslation } from '../../hooks/useTranslation';

const base = import.meta.env.BASE_URL;

interface CartItemProps {
  line: CartLine;
  lineKey: string;
  onQuantityChange: (qty: number) => void;
  onRemove: () => void;
  compact?: boolean;
}

export function CartItem({
  line,
  onQuantityChange,
  onRemove,
  compact = false,
}: CartItemProps) {
  const { t, formatPrice } = useTranslation();
  const product = products.find((item) => item.handle === line.handle);
  const imageSrc = line.image || (product ? `${base}images/${productImage(product)}` : '');

  const lineTotal = line.unitPrice * line.quantity;
  const optionsEntries = Object.entries(line.options ?? {});

  return (
    <div className={`group flex gap-3.5 rounded-xl border border-[#e6dcd3] bg-white p-3 sm:gap-4 sm:p-4 shadow-2xs transition-all hover:border-brand/40 ${compact ? 'text-xs' : ''}`}>
      {/* Miniatura */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[#e6dcd3] bg-brand-cream sm:h-22 sm:w-22">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={line.title}
            width={120}
            height={120}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-soft text-[10px] text-brand-strong">
            Miaucraft
          </div>
        )}
      </div>

      {/* Detalles del producto */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/producto/${line.handle}`}
              className="font-display text-sm font-semibold text-brand-ink hover:text-brand-strong line-clamp-1"
            >
              {line.title}
            </Link>
            <button
              type="button"
              onClick={onRemove}
              className="p-1 text-brand-ink/40 hover:text-red-600 transition-colors"
              title={t.cart.remove}
              aria-label={`${t.cart.remove} ${line.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-0.5 text-xs text-brand-ink/70">
            {formatPrice(line.unitPrice)} <span className="text-[11px] text-brand-ink/50">/ {t.cart.each}</span>
          </p>

          {/* Opciones y personalización de grabado */}
          {optionsEntries.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {optionsEntries.map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center rounded-md border border-[#e6dcd3] bg-brand-cream/80 px-2 py-0.5 text-[10px] text-brand-ink/80"
                >
                  <strong className="font-semibold text-brand-ink mr-1">{key}:</strong> {value}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Selector de cantidad y total de línea */}
        <div className="mt-3 flex items-center justify-between pt-1">
          <div className="inline-flex items-center rounded-lg border border-[#cfc4bb] bg-white shadow-2xs">
            <button
              type="button"
              onClick={() => onQuantityChange(line.quantity - 1)}
              aria-label={`${t.product.decreaseQuantity}: ${line.title}`}
              className="flex h-7 w-7 items-center justify-center text-brand-ink/70 hover:bg-brand-soft hover:text-brand-strong transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-6 text-center text-xs font-bold text-brand-ink tabular-nums">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(line.quantity + 1)}
              aria-label={`${t.product.increaseQuantity}: ${line.title}`}
              className="flex h-7 w-7 items-center justify-center text-brand-ink/70 hover:bg-brand-soft hover:text-brand-strong transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <span className="font-display text-sm font-bold text-brand-strong">
            {formatPrice(lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
