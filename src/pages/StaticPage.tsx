import { Link } from 'react-router-dom';

export default function StaticPage({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-semibold text-brand-ink">{title}</h1>
      <p className="mt-4 text-brand-ink/80">{body}</p>
      <Link
        to="/"
        className="mt-7 inline-flex min-h-11 items-center rounded-full bg-brand-strong px-6 text-sm font-semibold text-white hover:bg-brand-ink"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
