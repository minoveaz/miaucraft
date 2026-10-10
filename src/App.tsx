import { Link, Route, Routes } from 'react-router-dom';
import { products } from './lib/products';

function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl font-semibold text-primary">Miaucraft</h1>
      <p className="mt-3 max-w-2xl text-gray-700">
        Accesorios para mascotas con diseño propio. Demo de la nueva web.
      </p>
      <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li key={p.id} className="rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900">{p.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{p.price}</p>
            <Link to={`/producto/${p.handle}`} className="mt-4 inline-block text-accent underline">
              Ver producto
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

function ProductPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/" className="text-primary underline">Volver al catálogo</Link>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/producto/:handle" element={<ProductPage />} />
      <Route path="*" element={<main className="p-12">Página no encontrada</main>} />
    </Routes>
  );
}
