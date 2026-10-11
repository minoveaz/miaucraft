import { Link } from 'react-router-dom';

const shopLinks = [
  { label: 'Bandanas', to: '/coleccion/bandanas' },
  { label: 'Collares ID', to: '/coleccion/id-tags-anderson' },
  { label: 'Tags', to: '/coleccion/tag-cat' },
  { label: 'Accesorios' },
];

const helpLinks = ['Guía de tallas', 'Envíos', 'Devoluciones', 'Contacto'];

const brandLinks = [
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Blog y guías' },
  { label: 'Instagram · TikTok' },
  { label: 'Políticas' },
];

function FooterList({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.label} className="py-[3px] text-[#cfc8c2]">
          {item.to ? <Link to={item.to} className="hover:text-white">{item.label}</Link> : item.label}
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="grid grid-cols-1 gap-8 bg-brand-ink px-10 py-12 text-[13px] text-white sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] max-md:px-4 max-md:py-8">
      <div>
        <h4 className="mb-2.5 font-display text-sm font-bold">MIAUCRAFT</h4>
        <p className="text-[#cfc8c2]">Accesorios para perros y gatos, diseñados y probados en casa.</p>
        <form className="mt-2.5 flex gap-2" onSubmit={(event) => event.preventDefault()}>
          <label className="sr-only" htmlFor="footer-email">Tu email</label>
          <input
            id="footer-email"
            type="email"
            placeholder="Tu email"
            className="h-[38px] min-w-0 flex-1 rounded-md bg-[#2a2a2a] px-3 text-white placeholder:text-[#8a8a8a]"
          />
          <button type="submit" className="h-[38px] w-[100px] rounded-md bg-brand font-bold text-white">
            OK
          </button>
        </form>
      </div>
      <div>
        <h4 className="mb-2.5 font-display text-sm font-bold">Tienda</h4>
        <FooterList items={shopLinks} />
      </div>
      <div>
        <h4 className="mb-2.5 font-display text-sm font-bold">Ayuda</h4>
        <FooterList items={helpLinks.map((label) => ({ label }))} />
      </div>
      <div>
        <h4 className="mb-2.5 font-display text-sm font-bold">Marca</h4>
        <FooterList items={brandLinks} />
      </div>
    </footer>
  );
}
