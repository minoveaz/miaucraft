import { Outlet } from 'react-router-dom';
import { CartProvider } from '../../lib/cart';
import Footer from './Footer';
import Navbar from './Navbar';

// Shell público: cabecera sticky, contenido de la ruta y pie.
export default function PublicLayout() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
