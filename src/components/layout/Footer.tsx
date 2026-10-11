import { Link } from 'react-router-dom';
import { collectionLinks, secondaryLinks } from '../../lib/navigation';
import Logo from './Logo';

const footerLinks = [
  ...secondaryLinks,
  { to: '/envios-devoluciones', label: 'Envíos y devoluciones' },
  { to: '/privacidad', label: 'Privacidad' },
  { to: '/terminos', label: 'Términos de servicio' },
  { to: '/cookies', label: 'Cookies' },
];

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

        <nav aria-label="Ayuda y legal">
          <h2 className="font-display text-sm font-semibold">Ayuda</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {footerLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-brand-strong">
                  {item.label}
                </Link>
              </li>
            ))}
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
