import { Route, Routes } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import CollectionPage from './pages/CollectionPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductPage from './pages/ProductPage';
import StaticPage from './pages/StaticPage';
import { BlogPage, NotFoundPage } from './pages/StaticPages';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/coleccion/:handle" element={<CollectionPage />} />
        <Route path="/producto/:handle" element={<ProductPage />} />
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
