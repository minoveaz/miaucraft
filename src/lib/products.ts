// Catálogo de demo extraído de Shopify (products.json); sustituir por Storefront API al conectar Shopify.
import { tagDimensionsMm } from './tag-outlines';
import type {
  Product,
  ProductMedia,
  ProductOption,
  ProductOptionValue,
  ProductPersonalization,
  ProductType,
  TagDesign,
  TagFinish,
  TagFont,
  TagStudioConfig,
} from '../types/product';

export type {
  Product,
  ProductMedia,
  ProductOption,
  ProductOptionValue,
  ProductPersonalization,
  ProductType,
  TagDesign,
  TagFinish,
  TagFont,
  TagStudioConfig,
};

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
  specs: [
    { label: 'Material', value: 'Acero inoxidable' },
    { label: 'Tamaño', value: `${tagDimensionsMm.width} × ${tagDimensionsMm.height} mm` },
    { label: 'Grosor', value: `${tagDimensionsMm.thickness} mm` },
    { label: 'Grabado', value: 'Grabado en una cara con tinta negra' },
    { label: 'Texto', value: 'Hasta 4 líneas, legible y fácil de leer' },
  ],
  designs: Array.from({ length: 23 }, (_, index) => {
    const value = `DSA${String(66 + index).padStart(3, '0')}`;
    return {
      value,
      label: value,
      shape: 'cat-head' as const,
      image: `tag-cats/designs/${value}.png`,
      artwork: `tag-cats/designs/designs svg/${value}.svg`,
      nameSide: index <= 10 ? 'front' : 'back',
    };
  }),
  finishes: [
    {
      value: 'Custom Gold',
      label: 'Gold',
      baseImage: 'tag-cats/base/tag-golden.png',
      sideColor: '#e3c27c',
    },
    {
      value: 'Custom Rose Gold',
      label: 'Rose Gold',
      baseImage: 'tag-cats/base/tag-rose-gold.png',
      sideColor: '#c98d8a',
    },
    {
      value: 'Custom Silver',
      label: 'Silver',
      baseImage: 'tag-cats/base/tag-silver.png',
      sideColor: '#c1c7ce',
    },
  ],
  fonts: goldenCatFonts,
  defaultDesign: 'DSA066',
  defaultFinish: 'Custom Gold',
  defaultFont: 'FT12',
  phoneEnabled: true,
  phoneMaxLength: 25,
  maxNameLength: 15,
  finishSwatches: {
    'Custom Gold': '#c89537',
    'Custom Rose Gold': '#c98d8a',
    'Custom Silver': '#aeb3bb',
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
    title: 'Cat Tag',
    priceFrom: 9.99,
    collections: ['id-tags-anderson', 'tag-cat'],
    description: 'Placa identificativa de acero inoxidable con diseño de gato, acabados metálicos y opciones de personalización.',
    tagStudio: goldenCatTagStudio,
    media: [
      { image: 'tag-cats/base/tag view.png', alt: 'Vistas del tag: frontal, perspectiva, lateral, trasera e inferior, con medidas' },
      { image: 'tag-cats/tag-Cat-Gold-1.png', alt: 'Placa Cat Tag dorada con el nombre Amber grabado' },
      { image: 'tag-cats/tag-Cat-Gold-7.png', alt: 'Gato con collar y placa Cat Tag dorada personalizada' },
      { image: 'tag-cats/tag-Cat-Gold-2.jpeg', alt: 'Placa Cat Tag dorada, vista de cerca para mostrar su calidad' },
      { image: 'tag-cats/tag-Cat-Gold-5.jpeg', alt: 'Gato con placa Cat Tag dorada y anilla de unión incluida' },
      { image: 'tag-cats/tag-Cat-Gold-3.jpeg', alt: 'Opciones de diseño para personalizar la placa Cat Tag' },
      { image: 'tag-cats/tag-Cat-Gold-4.jpeg', alt: 'Gato con una placa Cat Tag dorada personalizada con el nombre Daisy' },
      { image: 'tag-cats/tag-Cat-Gold-6.jpeg', alt: 'Gato con placa Cat Tag dorada personalizada y opciones de diseño' },
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
        content: [
          'Placa identificativa de acero inoxidable con forma de gato, disponible en acabados Gold, Rose Gold y Silver. Está pensada para que tu mascota sea fácil de identificar gracias a su nombre grabado y a la anilla de unión incluida.',
          'Personalízala en pocos pasos: elige uno de los 23 diseños de gato, el color y la tipografía. La vista previa 2D y 3D se actualiza mientras configuras, para que veas el resultado antes de comprar. Solo es obligatorio escribir el nombre para añadirla al carrito.',
          'Acero inoxidable de 35 × 32 mm y 2.5 mm de grosor, con grabado en una cara con tinta negra. Usa nombres cortos y en letras grandes para que se lean bien a distancia; el grabado final puede variar ligeramente respecto a la vista previa.',
        ].join('\n\n'),
      },
      {
        title: 'Envíos y devoluciones',
        content: 'Enviamos con seguimiento. Puedes solicitar una devolución durante los 14 días posteriores a la compra para obtener un reembolso o cambio. Envío gratis en pedidos superiores a $50.',
      },
    ],
    relatedHandles: ['rose-cat', 'cat-product'],
  },
];
