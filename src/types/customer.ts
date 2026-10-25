// Tipos de datos para el módulo de cliente de Miaucraft (compatible con Shopify Customer API)

export interface UserAddress {
  id: string;
  label: string; // Ej: "Casa", "Oficina", "Residencia de Verano"
  recipientName: string;
  phone: string;
  street: string;
  apartment?: string;
  postalCode: string;
  city: string;
  province: string;
  country: string; // ISO 2-letter, e.g. "ES", "US", "MX"
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export interface UserBillingTaxDetails {
  companyName?: string;
  taxId?: string; // NIF / CIF / RFC / Tax ID
  fiscalAddress?: string;
}

export interface CustomerUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  preferredLocale: 'es' | 'en';
  newsletterSubscribed: boolean;
  createdAt: string;
  addresses: UserAddress[];
  billingDetails?: UserBillingTaxDetails;
  catProfile?: {
    catName: string;
    breed?: string;
    favoriteColor?: string;
  };
}

export type OrderStatus = 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  variantId?: string;
  productName: {
    es: string;
    en: string;
  };
  variantName: {
    es: string;
    en: string;
  };
  productHandle: string;
  image: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  engravedDetails?: Record<string, string>;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string; // Ej: "MC-2026-9842"
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: UserAddress;
  carrierName?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  invoicePdfUrl?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  newsletterSubscribed?: boolean;
}

export interface AuthContextValue {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  orders: CustomerOrder[];
  wishlist: string[]; // handles de productos
  login: (email: string, password?: string) => Promise<boolean>;
  loginAsDemo: () => void;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (data: Partial<CustomerUser>) => Promise<boolean>;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<UserAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultShippingAddress: (id: string) => void;
  toggleWishlist: (productHandle: string) => void;
  isInWishlist: (productHandle: string) => boolean;
  lookupGuestOrder: (email: string, orderNumber: string) => CustomerOrder | null;
}
