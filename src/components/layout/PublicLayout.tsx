import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

// Shell público: cabecera sticky, contenido de la ruta y pie.
export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
