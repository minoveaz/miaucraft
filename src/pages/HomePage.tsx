import { Link } from 'react-router-dom';
import { formatPrice, products } from '../lib/products';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl font-semibold text-brand-ink">Accesorios con diseño propio</h1>
      <p className="mt-3 max-w-2xl text-brand-ink/80">
        Bandanas y placas ID pensadas para mascotas.
      </p>
      <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
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

