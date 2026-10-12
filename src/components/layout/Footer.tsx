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
  { label: 'Blog y guías', to: '/blog' },
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
        <p className="text-[#cfc8c2]">Accesorios para perros y gatos.</p>
        <p className="mt-3 text-xs text-[#cfc8c2]">El formulario de novedades no está conectado en esta vista previa.</p>
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
