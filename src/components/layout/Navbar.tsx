import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { useCart } from '../../lib/cart';
import { useAuth } from '../../lib/auth';
import { productImage, products } from '../../lib/products';
import { useTranslation } from '../../hooks/useTranslation';

const base = import.meta.env.BASE_URL;

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
  const { count, openDrawer } = useCart();
  const { user } = useAuth();
  const { t, formatPrice } = useTranslation();
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const navItems = useMemo(() => [
    { label: t.nav.home, to: '/' },
    { label: t.nav.tags, to: '/coleccion/tag-cat' },
    { label: t.nav.catTags, to: '/coleccion/tag-cat' },
    { label: t.nav.dogTags, to: '/coleccion/id-tags-anderson' },
    { label: t.nav.bandanas, to: '/coleccion/bandanas' },
    { label: t.nav.about, to: '/nosotros' },
    { label: t.nav.blog, to: '/blog' },
  ], [t]);

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
        <div className="flex h-14 items-center justify-between gap-2 px-3 sm:px-5 md:h-[76px] md:gap-6 md:px-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              onClick={() => {
                setMobileMenuOpen((open) => !open);
                setSearchOpen(false);
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-brand-ink hover:text-brand md:hidden"
            >
              {mobileMenuOpen
                ? <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                : <Menu aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />}
            </button>
            <Logo />
          </div>

          {/* Desktop Search Bar */}
          <div className="relative hidden md:block min-w-0 flex-1 max-w-[360px] lg:max-w-[420px]">
            <Search aria-hidden="true" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b6b6b]" />
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
              placeholder={t.nav.searchPlaceholder}
              aria-label={t.nav.search}
              aria-expanded={searchOpen && query.trim().length > 0}
              className="h-10 w-full rounded-full border border-[#cfc4bb] bg-white pl-10 pr-3 text-sm text-brand-ink outline-none placeholder:text-[#6b6b6b] focus:border-brand"
            />
          </div>

          {/* Right Actions Cluster */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2.5 md:gap-3">
            {/* Mobile Search Icon Toggle */}
            <button
              type="button"
              aria-label={t.nav.search}
              onClick={() => {
                setSearchOpen((prev) => !prev);
                setMobileMenuOpen(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-brand-ink hover:text-brand md:hidden"
            >
              <Search aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
            </button>

            <LanguageSwitcher />

            <Link
              to="/cuenta"
              aria-label={user ? `${t.nav.account} (${user.firstName})` : t.nav.account}
              onClick={() => setSearchOpen(false)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-brand-ink hover:text-brand transition-colors"
            >
              <UserRound aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              {user && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand ring-2 ring-white" />
              )}
            </Link>

            <button
              type="button"
              aria-label={`${t.nav.cart}, ${count} items`}
              onClick={() => {
                setSearchOpen(false);
                openDrawer();
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-brand-ink hover:text-brand transition-colors"
            >
              <ShoppingBag aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold leading-none text-white">
                {count}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay Bar when toggled */}
        {searchOpen && (
          <div className="border-t border-[#e6dcd3] bg-white p-3 md:hidden">
            <div className="relative">
              <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b6b6b]" />
              <input
                type="search"
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.nav.searchPlaceholder}
                className="h-10 w-full rounded-full border border-[#cfc4bb] bg-white pl-9 pr-3 text-sm text-brand-ink outline-none placeholder:text-[#6b6b6b] focus:border-brand"
              />
            </div>
          </div>
        )}

        {/* Search Results Dropdown */}
        {searchOpen && query.trim() && (
          <div className="absolute inset-x-3 top-full z-[70] max-h-[min(60vh,420px)] overflow-y-auto rounded-b-xl border border-t-0 border-[#e6dcd3] bg-white p-2 shadow-xl sm:inset-x-5 md:left-1/2 md:right-auto md:w-[420px] md:-translate-x-1/2">
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
              <p className="px-3 py-4 text-sm text-brand-ink/70">{t.common.loading ? 'No results found.' : 'Sin resultados.'}</p>
            )}
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Principal móvil"
            className="border-t border-[#e6dcd3] bg-white px-5 py-4 shadow-lg md:hidden"
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
              <Link
                to="/cuenta"
                onClick={() => setMobileMenuOpen(false)}
                className="pt-2 border-t border-[#f0eae4] text-brand-ink hover:text-brand flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <UserRound className="h-4 w-4" />
                  {t.nav.account}
                </span>
                {user && (
                  <span className="text-xs font-bold text-brand-strong bg-brand-soft px-2.5 py-0.5 rounded-full">
                    {user.firstName}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Desktop Category Navigation */}
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
