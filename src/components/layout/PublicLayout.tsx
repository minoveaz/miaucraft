import { Outlet } from 'react-router-dom';
import { CartProvider } from '../../lib/cart';
import Footer from './Footer';
import Navbar from './Navbar';

// Shell público: cabecera sticky, contenido de la ruta y pie.
export default function PublicLayout() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <div className="bg-brand-ink px-2 py-2 text-center text-xs text-white">
          Envío gratis en pedidos superiores a $50 · Devoluciones durante 14 días · Hecho para perros y gatos
        </div>
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
