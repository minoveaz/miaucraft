import { Link } from 'react-router-dom';
import { formatPrice, type Product } from '../../lib/products';

// Imagen de demo por colección (placeholder IA). Sustituir por fotos reales de producto.
export const collectionImage: Record<string, string> = {
  bandanas: 'IA-CAT-BANDANA.png',
  'id-tags-anderson': 'IA-CAT-TAGS.png',
  'tag-cat': 'IA-CAT-COLLAR.png',
};

export function productImageSrc(product: Product): string {
  const file = collectionImage[product.collections[0]] ?? 'IA-CAT-COLLAR.png';
  return `${import.meta.env.BASE_URL}images/ia/${file}`;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col">
      <Link
        to={`/producto/${product.handle}`}
        className="block overflow-hidden rounded-2xl bg-brand-cream"
        aria-label={`Ver ${product.title}`}
      >
        <img
          src={productImageSrc(product)}
          alt=""
          width={800}
          height={800}
          loading="lazy"
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <h3 className="mt-4 text-base font-semibold text-brand-ink">
        <Link to={`/producto/${product.handle}`} className="hover:text-brand-strong">
          {product.title}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-brand-ink/70">Desde {formatPrice(product.priceFrom)}</p>
    </article>
  );
}
