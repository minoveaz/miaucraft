import { Link, useParams } from 'react-router-dom';
import { collectionLinks } from '../lib/navigation';
import { formatPrice, productsInCollection } from '../lib/products';
import StaticPage from './StaticPage';

export default function CollectionPage() {
  const { handle } = useParams();
  const collection = collectionLinks.find((c) => c.handle === handle);

  if (!collection) {
    return <StaticPage title="Colección no encontrada" body="Revisa el menú de colecciones." />;
  }

  const items = productsInCollection(collection.handle);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl font-semibold text-brand-ink">{collection.title}</h1>
      <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <li key={p.handle} className="rounded-2xl border border-brand-soft p-5">
            <h2 className="font-semibold text-brand-ink">{p.title}</h2>
            <p className="mt-1 text-sm text-brand-ink/70">Desde {formatPrice(p.priceFrom)}</p>
            <Link
              to={`/producto/${p.handle}`}
              className="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand-strong px-5 text-sm font-semibold text-white hover:bg-brand-ink"
            >
              Ver producto
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
