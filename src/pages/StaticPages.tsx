import StaticPage from './StaticPage';

export function NotFoundPage() {
  return <StaticPage title="Página no encontrada" body="La dirección que buscas no existe." />;
}

export function BlogPage() {
  return (
    <StaticPage
      title="Blog y guías"
      body="Estamos preparando consejos prácticos sobre cuidados, tallas y accesorios para perros y gatos. Muy pronto podrás leerlos aquí."
    />
  );
}
