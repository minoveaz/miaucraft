import StaticPage from './StaticPage';

// Páginas de contenido pendiente: los textos definitivos se escriben después.
export function AboutPage() {
  return <StaticPage title="Nosotros" body="Próximamente: historia y valores de Miaucraft." />;
}

export function ContactPage() {
  return <StaticPage title="Contacto" body="Próximamente: formulario y datos de contacto." />;
}

export function LegalPage({ title }: { title: string }) {
  return <StaticPage title={title} body="Texto pendiente de revisión legal." />;
}

export function NotFoundPage() {
  return <StaticPage title="Página no encontrada" body="La dirección que buscas no existe." />;
}
