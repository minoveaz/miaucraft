// Modelos para el Módulo de Clientes, Perfiles de Mascotas y Pedidos

export type PetSpecies = 'dog' | 'cat' | 'other';

export interface PetProfile {
  id: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  birthdate?: string;
  avatarUrl?: string;
  emergencyPhone: string;
  microchipNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province?: string;
  zip: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface SavedTagDesign {
  id: string;
  petProfileId?: string;
  designName: string;
  shape: string;
  finish: string;
  font: string;
  petName: string;
  phone: string;
  backText?: string;
  previewImageUrl?: string;
  createdAt: string;
}

export type OrderStatus = 'pending' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  title: string;
  handle: string;
  unitPrice: number;
  quantity: number;
  image?: string;
  customAttributes?: { key: string; value: string }[];
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  statusLabel: string;
  trackingNumber?: string;
  trackingUrl?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  shippingAddress: Address;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  pets: PetProfile[];
  addresses: Address[];
  orders: Order[];
  savedDesigns: SavedTagDesign[];
}
