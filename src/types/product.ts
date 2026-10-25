// Modelos canónicos de productos y configuraciones para Miaucraft

export type ProductType = 'tag' | 'accessory' | 'apparel';

export interface ProductMedia {
  image: string;
  alt: string;
  isPrimary?: boolean;
}

export interface ProductOptionValue {
  value: string;
  label: string;
  available?: boolean;
}

export interface ProductOption {
  name: string;
  label: string;
  values: ProductOptionValue[];
}

export interface TagDesign {
  value: string;
  label: string;
  shape: 'cat-head' | 'round' | 'bone' | 'paw';
  image: string;
  artwork: string;
  nameSide: 'front' | 'back';
}

export interface TagFinish {
  value: string;
  label: string;
  baseImage?: string;
  sideColor?: string;
}

export interface TagFont {
  value: string;
  label: string;
  previewFontFamily: string;
  previewFontWeight?: 'normal' | 'bold';
  previewFontStyle?: 'normal' | 'italic';
}

export interface TagStudioConfig {
  designs: TagDesign[];
  specs?: { label: string; value: string }[];
  finishes: TagFinish[];
  fonts: TagFont[];
  defaultDesign?: string;
  defaultFinish?: string;
  defaultFont?: string;
  maxNameLength?: number;
  phoneEnabled?: boolean;
  phoneMaxLength?: number;
  finishSwatches?: Record<string, string>;
}

export interface ProductPersonalization {
  label: string;
  description?: string;
  values?: { value: string; label: string }[];
}

export interface ProductDetailSection {
  title: string;
  content: string;
}

export interface Product {
  id?: string;
  handle: string;
  title: string;
  productType?: ProductType;
  priceFrom: number;
  compareAtPrice?: number;
  collections: string[];
  description?: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  media?: ProductMedia[];
  options?: ProductOption[];
  tagStudio?: TagStudioConfig;
  personalization?: ProductPersonalization;
  purchaseHighlights?: string[];
  details?: ProductDetailSection[];
  relatedHandles?: string[];
  isAvailable?: boolean;
}
