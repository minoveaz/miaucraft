import { Link } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';
import { productImage, products } from '../lib/products';
import { useTranslation } from '../hooks/useTranslation';

const base = import.meta.env.BASE_URL;
const image = (file: string) => `${base}images/${file}`;

const sectionHead = 'mb-1 font-display text-[26px] font-bold leading-tight tracking-[-0.01em]';
const frame = 'mt-9';
const btn = 'inline-flex h-[46px] items-center justify-center rounded-full bg-brand px-6 text-sm font-bold text-white hover:bg-brand-strong transition-colors';
const btnGhost = 'inline-flex h-[46px] items-center justify-center rounded-full border-[1.5px] border-brand-ink px-6 text-sm font-bold text-brand-ink hover:bg-brand-cream transition-colors';
const link = 'font-semibold text-brand hover:text-brand-strong';

export default function HomePage() {
  const { t, formatPrice, isEn } = useTranslation();

  const trustItems = isEn ? [
    'Free shipping over $50',
    '14-day return policy',
    'Secure Shop Pay & Apple Pay',
    'Surgical stainless steel',
  ] : [
    'Envío gratis en pedidos superiores a $50',
    'Devolución en 14 días',
    'Pago seguro con Shop Pay y Apple Pay',
    'Acero inoxidable quirúrgico',
  ];

  const petCards = [
    {
      title: isEn ? 'Dogs' : 'Perros',
      image: '11-perros.jpeg',
      alt: isEn ? 'Dog with Miaucraft tag' : 'Perro con bandana y placa Miaucraft',
      to: '/coleccion/id-tags-anderson',
      imagePosition: 'object-top',
    },
    {
      title: isEn ? 'Cats' : 'Gatos',
      image: '3-gatos.png',
      alt: isEn ? 'Cat with Miaucraft tag' : 'Gato con collar y tag Miaucraft',
      to: '/coleccion/tag-cat',
      imagePosition: 'object-center',
    },
    {
      title: isEn ? 'Gifts' : 'Regalos',
      image: '12-regalos.jpeg',
      alt: isEn ? 'Gift box with personalized pet tags' : 'Caja de regalo con placas personalizadas para mascotas',
      to: '/producto/golden-cat',
      imagePosition: 'object-center',
    },
  ];

  return (
    <div className="px-10 py-8 max-md:px-4 max-md:py-5">
      {/* Hero */}
      <section className="flex min-h-[420px] items-center gap-10 rounded-[22px] bg-brand-soft p-14 max-md:flex-col max-md:p-5 max-md:py-7 max-md:text-left">
        <div className="flex flex-1 flex-col gap-4">
          <span className="inline-block self-start rounded-full bg-brand-cream px-3 py-1 text-xs font-bold text-brand-strong">
            Miaucraft · {isEn ? 'Personalized Pet Boutique' : 'Accesorios Personalizados'}
          </span>
          <h1 className="font-display text-[52px] font-bold leading-[1.05] tracking-[-0.01em] max-md:text-3xl sm:max-md:text-4xl">
            {isEn ? 'Accessories that make your pet look truly like themselves.' : 'Accesorios que hacen que tu mascota se vea como ella.'}
          </h1>
          <p className="max-w-[520px] text-[17px] text-brand-ink/80">
            {isEn
              ? 'Handcrafted engraved tags and durable accessories designed for your pet’s daily safety and style.'
              : 'Placas identificativas grabadas en acero inoxidable y accesorios diseñados para la seguridad y estilo de tu mascota.'}
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            <Link to="/producto/golden-cat" className={btn}>
              {t.nav.tagStudio}
            </Link>
            <Link to="/coleccion/tag-cat" className={btnGhost}>
              {t.nav.tags}
            </Link>
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

      {/* Compra por categoría */}
      <section className={frame} aria-labelledby="home-categorias">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="home-categorias" className={sectionHead}>
              {isEn ? 'Shop by Pet' : 'Comprar por mascota'}
            </h2>
          </div>
          <Link to="/coleccion/tag-cat" className={link}>
            {isEn ? 'Explore All Tags →' : 'Explorar tags →'}
          </Link>
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
              <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-sm font-semibold text-brand-ink shadow-sm">
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
            <h2 id="home-vendidos" className={sectionHead}>
              {isEn ? 'Best Selling Tags' : 'Tags más populares'}
            </h2>
          </div>
          <Link to="/coleccion/tag-cat" className={link}>
            {isEn ? 'View all →' : 'Ver todos →'}
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-5 max-md:grid-cols-2">
          {products.filter((product) => ['golden-cat', 'bone-product', 'cat-product', 'rose-cat'].includes(product.handle)).map((product) => (
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

      {/* Trust bar */}
      <ul className={`${frame} grid grid-cols-2 gap-3 text-center text-xs text-brand-ink/70 sm:grid-cols-4`}>
        {trustItems.map((item) => (
          <li key={item} className="rounded-xl bg-brand-cream p-3 font-medium">
            {item}
          </li>
        ))}
      </ul>

      {/* Historia de marca */}
      <section className={`${frame} flex items-stretch gap-5 max-md:flex-col`} aria-labelledby="home-historia">
        <img
          src={image('8_banner.png')}
          alt={isEn ? 'Workbench with pet accessory crafting materials' : 'Mesa de trabajo con materiales para crear accesorios de mascotas'}
          width={800}
          height={520}
          loading="lazy"
          className="h-[220px] w-full flex-none rounded-xl object-cover object-[78%_center] md:h-[260px] md:flex-1"
        />
        <div className="flex flex-1 flex-col justify-center gap-4 p-5">
          <h2 id="home-historia" className={sectionHead}>
            {isEn ? 'Find Their Signature Style' : 'Encuentra su estilo'}
          </h2>
          <p className="text-[15px] text-[#4a4a4a]">
            {isEn
              ? 'Deeply engraved, surgical-grade stainless steel pet tags designed to keep your pet safe and stylish wherever they go.'
              : 'Placas de identificación en acero quirúrgico inoxidable grabadas para resistir agua, juego y cualquier aventura.'}
          </p>
          <Link to="/producto/golden-cat" className={`${btnGhost} w-fit`}>
            {isEn ? 'Customize Cat Tag' : 'Personalizar Cat Tag'}
          </Link>
        </div>
      </section>
    </div>
  );
}
