// Catálogo de demo extraído de Shopify (products.json). Solo productos con precio real:
// se excluyen test-one y los que solo tienen variantes a $0.00 o $0.99 (placeholders).
// Sustituir por la Storefront API cuando se conecte Shopify.
export interface Product {
  handle: string;
  title: string;
  priceFrom: number;
  collections: string[];
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
];
