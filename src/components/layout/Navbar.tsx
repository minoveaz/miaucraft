import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import Logo from './Logo';
import { useCart } from '../../lib/cart';
import { formatPrice, productImage, products } from '../../lib/products';

const base = import.meta.env.BASE_URL;

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Bandanas', to: '/coleccion/bandanas' },
  { label: 'Collares ID', to: '/coleccion/id-tags-anderson' },
  { label: 'Tags', to: '/coleccion/tag-cat' },
  { label: 'Blog', to: '/blog' },
  { label: 'Nosotros', to: '/nosotros' },
];

function NavigationLink({ label, to, onNavigate }: { label: string; to: string; onNavigate: () => void }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onNavigate}
      className={({ isActive }) => (
        isActive
          ? 'border-b-2 border-brand pb-0.5 text-brand'
          : 'border-b-2 border-transparent pb-0.5 text-brand-ink hover:border-brand/50 hover:text-brand'
      )}
    >
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const { count } = useCart();
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const matches = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return [];
    return products
      .filter((product) => `${product.title} ${product.handle}`.toLocaleLowerCase().includes(normalized))
      .slice(0, 6);
  }, [query]);

  useEffect(() => {
    if (!searchOpen && !mobileMenuOpen) return undefined;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };
    const closeOnScroll = () => {
      setSearchOpen(false);
      setMobileMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer);
    window.addEventListener('scroll', closeOnScroll, { passive: true });
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      window.removeEventListener('scroll', closeOnScroll);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileMenuOpen, searchOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-[#e6dcd3] bg-white shadow-[0_1px_4px_rgba(16,16,16,0.04)]"
      >
        <div className="relative flex h-14 items-center gap-2 px-3 sm:gap-3 sm:px-5 md:h-[76px] md:justify-between md:gap-8 md:px-10">
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
            onClick={() => {
              setMobileMenuOpen((open) => !open);
              setSearchOpen(false);
            }}
            className="flex h-9 w-6 shrink-0 items-center justify-center text-brand-ink hover:text-brand md:hidden"
          >
            {mobileMenuOpen
              ? <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              : <Menu aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />}
          </button>
          <Logo />
          <div className="relative min-w-0 flex-1 md:max-w-[400px]">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b6b6b]" />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
                setMobileMenuOpen(false);
              }}
              onFocus={() => {
                setSearchOpen(true);
                setMobileMenuOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setSearchOpen(false);
              }}
              placeholder="Buscar"
              aria-label="Buscar productos"
              aria-expanded={searchOpen && query.trim().length > 0}
              className="h-9 w-full rounded-full border border-[#cfc4bb] bg-white pl-9 pr-2 text-xs text-brand-ink outline-none placeholder:text-[#6b6b6b] focus:border-brand sm:pr-3 sm:text-sm md:h-10 md:pl-10"
            />
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <a
              href="https://miaucraft.com/account"
              aria-label="Mi cuenta en Miaucraft"
              onClick={() => setSearchOpen(false)}
              className="text-brand-ink hover:text-brand"
            >
              <UserRound aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
            </a>
            <Link
              to="/carrito"
              aria-label={`Carrito, ${count} artículos`}
              onClick={() => setSearchOpen(false)}
              className="relative text-brand-ink hover:text-brand"
            >
              <ShoppingBag aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold leading-none text-white">
                {count}
              </span>
            </Link>
          </div>
        </div>
        {searchOpen && query.trim() && (
          <div className="absolute inset-x-3 top-full z-[70] max-h-[min(60vh,420px)] overflow-y-auto rounded-b-xl border border-t-0 border-[#e6dcd3] bg-white p-2 shadow-xl sm:inset-x-5 md:left-1/2 md:right-auto md:mt-10 md:w-[400px] md:-translate-x-1/2">
            {matches.length ? (
              matches.map((product) => (
                <Link
                  key={product.handle}
                  to={`/producto/${product.handle}`}
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery('');
                  }}
                  className="flex items-center gap-3 rounded-lg p-2 hover:bg-brand-cream"
                >
                  <img
                    src={`${base}images/${productImage(product)}`}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-brand-ink">{product.title}</span>
                  <span className="shrink-0 text-sm text-brand-ink/70">{formatPrice(product.priceFrom)}</span>
                </Link>
              ))
            ) : (
              <p className="px-3 py-4 text-sm text-brand-ink/70">No encontramos productos con ese nombre.</p>
            )}
          </div>
        )}
        {mobileMenuOpen && (
          <nav
            aria-label="Principal móvil"
            className="absolute inset-x-0 top-full z-[60] border-t border-[#e6dcd3] bg-white px-5 py-4 shadow-lg md:hidden"
          >
            <div className="flex flex-col gap-4 text-sm font-semibold">
              {navItems.map((item) => (
                <NavigationLink
                  key={item.label}
                  {...item}
                  onNavigate={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(false);
                  }}
                />
              ))}
            </div>
          </nav>
        )}
      </header>
      <nav
        aria-label="Principal"
        className="hidden justify-center gap-7 border-b border-[#e6dcd3] bg-white py-3 text-sm font-semibold md:flex"
      >
        {navItems.map((item) => (
          <NavigationLink
            key={item.label}
            {...item}
            onNavigate={() => {
              setMobileMenuOpen(false);
              setSearchOpen(false);
            }}
          />
        ))}
      </nav>
    </>
  );
}
