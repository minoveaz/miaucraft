import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../lib/cart';
import { collectionLinks, secondaryLinks } from '../../lib/navigation';
import Logo from './Logo';

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6" />
      <circle cx="9.5" cy="19.5" r="1.5" />
      <circle cx="17.5" cy="19.5" r="1.5" />
    </svg>
  );
}

export default function Navbar() {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cierra los menús al cambiar de ruta.
  useEffect(() => {
    setMenuOpen(false);
    setCollectionsOpen(false);
  }, [pathname]);

  // El menú móvil bloquea el scroll del body mientras está abierto.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setCollectionsOpen(false);
      }
    };
    const onPointerDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCollectionsOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow ${
        scrolled ? 'shadow-md' : 'border-b border-brand-soft'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-20">
        <Logo />

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              aria-expanded={collectionsOpen}
              aria-controls="menu-colecciones"
              onClick={() => setCollectionsOpen((open) => !open)}
              className="inline-flex items-center gap-1 rounded-md px-1 py-2 text-sm font-medium text-brand-ink transition-colors hover:text-brand-strong"
            >
              Colecciones
              <ChevronIcon open={collectionsOpen} />
            </button>
            {collectionsOpen && (
              <div
                id="menu-colecciones"
                className="absolute left-1/2 top-full mt-3 w-72 -translate-x-1/2 rounded-2xl border border-brand-soft bg-white p-3 shadow-xl"
              >
                {collectionLinks.map((collection) => (
                  <Link
                    key={collection.handle}
                    to={`/coleccion/${collection.handle}`}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-brand-ink hover:bg-brand-cream hover:text-brand-strong"
                  >
                    {collection.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {secondaryLinks.map((item) => (
            <Link key={item.to} to={item.to} className="text-sm font-medium text-brand-ink hover:text-brand-strong">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to="/carrito"
            aria-label={count > 0 ? `Carrito, ${count} artículos` : 'Carrito'}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-brand-ink hover:bg-brand-cream"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-strong px-1 text-xs font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-brand-ink hover:bg-brand-cream md:hidden"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="menu-movil"
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-white px-4 py-6 sm:top-20 md:hidden"
        >
          <p className="px-2 text-xs font-semibold uppercase tracking-wider text-brand-strong">Colecciones</p>
          <ul className="mt-2">
            {collectionLinks.map((collection) => (
              <li key={collection.handle}>
                <Link
                  to={`/coleccion/${collection.handle}`}
                  className="block rounded-xl px-2 py-3 text-lg font-medium text-brand-ink hover:bg-brand-cream"
                >
                  {collection.title}
                </Link>
              </li>
            ))}
            {secondaryLinks.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="block rounded-xl px-2 py-3 text-lg font-medium text-brand-ink hover:bg-brand-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
