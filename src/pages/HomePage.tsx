import { Link } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';
import { formatPrice, productImage, products } from '../lib/products';

const base = import.meta.env.BASE_URL;
const ia = (file: string) => `${base}images/ia/${file}`;

const petCards = [
  { title: 'Perros', image: 'IA-CAT-BANDANA.png', to: '/coleccion/bandanas' },
  { title: 'Gatos', image: 'IA-CAT-COLLAR.png', to: '/coleccion/tag-cat' },
  { title: 'Regalos', image: 'IA-CAT-TAGS.png', to: '/coleccion/id-tags-anderson' },
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
          <h1 className="font-display text-[52px] font-bold leading-[1.05] tracking-[-0.01em] max-md:text-4xl">
            Accesorios para perros y gatos.
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
          src={`${base}images/home.png`}
          alt=""
          width={1774}
          height={887}
          className="h-[340px] w-full flex-1 rounded-xl object-cover max-md:h-auto"
        />
      </section>

      <div className="mt-5 rounded-xl border border-brand-soft bg-white p-4 text-center text-sm text-brand-ink/70">
        Vista previa del catálogo: precios informativos; el checkout no está disponible.
      </div>

      {/* Compra por mascota */}
      <section className={frame} aria-labelledby="home-tipo">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="home-tipo" className={sectionHead}>Compra por tipo de mascota</h2>
          </div>
          <Link to="/coleccion/id-tags-anderson" className={link}>Explorar tags →</Link>
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
            <h2 id="home-vendidos" className={sectionHead}>Productos del catálogo</h2>
          </div>
          <Link to="/coleccion/bandanas" className={link}>Ver bandanas →</Link>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-5 max-md:grid-cols-2">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.handle}
              href={`/producto/${product.handle}`}
              image={productImage(product)}
              name={product.title}
              price={formatPrice(product.priceFrom)}
            />
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
          <h2 id="home-historia" className={sectionHead}>Encuentra su estilo</h2>
          <p className="text-[15px] text-[#4a4a4a]">
            Descubre bandanas, collares y placas de identificación en las colecciones de muestra.
          </p>
          <Link to="/coleccion/bandanas" className={`${btnGhost} w-fit`}>Explorar la colección</Link>
        </div>
      </section>

      <section className={frame} aria-labelledby="home-news">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-[22px] bg-brand-soft p-8 sm:p-10">
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
