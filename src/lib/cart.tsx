import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

// Carrito local de demo. Se sustituye por el carrito de Shopify (Storefront API) al conectar la tienda.
export interface CartLine {
  handle: string;
  title: string;
  unitPrice: number;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  addLine: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void;
  setQuantity: (handle: string, quantity: number) => void;
  removeLine: (handle: string) => void;
  clear: () => void;
}

const STORAGE_KEY = 'miaucraft-cart';
const MAX_QUANTITY = 10;

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

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const value = useMemo<CartContextValue>(() => {
    const clampQuantity = (quantity: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)));
    return {
      lines,
      count: lines.reduce((total, line) => total + line.quantity, 0),
      subtotal: lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0),
      addLine: (line, quantity = 1) =>
        setLines((current) => {
          const existing = current.find((item) => item.handle === line.handle);
          if (existing) {
            return current.map((item) =>
              item.handle === line.handle
                ? { ...item, quantity: clampQuantity(item.quantity + quantity) }
                : item,
            );
          }
          return [...current, { ...line, quantity: clampQuantity(quantity) }];
        }),
      setQuantity: (handle, quantity) =>
        setLines((current) =>
          current.map((item) => (item.handle === handle ? { ...item, quantity: clampQuantity(quantity) } : item)),
        ),
      removeLine: (handle) => setLines((current) => current.filter((item) => item.handle !== handle)),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
}
