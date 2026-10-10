import { Link, useParams } from 'react-router-dom';
import { products } from '../lib/products';
import StaticPage from './StaticPage';

export default function ProductPage() {
  const { handle } = useParams();
  const product = products.find((p) => p.handle === handle);

  if (!product) {
    return <StaticPage title="Producto no encontrado" body="Este producto ya no está disponible." />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/" className="text-sm font-medium text-brand-strong hover:underline">
        ← Volver a la tienda
      </Link>
      <h1 className="mt-6 font-display text-3xl font-semibold text-brand-ink">{product.title}</h1>
      <p className="mt-2 text-brand-ink/70">{product.price}</p>
    </div>
  );
}
