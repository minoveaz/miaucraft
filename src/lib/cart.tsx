import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartContextValue, CartLine } from '../types/cart';

export type { CartLine, CartContextValue };

export function cartLineKey(line: Pick<CartLine, 'handle' | 'options'>): string {
  const options = Object.entries(line.options ?? {}).sort(([left], [right]) => left.localeCompare(right));
  return `${line.handle}:${JSON.stringify(options)}`;
}

const STORAGE_KEY = 'miaucraft-cart';
const MAX_QUANTITY = 10;
const FREE_SHIPPING_THRESHOLD = 50;

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStoredCart);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const clampQuantity = (quantity: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)));
    const count = lines.reduce((total, line) => total + line.quantity, 0);
    const subtotal = lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0);
    const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const freeShippingProgressPct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

    return {
      lines,
      count,
      subtotal,
      currency: 'USD',
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      remainingForFreeShipping,
      freeShippingProgressPct,
      hasFreeShipping,
      isDrawerOpen,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
      toggleDrawer: () => setIsDrawerOpen((prev) => !prev),
      addLine: (line, quantity = 1, openDrawerOnAdd = true) => {
        setLines((current) => {
          const key = cartLineKey(line);
          const existing = current.find((item) => cartLineKey(item) === key);
          if (existing) {
            return current.map((item) =>
              cartLineKey(item) === key
                ? { ...item, quantity: clampQuantity(item.quantity + quantity) }
                : item,
            );
          }
          return [...current, { ...line, quantity: clampQuantity(quantity) }];
        });
        if (openDrawerOnAdd) {
          setIsDrawerOpen(true);
        }
      },
      setQuantity: (lineKey, quantity) =>
        setLines((current) =>
          current.map((item) => (cartLineKey(item) === lineKey ? { ...item, quantity: clampQuantity(quantity) } : item)),
        ),
      removeLine: (lineKey) => setLines((current) => current.filter((item) => cartLineKey(item) !== lineKey)),
      clear: () => setLines([]),
    };
  }, [lines, isDrawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
}
