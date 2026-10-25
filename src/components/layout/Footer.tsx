import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageSwitcher from './LanguageSwitcher';

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
  const { t, isEn } = useTranslation();

  const shopLinks = [
    { label: t.nav.tags, to: '/coleccion/tag-cat' },
    { label: t.nav.catTags, to: '/coleccion/tag-cat' },
    { label: t.nav.dogTags, to: '/coleccion/id-tags-anderson' },
    { label: t.nav.bandanas, to: '/coleccion/bandanas' },
  ];

  const helpLinks = [
    { label: isEn ? 'Size Guide' : 'Guía de tallas', to: '/preguntas-frecuentes' },
    { label: isEn ? 'Shipping Info' : 'Envíos', to: '/preguntas-frecuentes' },
    { label: isEn ? 'Returns & Exchanges' : 'Devoluciones', to: '/preguntas-frecuentes' },
    { label: isEn ? 'Contact Support' : 'Contacto', to: '/contacto' },
  ];

  const brandLinks = [
    { label: t.nav.about, to: '/nosotros' },
    { label: t.nav.blog, to: '/blog' },
    { label: 'Instagram · TikTok' },
  ];

  return (
    <footer className="bg-brand-ink px-6 py-12 text-[13px] text-white md:px-10 max-md:py-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <h4 className="mb-2.5 font-display text-sm font-bold">MIAUCRAFT</h4>
          <p className="text-[#cfc8c2]">{t.footer.tagline}</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs text-[#cfc8c2]">{isEn ? 'Language:' : 'Idioma:'}</span>
            <LanguageSwitcher />
          </div>
        </div>
        <div>
          <h4 className="mb-2.5 font-display text-sm font-bold">{t.footer.shop}</h4>
          <FooterList items={shopLinks} />
        </div>
        <div>
          <h4 className="mb-2.5 font-display text-sm font-bold">{t.footer.help}</h4>
          <FooterList items={helpLinks} />
        </div>
        <div>
          <h4 className="mb-2.5 font-display text-sm font-bold">{t.footer.company}</h4>
          <FooterList items={brandLinks} />
        </div>
      </div>
      <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-[#cfc8c2]">
        © {new Date().getFullYear()} Miaucraft. {t.footer.allRightsReserved}
      </div>
    </footer>
  );
}
