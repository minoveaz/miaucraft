// Modelos de datos del carrito de compras (preparados para Shopify Storefront API)

export interface CartCustomAttribute {
  key: string;
  value: string;
}

export interface CartLine {
  id?: string;
  merchandiseId?: string; // GID de Shopify Variant
  handle: string;
  title: string;
  unitPrice: number;
  quantity: number;
  image?: string;
  options?: Record<string, string>;
  attributes?: CartCustomAttribute[];
}

export interface CartTotals {
  count: number;
  subtotal: number;
  currency: string;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
  freeShippingProgressPct: number;
  hasFreeShipping: boolean;
}

export interface CartContextValue extends CartTotals {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, 'quantity'>, quantity?: number, openDrawerOnAdd?: boolean) => void;
  setQuantity: (lineKey: string, quantity: number) => void;
  removeLine: (lineKey: string) => void;
  clear: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}
