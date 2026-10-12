// Catálogo de demo extraído de Shopify (products.json); sustituir por Storefront API al conectar Shopify.
export interface Product {
  handle: string;
  title: string;
  priceFrom: number;
  collections: string[];
  description?: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  media?: ProductMedia[];
  options?: ProductOption[];
  tagStudio?: TagStudioConfig;
  personalization?: {
    label: string;
    description?: string;
    values?: { value: string; label: string }[];
  };
  purchaseHighlights?: string[];
  details?: { title: string; content: string }[];
  relatedHandles?: string[];
}

export interface ProductMedia {
  image: string;
  alt: string;
}

export interface ProductOption {
  name: string;
  label: string;
  values: { value: string; label: string; available?: boolean }[];
}

export interface TagStudioConfig {
  designs: { value: string; label: string; shape: 'cat-head' | 'round' | 'bone' | 'paw'; image: string }[];
  finishes: { value: string; label: string }[];
  fonts: {
    value: string;
    label: string;
    previewFontFamily: string;
    previewFontWeight?: 'normal' | 'bold';
    previewFontStyle?: 'normal' | 'italic';
  }[];
  defaultDesign?: string;
  defaultFont?: string;
  maxNameLength?: number;
  phoneEnabled?: boolean;
  phoneMaxLength?: number;
  finishSwatches?: Record<string, string>;
}

const goldenCatFonts: TagStudioConfig['fonts'] = [
  { value: 'FT12', label: 'FT12', previewFontFamily: 'Georgia, serif' },
  { value: 'FT13', label: 'FT13', previewFontFamily: '"Times New Roman", serif', previewFontStyle: 'italic' },
  { value: 'FT14', label: 'FT14', previewFontFamily: '"Arial Narrow", Arial, sans-serif' },
  { value: 'FT15', label: 'FT15', previewFontFamily: '"Brush Script MT", cursive' },
  { value: 'FT16', label: 'FT16', previewFontFamily: '"Trebuchet MS", sans-serif', previewFontWeight: 'bold' },
  { value: 'FT17', label: 'FT17', previewFontFamily: 'Georgia, serif', previewFontWeight: 'bold' },
  { value: 'FT18', label: 'FT18', previewFontFamily: 'Arial, sans-serif' },
  { value: 'FT19', label: 'FT19', previewFontFamily: '"Palatino Linotype", Palatino, serif' },
  { value: 'FT20', label: 'FT20', previewFontFamily: 'Georgia, serif', previewFontStyle: 'italic' },
  { value: 'FT21', label: 'FT21', previewFontFamily: '"Courier New", monospace' },
  { value: 'FT22', label: 'FT22', previewFontFamily: 'Verdana, sans-serif' },
  { value: 'FT23', label: 'FT23', previewFontFamily: 'cursive', previewFontWeight: 'bold' },
  { value: 'FT24', label: 'FT24', previewFontFamily: '"Comic Sans MS", cursive' },
  { value: 'FT25', label: 'FT25', previewFontFamily: 'cursive', previewFontStyle: 'italic' },
  { value: 'FT26', label: 'FT26', previewFontFamily: 'Impact, sans-serif' },
  { value: 'FT27', label: 'FT27', previewFontFamily: '"American Typewriter", serif' },
  { value: 'FT28', label: 'FT28', previewFontFamily: '"Snell Roundhand", cursive' },
];

const goldenCatTagStudio: TagStudioConfig = {
  designs: Array.from({ length: 23 }, (_, index) => {
    const value = `DSA${String(66 + index).padStart(3, '0')}`;
    return {
      value,
      label: value,
      shape: 'cat-head' as const,
      image: `tag-cats/designs/${value}.png`,
    };
  }),
  finishes: [
    { value: 'Custom Silver', label: 'Silver' },
    { value: 'Custom Gold', label: 'Gold' },
    { value: 'Custom Champagne', label: 'Champagne' },
    { value: 'Custom Black', label: 'Black' },
  ],
  fonts: goldenCatFonts,
  defaultDesign: 'DSA066',
  defaultFont: 'FT12',
  finishSwatches: {
    'Custom Silver': '#aeb3bb',
    'Custom Gold': '#c89537',
    'Custom Champagne': '#cba982',
    'Custom Black': '#292622',
  },
};

export function productImage(product: Product): string {
  if (product.handle === 'golden-cat') return 'tag-cats/tag-Cat-Gold-1.png';
  if (product.collections.includes('bandanas')) return '5_bandana.png';
  if (product.handle.includes('bone')) return '7_charms.png';
  if (product.collections.includes('tag-cat')) return '3-gatos.png';
  return '6_tags.png';
}

export const CURRENCY = 'USD';

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY }).format(amount);
}

export function productsInCollection(handle: string): Product[] {
  return products.filter((p) => p.collections.includes(handle));
}

export const products: Product[] = [
  { handle: 'pet-bandana-collar', title: 'Pet bandana collar', priceFrom: 22.5, collections: ['bandanas'] },
  { handle: 'pet-bandana-collar-animal-print', title: 'Pet bandana collar Animal Print', priceFrom: 22, collections: ['bandanas'] },
  { handle: 'pet-bandana-collar-spain', title: 'Pet bandana collar - Spain', priceFrom: 22.5, collections: ['bandanas'] },
  { handle: 'pet-bandana-collar-colombia', title: 'Pet bandana collar - Colombia', priceFrom: 22.5, collections: ['bandanas'] },
  { handle: 'bone-product', title: 'Cat / Dog Tag Bone', priceFrom: 9.99, collections: ['id-tags-anderson'] },
  { handle: 'round-diamond-product', title: 'Cat / Dog Tag Diamond Round', priceFrom: 9.99, collections: ['id-tags-anderson'] },
  { handle: 'diamond-bone-product', title: 'Cat / Dog Tag Diamond Bone', priceFrom: 9.99, collections: ['id-tags-anderson'] },
  { handle: 'diamond-heart-product', title: 'Cat / Dog Tag Diamond Heart', priceFrom: 9.99, collections: ['id-tags-anderson'] },
  { handle: 'bowtie-product', title: 'Cat / Dog Tag Bowtie', priceFrom: 9.99, collections: ['id-tags-anderson'] },
  { handle: 'misifu-product', title: 'Cat / Dog Tag Misifu', priceFrom: 9.99, collections: ['id-tags-anderson'] },
  { handle: 'sheriff-shield-product', title: 'Cat / Dog Tag Sheriff Shield', priceFrom: 9.99, collections: ['id-tags-anderson'] },
  { handle: 'patrol-shield-product', title: 'Cat / Dog Tag Patrol Shield', priceFrom: 9.99, collections: ['id-tags-anderson'] },
  { handle: 'fish-product', title: 'Cat / Dog Tag Fish', priceFrom: 9.99, collections: ['id-tags-anderson'] },
  { handle: 'heart-product', title: 'Cat / Dog Tag Heart', priceFrom: 9.99, collections: ['id-tags-anderson'] },
  { handle: 'hexagon-product', title: 'Cat / Dog Tag Hexagon', priceFrom: 9.99, collections: ['id-tags-anderson'] },
  { handle: 'bone-pawprint-product', title: 'Cat / Dog Tag Bone-PawPrint', priceFrom: 9.99, collections: ['id-tags-anderson'] },
  { handle: 'tags-orbits-collection', title: 'Tags Orbits Collection', priceFrom: 9.99, collections: ['id-tags-anderson'] },
  { handle: 'rose-cat', title: 'Rose Cat', priceFrom: 9.99, collections: ['id-tags-anderson', 'tag-cat'] },
  { handle: 'cat-product', title: 'Silver Cat', priceFrom: 9.99, collections: ['id-tags-anderson', 'tag-cat'] },
  {
    handle: 'golden-cat',
    title: 'Golden cat',
    priceFrom: 0.99,
    collections: ['id-tags-anderson', 'tag-cat'],
    description: 'Placa dorada con diseño de gato y opciones de personalización.',
    tagStudio: goldenCatTagStudio,
    media: [
      { image: 'tag-cats/tag-Cat-Gold-1.png', alt: 'Placa Golden cat dorada con el nombre Amber grabado' },
      { image: 'tag-cats/tag-Cat-Gold-7.png', alt: 'Gato con collar y placa Golden cat personalizada' },
      { image: 'tag-cats/tag-Cat-Gold-2.jpeg', alt: 'Placa Golden cat dorada, vista de cerca para mostrar su calidad' },
      { image: 'tag-cats/tag-Cat-Gold-5.jpeg', alt: 'Gato con placa Golden cat y anilla de unión incluida' },
      { image: 'tag-cats/tag-Cat-Gold-3.jpeg', alt: 'Opciones de diseño para personalizar la placa Golden cat' },
      { image: 'tag-cats/tag-Cat-Gold-4.jpeg', alt: 'Gato con una placa Golden cat personalizada con el nombre Daisy' },
      { image: 'tag-cats/tag-Cat-Gold-6.jpeg', alt: 'Gato con placa Golden cat personalizada y opciones de diseño disponibles' },
    ],
    options: [
      {
        name: 'Size',
        label: 'Talla',
        values: [
          { value: 'Babies', label: 'Babies' },
          { value: 'Small', label: 'Small' },
          { value: 'Large', label: 'Large' },
          { value: 'Extra-large', label: 'Extra-large' },
        ],
      },
      {
        name: 'Color',
        label: 'Color (Gold)',
        values: [{ value: 'Gold', label: 'Gold' }],
      },
    ],
    personalization: {
      label: 'Personalización',
      description: 'Elige el acabado y escribe el texto para personalizar la placa.',
      values: goldenCatTagStudio.finishes.map(({ value, label }) => ({ value, label })),
    },
    purchaseHighlights: [
      'Entrega estimada: 3–5 días',
      'Política de devolución de 14 días',
      'Envío gratis en pedidos superiores a $50',
    ],
    details: [
      {
        title: 'Descripción',
        content: 'Tags Cat Collection',
      },
      {
        title: 'Envíos y devoluciones',
        content: 'Enviamos con seguimiento. Puedes solicitar una devolución durante los 14 días posteriores a la compra para obtener un reembolso o cambio. Envío gratis en pedidos superiores a $50.',
      },
    ],
    relatedHandles: ['rose-cat', 'cat-product'],
  },
];
