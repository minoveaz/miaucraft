import { Link } from 'react-router-dom';

const image = `${import.meta.env.BASE_URL}images/10_nosotros.png`;

export default function AboutPage() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-16">
      <img
        src={image}
        alt="Un perro durante la medición para elegir el tamaño de su accesorio"
        width={1200}
        height={750}
        className="w-full rounded-2xl object-cover"
      />
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-strong">Nuestra historia</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-brand-ink">
          Hecho a mano, probado con mascotas reales
        </h1>
        <p className="mt-5 text-brand-ink/80">
          Diseñamos y probamos cada accesorio con perros y gatos antes de ponerlo a la venta.
        </p>
        <Link
          to="/coleccion/bandanas"
          className="mt-7 inline-flex h-[46px] items-center justify-center rounded-full bg-brand px-6 text-sm font-bold text-white"
        >
          Explorar bandanas
        </Link>
      </div>
    </section>
  );
}
