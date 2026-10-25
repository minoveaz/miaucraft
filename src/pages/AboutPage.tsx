import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const image = `${import.meta.env.BASE_URL}images/10_nosotros.png`;

export default function AboutPage() {
  const { t, isEn } = useTranslation();

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-16">
      <img
        src={image}
        alt={isEn ? 'A dog wearing a handcrafted Miaucraft tag' : 'Un perro durante la medición para elegir el tamaño de su accesorio'}
        width={1200}
        height={750}
        className="w-full rounded-2xl object-cover"
      />
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-strong">
          {isEn ? 'Our Story' : 'Nuestra historia'}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-brand-ink">
          {isEn ? 'Handcrafted with Love, Tested with Real Pets' : 'Hecho a mano, probado con mascotas reales'}
        </h1>
        <p className="mt-5 text-brand-ink/80 leading-7">
          {isEn
            ? 'We design, test and engrave every single accessory with our own dogs and cats before offering it to the world. We believe your pet deserves identification that is both indestructible and as unique as their personality.'
            : 'Diseñamos y probamos cada accesorio con perros y gatos antes de ponerlo a la venta. Creemos que tu mascota merece una identificación indestructible y tan única como su personalidad.'}
        </p>
        <Link
          to="/producto/golden-cat"
          className="mt-7 inline-flex h-[46px] items-center justify-center rounded-full bg-brand px-6 text-sm font-bold text-white hover:bg-brand-strong transition-colors"
        >
          {t.nav.tagStudio}
        </Link>
      </div>
    </section>
  );
}
