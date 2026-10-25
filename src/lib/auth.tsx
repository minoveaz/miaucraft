import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react';
import type {
  CustomerUser,
  CustomerOrder,
  UserAddress,
  RegisterData,
  AuthContextValue,
} from '../types/customer';

const STORAGE_KEY_USER = 'miaucraft_user_session';
const STORAGE_KEY_ORDERS = 'miaucraft_user_orders';
const STORAGE_KEY_WISHLIST = 'miaucraft_user_wishlist';

export const DEMO_USER: CustomerUser = {
  id: 'usr-chloe-vance',
  email: 'chloe.vance@example.com',
  firstName: 'Chloe',
  lastName: 'Vance',
  phone: '+1 (415) 890-3421',
  preferredLocale: 'en',
  newsletterSubscribed: true,
  createdAt: '2026-03-10T09:30:00Z',
  catProfile: {
    catName: 'Mochi',
    breed: 'Ragdoll',
    favoriteColor: 'Gold',
  },
  addresses: [
    {
      id: 'addr-01',
      label: 'Home (Mochi)',
      recipientName: 'Chloe Vance',
      phone: '+1 (415) 890-3421',
      street: '1450 Mission St, Apt 4B',
      apartment: 'SoMa District',
      postalCode: '94103',
      city: 'San Francisco',
      province: 'California',
      country: 'US',
      isDefaultShipping: true,
      isDefaultBilling: true,
    },
    {
      id: 'addr-02',
      label: 'Design Studio',
      recipientName: 'Chloe Vance · Vance Creative Co.',
      phone: '+1 (415) 890-3421',
      street: '580 Howard St, Suite 200',
      postalCode: '94105',
      city: 'San Francisco',
      province: 'California',
      country: 'US',
      isDefaultShipping: false,
      isDefaultBilling: false,
    },
  ],
  billingDetails: {
    companyName: 'Vance Creative Design LLC',
    taxId: 'EIN: 94-3829104',
    fiscalAddress: '1450 Mission St, Apt 4B, San Francisco, CA 94103',
  },
};

export const DEMO_ORDERS: CustomerOrder[] = [
  {
    id: 'ord-01',
    orderNumber: 'MC-2026-9842',
    date: '2026-10-22T15:20:00Z',
    status: 'shipped',
    subtotal: 19.98,
    shipping: 0,
    tax: 1.72,
    total: 19.98,
    carrierName: 'USPS Priority Mail',
    trackingNumber: 'USPS-9400-1118-9956-2048-1074-22',
    trackingUrl: 'https://tools.usps.com',
    estimatedDelivery: 'Oct 28, 2026',
    shippingAddress: {
      id: 'addr-01',
      label: 'Home (Mochi)',
      recipientName: 'Chloe Vance',
      phone: '+1 (415) 890-3421',
      street: '1450 Mission St, Apt 4B',
      postalCode: '94103',
      city: 'San Francisco',
      province: 'California',
      country: 'US',
      isDefaultShipping: true,
      isDefaultBilling: true,
    },
    items: [
      {
        productId: 'golden-cat',
        variantId: '52067452453138',
        productHandle: 'golden-cat',
        productName: {
          es: 'Cat Tag — Placa de Gato Personalizada',
          en: 'Cat Tag — Custom Engraved Tag',
        },
        variantName: {
          es: 'Small / Dorado Espejo',
          en: 'Small / Mirror Gold',
        },
        image: 'tag-cats/tag-Cat-Gold-1.png',
        unitPrice: 9.99,
        quantity: 1,
        lineTotal: 9.99,
        engravedDetails: {
          PetName: 'Mochi',
          Phone: '+1 (415) 890-3421',
          Typography: 'FT24 (Modern Display)',
          SafeZone: 'Center (Front & Back)',
        },
      },
      {
        productId: 'rose-cat',
        variantId: '52067454058770',
        productHandle: 'rose-cat',
        productName: {
          es: 'Rose Cat — Acabado Champagne',
          en: 'Rose Cat — Champagne Finish',
        },
        variantName: {
          es: 'Small / Champagne Rosé',
          en: 'Small / Rosé Champagne',
        },
        image: 'tag-cats/base/tag view.png',
        unitPrice: 9.99,
        quantity: 1,
        lineTotal: 9.99,
        engravedDetails: {
          PetName: 'Cleo',
          Microchip: '#98514-US',
          Typography: 'FT18 (Elegant Serif)',
        },
      },
    ],
  },
  {
    id: 'ord-02',
    orderNumber: 'MC-2026-8310',
    date: '2026-08-14T10:15:00Z',
    status: 'delivered',
    subtotal: 9.99,
    shipping: 4.5,
    tax: 0.86,
    total: 14.49,
    carrierName: 'FedEx Express',
    trackingNumber: 'FDX-US-831054219',
    trackingUrl: 'https://www.fedex.com',
    estimatedDelivery: 'Aug 17, 2026',
    shippingAddress: {
      id: 'addr-01',
      label: 'Home (Mochi)',
      recipientName: 'Chloe Vance',
      phone: '+1 (415) 890-3421',
      street: '1450 Mission St, Apt 4B',
      postalCode: '94103',
      city: 'San Francisco',
      province: 'California',
      country: 'US',
      isDefaultShipping: true,
      isDefaultBilling: true,
    },
    items: [
      {
        productId: 'cat-product',
        variantId: '51780218487058',
        productHandle: 'cat-product',
        productName: {
          es: 'Silver Cat — Acero Quirúrgico Plateado',
          en: 'Silver Cat — Surgical Steel Silver',
        },
        variantName: {
          es: 'Small / Plata Brillante',
          en: 'Small / Bright Silver',
        },
        image: 'tag-cats/tag-Cat-Gold-1.png',
        unitPrice: 9.99,
        quantity: 1,
        lineTotal: 9.99,
        engravedDetails: {
          PetName: 'Mochi',
          Phone: '+1 (415) 890-3421',
          Typography: 'FT06 (Minimalist)',
        },
      },
    ],
  },
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['golden-cat', 'rose-cat']);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Inicializar desde localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const storedOrders = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        setOrders(DEMO_ORDERS);
        localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(DEMO_ORDERS));
      }

      const storedWishlist = localStorage.getItem(STORAGE_KEY_WISHLIST);
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    } catch (e) {
      console.warn('No se pudo inicializar la sesión del cliente desde storage', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 350));

    const cleanEmail = email.trim().toLowerCase();
    const matchedUser: CustomerUser =
      cleanEmail === DEMO_USER.email.toLowerCase()
        ? DEMO_USER
        : {
            id: `usr-${Date.now()}`,
            email: cleanEmail,
            firstName: cleanEmail.split('@')[0],
            lastName: '',
            phone: '',
            preferredLocale: 'es',
            newsletterSubscribed: false,
            createdAt: new Date().toISOString(),
            addresses: [],
          };

    setUser(matchedUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(matchedUser));
    setIsLoading(false);
    return true;
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    setOrders(DEMO_ORDERS);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEMO_USER));
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(DEMO_ORDERS));
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 350));

    const newUser: CustomerUser = {
      id: `usr-${Date.now()}`,
      email: data.email.trim().toLowerCase(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: data.phone?.trim() || '',
      preferredLocale: 'es',
      newsletterSubscribed: Boolean(data.newsletterSubscribed),
      createdAt: new Date().toISOString(),
      addresses: [],
    };

    setUser(newUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  const resetPassword = async (_email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return true;
  };

  const updateProfile = async (data: Partial<CustomerUser>): Promise<boolean> => {
    if (!user) return false;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    return true;
  };

  const addAddress = (addressData: Omit<UserAddress, 'id'>) => {
    if (!user) return;
    const newAddr: UserAddress = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };

    let updatedAddresses = [...user.addresses];
    if (newAddr.isDefaultShipping) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefaultShipping: false }));
    }
    if (newAddr.isDefaultBilling) {
      updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefaultBilling: false }));
    }

    updatedAddresses.push(newAddr);
    updateProfile({ addresses: updatedAddresses });
  };

  const updateAddress = (id: string, addressData: Partial<UserAddress>) => {
    if (!user) return;
    let updatedAddresses = user.addresses.map((a) =>
      a.id === id ? { ...a, ...addressData } : a
    );

    if (addressData.isDefaultShipping) {
      updatedAddresses = updatedAddresses.map((a) =>
        a.id === id ? a : { ...a, isDefaultShipping: false }
      );
    }
    if (addressData.isDefaultBilling) {
      updatedAddresses = updatedAddresses.map((a) =>
        a.id === id ? a : { ...a, isDefaultBilling: false }
      );
    }

    updateProfile({ addresses: updatedAddresses });
  };

  const deleteAddress = (id: string) => {
    if (!user) return;
    const filtered = user.addresses.filter((a) => a.id !== id);
    updateProfile({ addresses: filtered });
  };

  const setDefaultShippingAddress = (id: string) => {
    if (!user) return;
    const updated = user.addresses.map((a) => ({
      ...a,
      isDefaultShipping: a.id === id,
    }));
    updateProfile({ addresses: updated });
  };

  const toggleWishlist = (productHandle: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productHandle);
      const next = exists ? prev.filter((h) => h !== productHandle) : [...prev, productHandle];
      localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(next));
      return next;
    });
  };

  const isInWishlist = (productHandle: string) => {
    return wishlist.includes(productHandle);
  };

  const lookupGuestOrder = (email: string, orderNumber: string): CustomerOrder | null => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanNum = orderNumber.trim().toUpperCase();
    return (
      orders.find(
        (o) =>
          o.orderNumber.toUpperCase() === cleanNum &&
          (user?.email.toLowerCase() === cleanEmail || cleanEmail.includes('@'))
      ) || null
    );
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      orders,
      wishlist,
      login,
      loginAsDemo,
      register,
      logout,
      resetPassword,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultShippingAddress,
      toggleWishlist,
      isInWishlist,
      lookupGuestOrder,
    }),
    [user, isLoading, orders, wishlist]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
