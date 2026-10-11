import { Route, Routes } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import CollectionPage from './pages/CollectionPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import StaticPage from './pages/StaticPage';
import { NotFoundPage } from './pages/StaticPages';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/coleccion/:handle" element={<CollectionPage />} />
        <Route path="/producto/:handle" element={<ProductPage />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route
          path="/nosotros"
          element={<StaticPage title="Sobre Miaucraft" body="Accesorios para perros y gatos. El contenido editorial de esta página todavía no está disponible en la vista previa." />}
        />
        <Route
          path="/preguntas-frecuentes"
          element={<StaticPage title="Preguntas frecuentes" body="La información sobre pedidos, envíos, tallas y devoluciones todavía no está configurada en esta vista previa." />}
        />
        <Route
          path="/contacto"
          element={<StaticPage title="Contacto" body="Los canales de atención todavía no están configurados en esta vista previa." />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
