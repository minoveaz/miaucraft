import { useTranslation } from '../hooks/useTranslation';
import StaticPage from './StaticPage';

export function NotFoundPage() {
  const { isEn } = useTranslation();
  return (
    <StaticPage
      title={isEn ? 'Page Not Found' : 'Página no encontrada'}
      body={isEn ? 'The page you are looking for does not exist.' : 'La dirección que buscas no existe.'}
    />
  );
}

export function BlogPage() {
  const { isEn } = useTranslation();
  return (
    <StaticPage
      title={isEn ? 'Blog & Pet Care Guides' : 'Blog y guías'}
      body={isEn
        ? 'We are preparing practical tips on pet care, collar sizing, tag engraving, and nutrition. Check back soon!'
        : 'Estamos preparando consejos prácticos sobre cuidados, tallas y accesorios para perros y gatos. Muy pronto podrás leerlos aquí.'}
    />
  );
}

export function FaqPage() {
  const { isEn } = useTranslation();
  return (
    <StaticPage
      title={isEn ? 'Frequently Asked Questions' : 'Preguntas frecuentes'}
      body={isEn
        ? 'Find answers regarding custom tag engraving, shipping times, sizing recommendations, and 14-day hassle-free returns.'
        : 'Información y respuestas sobre pedidos, envíos con seguimiento, guía de tallas, grabado láser y política de devolución de 14 días.'}
    />
  );
}

export function ContactPage() {
  const { isEn } = useTranslation();
  return (
    <StaticPage
      title={isEn ? 'Contact Support' : 'Contacto'}
      body={isEn
        ? 'Have a question about your order or custom tag? Reach us at support@miaucraft.com or follow our social channels.'
        : '¿Tienes alguna duda sobre tu pedido o el grabado de tu tag? Escríbenos a support@miaucraft.com o contáctanos por redes sociales.'}
    />
  );
}
