import { Link } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';

const base = import.meta.env.BASE_URL;
const image = (file: string) => `${base}images/${file}`;

const trustItems = [
  'Envío gratis en pedidos superiores a $50',
  'Devolución en 14 días',
  'Pago seguro con Shop Pay y Apple Pay',
  'Materiales resistentes',
];

const petCards = [
  { title: 'Perros', image: '11-perros.jpeg', alt: 'Perro con bandana y placa Miaucraft', to: '/coleccion/bandanas', imagePosition: 'object-top' },
  { title: 'Gatos', image: '3-gatos.png', alt: 'Gato con collar Miaucraft', to: '/coleccion/tag-cat', imagePosition: 'object-center' },
  { title: 'Regalos', image: '12-regalos.jpeg', alt: 'Caja de regalo con placas personalizadas para mascotas', to: '/coleccion/id-tags-anderson', imagePosition: 'object-center' },
];

const bestSellers = [
  { href: '/producto/golden-cat', name: 'Golden cat', image: 'tag-cats/tag-Cat-Gold-1.png', price: '$0.99', badge: 'Más vendido' },
  { href: '/coleccion/bandanas', name: 'Bandana Luna', image: '5_bandana.png', rating: 5, reviews: 128, price: '$18.00', badge: 'Bestseller' },
  { href: '/coleccion/id-tags-anderson', name: 'Collar ID Bolt', image: '4_collares.png', rating: 4, reviews: 64, price: '$24.00', compareAtPrice: '$29.00' },
  { href: '/coleccion/tag-cat', name: 'Tag Gato Coral', image: '6_tags.png', rating: 5, reviews: 41, price: '$12.00', badge: 'Quedan 3' },
  { href: '/coleccion/bandanas', name: 'Bandana Otoño', image: '5_bandana.png', rating: 5, reviews: 22, price: '$18.00' },
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
          <h1 className="font-display text-[52px] font-bold leading-[1.05] tracking-[-0.01em] max-md:text-3xl sm:max-md:text-4xl">
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
          src={image('home.png')}
          alt="Perro con bandana rosa sobre fondo crema"
          width={800}
          height={680}
          className="h-[340px] w-full flex-1 rounded-xl object-cover object-[78%_center] max-md:h-auto"
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

      {/* Compra por categoría */}
      <section className={frame} aria-labelledby="home-categorias">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="home-categorias" className={sectionHead}>Comprar por categoría</h2>
          </div>
          <Link to="/" className={link}>Ver todo →</Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
          {petCards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="group relative block h-[160px] overflow-hidden rounded-xl bg-[#e9e4df] sm:h-[220px]"
            >
              <img
                src={image(card.image)}
                alt={card.alt}
                width={800}
                height={800}
                loading="lazy"
                className={`h-full w-full object-cover ${card.imagePosition} transition-transform duration-300 group-hover:scale-105`}
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
            <ProductCard key={product.name} {...product} image={image(product.image)} />
          ))}
        </div>
      </section>

      {/* Historia de marca */}
      <section className={`${frame} flex items-stretch gap-5 max-md:flex-col`} aria-labelledby="home-historia">
        <img
          src={image('8_banner.png')}
          alt="Mesa de trabajo con materiales para crear accesorios de mascotas"
          width={800}
          height={520}
          loading="lazy"
          className="h-[220px] w-full flex-none rounded-xl object-cover object-[78%_center] md:h-[260px] md:flex-1"
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
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[22px] bg-brand-soft p-10 max-md:p-5">
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
