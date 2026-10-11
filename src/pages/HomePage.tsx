import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';
import { collectionLinks } from '../lib/navigation';
import { products } from '../lib/products';

const base = import.meta.env.BASE_URL;

const trustItems = [
  { title: 'Pago seguro', text: 'Checkout protegido de Shopify' },
  { title: 'Envío a EE. UU.', text: 'Seguimiento en cada pedido' },
  { title: 'Devoluciones', text: 'Política clara antes de comprar' },
  { title: 'Atención por chat', text: 'Respuesta de nuestro equipo' },
];

const collectionImages = ['IA-CAT-BANDANA.png', 'IA-CAT-TAGS.png', 'IA-CAT-COLLAR.png'];

function HeroSection() {
  return (
    <section aria-labelledby="hero-titulo" className="bg-brand-cream">
      <picture>
        <source media="(min-width: 768px)" srcSet={`${base}images/ia/IA-HOME-HERO-D.png`} />
        <img
          src={`${base}images/ia/IA-HOME-HERO-M.png`}
          alt=""
          width={1600}
          height={900}
          className="aspect-[4/5] w-full object-cover md:aspect-[21/9]"
        />
      </picture>
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h1 id="hero-titulo" className="max-w-2xl font-display text-4xl font-semibold leading-tight text-brand-ink md:text-5xl">
          Accesorios con diseño propio para tu mascota
        </h1>
        <p className="mt-4 max-w-xl text-lg text-brand-ink/80">Bandanas y placas ID pensadas para gatos y perros.</p>
        <Link
          to={`/coleccion/${collectionLinks[0].handle}`}
          className="mt-8 inline-flex min-h-12 items-center rounded-full bg-brand-strong px-7 text-base font-semibold text-white hover:bg-brand-ink"
        >
          Ver bandanas
        </Link>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section aria-label="Compra con confianza" className="border-b border-brand-soft">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-6 md:grid-cols-4">
        {trustItems.map((item) => (
          <li key={item.title}>
            <p className="font-semibold text-brand-ink">{item.title}</p>
            <p className="text-sm text-brand-ink/70">{item.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CategoryGrid() {
  return (
    <section aria-labelledby="categorias-titulo" className="mx-auto max-w-6xl px-4 py-16">
      <h2 id="categorias-titulo" className="font-display text-3xl font-semibold text-brand-ink">
        Colecciones
      </h2>
      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {collectionLinks.map((collection, index) => (
          <li key={collection.handle}>
            <Link to={`/coleccion/${collection.handle}`} className="group block">
              <div className="overflow-hidden rounded-2xl bg-brand-cream">
                <img
                  src={`${base}images/ia/${collectionImages[index]}`}
                  alt=""
                  width={800}
                  height={800}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-brand-ink group-hover:text-brand-strong">{collection.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FeaturedProducts() {
  return (
    <section aria-labelledby="destacados-titulo" className="bg-brand-cream/60 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between gap-4">
          <h2 id="destacados-titulo" className="font-display text-3xl font-semibold text-brand-ink">
            Productos destacados
          </h2>
          <Link to={`/coleccion/${collectionLinks[1].handle}`} className="text-sm font-semibold text-brand-strong hover:underline">
            Ver todo
          </Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <li key={product.handle}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section aria-labelledby="historia-titulo" className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2">
      <img
        src={`${base}images/ia/IA-ABOUT-STUDIO.png`}
        alt=""
        width={1200}
        height={900}
        loading="lazy"
        className="aspect-[4/3] w-full rounded-2xl object-cover"
      />
      <div>
        <h2 id="historia-titulo" className="font-display text-3xl font-semibold text-brand-ink">
          Diseñado para mascotas, hecho con cuidado
        </h2>
        <p className="mt-4 text-brand-ink/80">
          Cada accesorio nace de un diseño propio. Conoce a la gente detrás de Miaucraft y cómo trabajamos.
        </p>
        <Link to="/nosotros" className="mt-6 inline-flex text-sm font-semibold text-brand-strong hover:underline">
          Conoce a Miaucraft
        </Link>
      </div>
    </section>
  );
}

function NewsletterSignup() {
  const [sent, setSent] = useState(false);

  // Sin backend todavía: el envío se conectará al proveedor de email al integrar Shopify.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <section aria-labelledby="newsletter-titulo" className="bg-brand-ink py-16 text-white">
      <div className="mx-auto max-w-xl px-4 text-center">
        <h2 id="newsletter-titulo" className="font-display text-3xl font-semibold">
          Novedades de nuevas colecciones
        </h2>
        {sent ? (
          <p role="status" className="mt-6 text-brand-soft">
            Gracias por suscribirte.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              Correo electrónico
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              autoComplete="email"
              placeholder="tu@correo.com"
              className="min-h-12 flex-1 rounded-full bg-white px-5 text-brand-ink placeholder:text-brand-ink/50"
            />
            <button type="submit" className="min-h-12 rounded-full bg-brand-strong px-7 font-semibold text-white hover:bg-brand">
              Suscribirme
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <CategoryGrid />
      <FeaturedProducts />
      <BrandStory />
      <NewsletterSignup />
    </>
  );
}

