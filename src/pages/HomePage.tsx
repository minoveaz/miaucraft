import { Link } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';

const base = import.meta.env.BASE_URL;
const ia = (file: string) => `${base}images/ia/${file}`;

const trustItems = [
  'Envío gratis desde $49',
  'Devolución en 30 días',
  'Pago seguro con Shop Pay y Apple Pay',
  'Materiales resistentes',
];

const petCards = [
  { title: 'Perros', image: 'IA-CAT-BANDANA.png', to: '/coleccion/bandanas' },
  { title: 'Gatos', image: 'IA-CAT-COLLAR.png', to: '/coleccion/tag-cat' },
  { title: 'Regalos', image: 'IA-CAT-TAGS.png', to: '/coleccion/id-tags-anderson' },
];

const bestSellers = [
  { href: '/coleccion/bandanas', name: 'Bandana Luna', image: 'IA-CAT-BANDANA.png', rating: 5, reviews: 128, price: '$18.00', badge: 'Bestseller' },
  { href: '/coleccion/id-tags-anderson', name: 'Collar ID Bolt', image: 'IA-CAT-COLLAR.png', rating: 4, reviews: 64, price: '$24.00', compareAtPrice: '$29.00' },
  { href: '/coleccion/tag-cat', name: 'Tag Gato Coral', image: 'IA-CAT-TAGS.png', rating: 5, reviews: 41, price: '$12.00', badge: 'Quedan 3' },
  { href: '/coleccion/bandanas', name: 'Bandana Otoño', image: 'IA-CAT-BONE.png', rating: 5, reviews: 22, price: '$18.00' },
];

const reviews = [
  { stars: '★★★★★', author: 'Milo · Perro' },
  { stars: '★★★★★', author: 'Nala · Gata' },
  { stars: '★★★★☆', author: 'Bruno · Perro' },
];

const sectionHead = 'mb-1 font-display text-[26px] font-bold leading-tight tracking-[-0.01em]';
const sectionSub = 'mb-5 text-sm text-[#6b6b6b]';
const frame = 'mt-9';
const btn = 'inline-flex h-[46px] items-center justify-center rounded-full bg-brand px-6 text-sm font-bold text-white';
const btnGhost = 'inline-flex h-[46px] items-center justify-center rounded-full border-[1.5px] border-brand-ink px-6 text-sm font-bold text-brand-ink';
const link = 'font-semibold text-brand hover:text-brand-strong';

export default function HomePage() {
  return (
    <div className="px-10 py-8 max-md:px-4 max-md:py-5">
      {/* Hero */}
      <section className="flex min-h-[420px] items-center gap-10 rounded-[22px] bg-brand-soft p-14 max-md:flex-col max-md:p-5 max-md:py-7 max-md:text-left">
        <div className="flex flex-1 flex-col gap-4">
          <span className="inline-block self-start rounded-full bg-brand-soft px-2 py-[3px] text-[11px] font-bold text-brand-strong">
            Nueva colección otoño
          </span>
          <h1 className="font-display text-[52px] font-bold leading-[1.05] tracking-[-0.01em] max-md:text-4xl">
            Accesorios que hacen que tu mascota se vea como ella.
          </h1>
          <p className="max-w-[520px] text-[17px]">
            Bandanas, collares y tags con ID hechos para perros y gatos. Medidas claras, materiales resistentes y envío en 2 días.
          </p>
          <div className="mt-2 flex flex-wrap gap-5">
            <Link to="/coleccion/bandanas" className={btn}>Comprar bandanas</Link>
            <Link to="/coleccion/bandanas" className={btnGhost}>Encontrar la talla</Link>
          </div>
          <p className="mt-3 text-[13px]">★★★★★ 4.9 · +500 reseñas</p>
        </div>
        <img
          src={ia('IA-HOME-HERO-D.png')}
          alt=""
          width={800}
          height={680}
          className="h-[340px] w-full flex-1 rounded-xl object-cover max-md:h-auto"
        />
      </section>

      {/* Garantías */}
      <div className="mt-5">
        <div className="flex flex-wrap justify-center gap-x-7 gap-y-2.5 rounded-[14px] bg-white p-[18px] text-[13px] font-semibold max-md:gap-x-4 max-md:text-xs">
          {trustItems.map((item) => (
            <span key={item}>
              <span className="text-brand">✓ </span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Compra por mascota */}
      <section className={frame} aria-labelledby="home-tipo">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="home-tipo" className={sectionHead}>Compra por tipo de mascota</h2>
          </div>
          <Link to="/" className={link}>Ver todo →</Link>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-5 max-md:grid-cols-1">
          {petCards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="group relative block h-[220px] overflow-hidden rounded-xl bg-[#e9e4df]"
            >
              <img
                src={ia(card.image)}
                alt=""
                width={800}
                height={800}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-sm font-semibold text-brand-ink">
                {card.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Lo más vendido */}
      <section className={frame} aria-labelledby="home-vendidos">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="home-vendidos" className={sectionHead}>Lo más vendido</h2>
          </div>
          <Link to="/coleccion/bandanas" className={link}>Ver colección →</Link>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-5 max-md:grid-cols-2">
          {bestSellers.map((product) => (
            <ProductCard key={product.name} {...product} image={ia(product.image)} />
          ))}
        </div>
      </section>

      {/* Historia de marca */}
      <section className={`${frame} flex items-stretch gap-5 max-md:flex-col`} aria-labelledby="home-historia">
        <img
          src={ia('IA-ABOUT-STUDIO.png')}
          alt=""
          width={800}
          height={520}
          loading="lazy"
          className="h-[260px] flex-1 rounded-xl object-cover max-md:h-auto"
        />
        <div className="flex flex-1 flex-col justify-center gap-4 p-5">
          <h2 id="home-historia" className={sectionHead}>Hecho a mano, probado con mascotas reales</h2>
          <p className="text-[15px] text-[#4a4a4a]">
            Diseñamos y probamos cada accesorio con perros y gatos antes de ponerlo a la venta.
          </p>
          <Link to="/nosotros" className={`${btnGhost} w-fit`}>Conoce la historia</Link>
        </div>
      </section>

      {/* Reseñas */}
      <section className={frame} aria-labelledby="home-resenas">
        <h2 id="home-resenas" className={sectionHead}>Reseñas de clientes</h2>
        <div className="mt-5 grid grid-cols-3 gap-5 max-md:grid-cols-1">
          {reviews.map((review) => (
            <article key={review.author} className="rounded-[14px] border border-[#e6dcd3] bg-white p-3.5">
              <div className="text-[13px] tracking-[2px] text-brand">{review.stars}</div>
              <p className="mt-2.5 mb-3 text-[13px] text-[#6b6b6b]">{review.author}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className={frame} aria-labelledby="home-news">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[22px] bg-brand-soft p-10">
          <div className="flex flex-col gap-2.5">
            <h2 id="home-news" className={sectionHead}>Únete y recibe 10% en tu primera compra</h2>
            <p>Novedades, guías de tallas y lanzamientos.</p>
          </div>
          <form className="flex w-[460px] max-w-full gap-5 max-md:w-full" onSubmit={(event) => event.preventDefault()}>
            <label className="sr-only" htmlFor="home-email">Tu email</label>
            <input
              id="home-email"
              type="email"
              placeholder="Tu email"
              className="h-11 min-w-0 flex-1 rounded-lg border border-[#cfc4bb] bg-white px-3 text-[13px] text-brand-ink placeholder:text-[#6b6b6b]"
            />
            <button type="submit" className="inline-flex h-[46px] items-center justify-center rounded-full bg-brand-ink px-6 text-sm font-bold text-white">
              Suscribirme
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
