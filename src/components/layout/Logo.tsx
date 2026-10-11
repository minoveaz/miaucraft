import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

// Logo original en PNG transparente (960px de ancho). Se sirve desde public/brand.
export default function Logo({ className = '' }: LogoProps) {
  return (
    <Link to="/" aria-label="Miaucraft, ir al inicio" className={`inline-flex shrink-0 ${className}`}>
      <img
        src={`${import.meta.env.BASE_URL}brand/logo-miaucraft.png`}
        alt="Miaucraft"
        width={960}
        height={295}
        className="h-8 w-auto sm:h-11"
      />
    </Link>
  );
}
