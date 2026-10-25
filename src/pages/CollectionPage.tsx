import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';
import { collectionLinks } from '../lib/navigation';
import { productImage, productsInCollection } from '../lib/products';
import { useTranslation } from '../hooks/useTranslation';
import StaticPage from './StaticPage';

const image = (file: string) => `${import.meta.env.BASE_URL}images/${file}`;

export default function CollectionPage() {
  const { handle } = useParams();
  const { t, formatPrice, isEn } = useTranslation();
  const collection = collectionLinks.find((c) => c.handle === handle);

  if (!collection) {
    return (
      <StaticPage
        title={isEn ? 'Collection Not Found' : 'Colección no encontrada'}
        body={isEn ? 'Please check the navigation menu.' : 'Revisa el menú de colecciones.'}
      />
    );
  }

  const items = productsInCollection(collection.handle);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
      <nav aria-label="Breadcrumb navigation" className="mb-5 text-sm text-brand-ink/60">
        <Link to="/" className="hover:text-brand-strong">{t.nav.home}</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{collection.title}</span>
      </nav>
      <div className="overflow-hidden rounded-2xl bg-brand-soft">
        <img
          src={`${import.meta.env.BASE_URL}images/ia/IA-COLL-BANNER.png`}
          alt=""
          className="h-36 w-full object-cover sm:h-52"
        />
      </div>
      <div className="mt-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-ink sm:text-4xl">{collection.title}</h1>
          <p className="mt-2 text-brand-ink/70">
            {isEn ? 'Explore available products in this collection.' : 'Explora los productos de esta colección.'}
          </p>
        </div>
        <p className="text-sm text-brand-ink/60">
          {items.length} {isEn ? (items.length === 1 ? 'product' : 'products') : (items.length === 1 ? 'producto' : 'productos')}
        </p>
      </div>

      {items.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <li key={product.handle}>
              <ProductCard
                href={`/producto/${product.handle}`}
                image={image(productImage(product))}
                name={product.title}
                price={formatPrice(product.priceFrom)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 rounded-xl border border-brand-soft p-6 text-brand-ink/70">
          {isEn ? 'No products available in this collection yet.' : 'No hay productos disponibles en esta colección.'}
        </p>
      )}
    </div>
  );
}
