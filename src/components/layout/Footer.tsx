import { Link } from 'react-router-dom';
import { collectionLinks } from '../../lib/navigation';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="mt-auto bg-brand-cream text-brand-ink">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-brand-ink/80">Accesorios para mascotas con diseño propio.</p>
        </div>

        <nav aria-label="Colecciones del pie">
          <h2 className="font-display text-sm font-semibold">Colecciones</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {collectionLinks.map((collection) => (
              <li key={collection.handle}>
                <Link to={`/coleccion/${collection.handle}`} className="hover:text-brand-strong">
                  {collection.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Tienda">
          <h2 className="font-display text-sm font-semibold">Miaucraft</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-brand-strong">
                Tienda
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-brand-soft">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-brand-ink/70">
          © {new Date().getFullYear()} Miaucraft. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
