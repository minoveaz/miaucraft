import { Link } from 'react-router-dom';

// Tarjeta de producto según .pcard del wireframe 01 (card blanca, foto 240px, badge, estrellas y precio).
export interface ProductCardProps {
  href: string;
  image: string;
  name: string;
  rating?: number;
  reviews?: number;
  price: string;
  compareAtPrice?: string;
  badge?: string;
}

export default function ProductCard({
  href,
  image,
  name,
  rating,
  reviews,
  price,
  compareAtPrice,
  badge,
}: ProductCardProps) {
  return (
    <article className="rounded-[14px] border border-[#e6dcd3] bg-white p-3.5">
      <Link to={href} className="block h-[240px] overflow-hidden rounded-xl bg-[#e9e4df]" aria-label={name}>
        <img src={image} alt="" width={800} height={800} loading="lazy" className="h-full w-full object-cover" />
      </Link>
      <div className="px-0.5 py-2.5">
        {badge && (
          <span className="inline-block rounded-full bg-brand-soft px-2 py-[3px] text-[11px] font-bold text-brand-strong">
            {badge}
          </span>
        )}
        <h3 className={`text-sm font-semibold text-brand-ink ${badge ? 'mt-1.5' : ''}`}>
          <Link to={href} className="hover:text-brand-strong">
            {name}
          </Link>
        </h3>
        {rating !== undefined && (
          <div className="text-[13px] tracking-[2px] text-brand">
            {'★'.repeat(Math.round(rating))}
            {'☆'.repeat(5 - Math.round(rating))}
            {reviews !== undefined && (
              <span className="ml-1 text-xs tracking-normal text-[#6b6b6b]">({reviews})</span>
            )}
          </div>
        )}
        <p className="mt-0.5 font-bold text-brand-ink">
          {price}
          {compareAtPrice && <s className="ml-1.5 font-normal text-[#6b6b6b]">{compareAtPrice}</s>}
        </p>
      </div>
    </article>
  );
}
