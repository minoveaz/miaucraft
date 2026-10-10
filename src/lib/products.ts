// Placeholder catalog for the demo. Replace with Shopify Storefront API data.
export interface Product {
  id: string;
  handle: string;
  title: string;
  price: string;
}

export const products: Product[] = [
  { id: '1', handle: 'id-tag-gato', title: 'Placa ID para gato', price: 'Consultar precio' },
  { id: '2', handle: 'kay-chain', title: 'Kay Chain', price: 'Consultar precio' },
  { id: '3', handle: 'bandana', title: 'Bandana', price: 'Consultar precio' },
];
