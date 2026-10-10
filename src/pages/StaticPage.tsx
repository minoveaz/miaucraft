export default function StaticPage({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-semibold text-brand-ink">{title}</h1>
      <p className="mt-4 text-brand-ink/80">{body}</p>
    </div>
  );
}
