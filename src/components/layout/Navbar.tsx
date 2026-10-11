import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useCart } from '../../lib/cart';

// Enlaces del wireframe 01. Los que aún no tienen ruta se muestran sin enlace.
const navItems = [
  { label: 'Bandanas', to: '/coleccion/bandanas', active: true },
  { label: 'Collares ID', to: '/coleccion/id-tags-anderson' },
  { label: 'Tags', to: '/coleccion/tag-cat' },
  { label: 'Accesorios' },
  { label: 'Guías' },
  { label: 'Nosotros', to: '/nosotros' },
];

const iconBox = 'h-[22px] w-[22px] rounded-[5px] border-[1.5px] border-brand-ink';

function NavLabel({ label, to, active }: { label: string; to?: string; active?: boolean }) {
  const className = active
    ? 'border-b-2 border-brand pb-0.5 text-brand'
    : 'text-brand-ink hover:text-brand';
  if (!to) return <span className={`${className} cursor-default text-brand-ink/50`}>{label}</span>;
  return (
    <Link to={to} className={className}>
      {label}
    </Link>
  );
}

export default function Navbar() {
  const { count } = useCart();

  return (
    <header className="relative border-b border-[#e6dcd3] bg-white">
      <div className="flex items-center justify-between px-10 py-4 max-md:px-4 max-md:py-3">
        <Logo />
        <nav aria-label="Principal" className="hidden gap-7 text-sm font-semibold md:flex">
          {navItems.map((item) => (
            <NavLabel key={item.label} {...item} />
          ))}
        </nav>
        <div className="flex items-center gap-3.5">
          <span aria-hidden="true" className={`${iconBox} hidden sm:block`} />
          <span aria-hidden="true" className={`${iconBox} hidden sm:block`} />
          <Link
            to="/carrito"
            aria-label={`Carrito, ${count} artículos`}
            className="flex items-center gap-2"
          >
            <span aria-hidden="true" className={iconBox} />
            <span className="rounded-full bg-brand px-1.5 text-[11px] font-bold text-white">{count}</span>
          </Link>
        </div>
      </div>
      <details className="border-t border-[#e6dcd3] px-4 py-3 md:hidden">
        <summary className="cursor-pointer text-sm font-semibold">Menú</summary>
        <nav aria-label="Principal móvil" className="mt-3 flex flex-col gap-3 text-sm font-semibold">
          {navItems.map((item) => (
            <NavLabel key={item.label} {...item} />
          ))}
        </nav>
      </details>
    </header>
  );
}
