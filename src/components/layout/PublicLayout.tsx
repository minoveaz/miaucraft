import { Outlet } from 'react-router-dom';
import { CartProvider } from '../../lib/cart';
import { useTranslation } from '../../hooks/useTranslation';
import Footer from './Footer';
import Navbar from './Navbar';
import { CartDrawer } from '../cart/CartDrawer';

// Shell público: cabecera sticky, contenido de la ruta y pie.
export default function PublicLayout() {
  const { t, isEn } = useTranslation();

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <div className="bg-brand-ink px-3 py-2 text-center text-xs text-white">
          {t.common.freeShippingNotice} · {isEn ? '14-day hassle-free returns · Preview Storefront' : 'Devoluciones durante 14 días · Vista previa de tienda'}
        </div>
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
