import { Link } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';
import { formatPrice, productImage, products } from '../lib/products';

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

const sectionHead = 'mb-1 font-display text-[26px] font-bold leading-tight tracking-[-0.01em]';
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
            Miaucraft
          </span>
          <h1 className="font-display text-[52px] font-bold leading-[1.05] tracking-[-0.01em] max-md:text-3xl sm:max-md:text-4xl">
            Accesorios que hacen que tu mascota se vea como ella.
          </h1>
          <p className="max-w-[520px] text-[17px]">
            Explora el catálogo de muestra de Miaucraft. Las compras y los datos en tiempo real aún no están conectados.
          </p>
          <div className="mt-2 flex flex-wrap gap-5">
            <Link to="/coleccion/bandanas" className={btn}>Comprar bandanas</Link>
            <Link to="/coleccion/id-tags-anderson" className={btnGhost}>Explorar tags ID</Link>
          </div>
        </div>
        <img
          src={image('home.png')}
          alt="Perro con bandana rosa sobre fondo crema"
          width={800}
          height={680}
          className="h-[340px] w-full flex-1 rounded-xl object-cover object-[78%_center] max-md:h-auto"
        />
      </section>

      <div className="mt-5 rounded-xl border border-brand-soft bg-white p-4 text-center text-sm text-brand-ink/70">
        Vista previa del catálogo: precios informativos; el checkout no está disponible.
      </div>

      {/* Compra por categoría */}
      <section className={frame} aria-labelledby="home-categorias">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="home-categorias" className={sectionHead}>Comprar por categoría</h2>
          </div>
          <Link to="/coleccion/id-tags-anderson" className={link}>Explorar tags →</Link>
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
            <h2 id="home-vendidos" className={sectionHead}>Productos del catálogo</h2>
          </div>
          <Link to="/coleccion/bandanas" className={link}>Ver bandanas →</Link>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-5 max-md:grid-cols-2">
          {products.filter((product) => ['golden-cat', 'pet-bandana-collar', 'bone-product', 'cat-product'].includes(product.handle)).map((product) => (
            <ProductCard
              key={product.handle}
              href={`/producto/${product.handle}`}
              image={image(productImage(product))}
              name={product.title}
              price={formatPrice(product.priceFrom)}
            />
          ))}
        </div>
      </section>
      <ul className={`${frame} grid grid-cols-2 gap-3 text-center text-xs text-brand-ink/70 sm:grid-cols-4`}>
        {trustItems.map((item) => <li key={item} className="rounded-xl bg-brand-cream p-3">{item}</li>)}
      </ul>

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
          <h2 id="home-historia" className={sectionHead}>Encuentra su estilo</h2>
          <p className="text-[15px] text-[#4a4a4a]">
            Descubre bandanas, collares y placas de identificación en las colecciones de muestra.
          </p>
          <Link to="/coleccion/bandanas" className={`${btnGhost} w-fit`}>Explorar la colección</Link>
        </div>
      </section>

      <section className={frame} aria-labelledby="home-news">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[22px] bg-brand-soft p-10 max-md:p-5">
          <div className="flex flex-col gap-2.5">
            <h2 id="home-news" className={sectionHead}>¿Buscas algo especial?</h2>
            <p>Recorre las colecciones disponibles en esta vista previa.</p>
          </div>
          <Link to="/coleccion/id-tags-anderson" className={btn}>Ver colecciones</Link>
        </div>
      </section>
    </div>
  );
}
