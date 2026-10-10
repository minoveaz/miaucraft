import { Route, Routes } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import CollectionPage from './pages/CollectionPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import { AboutPage, ContactPage, LegalPage, NotFoundPage } from './pages/StaticPages';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/coleccion/:handle" element={<CollectionPage />} />
        <Route path="/producto/:handle" element={<ProductPage />} />
        <Route path="/nosotros" element={<AboutPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/aviso-legal" element={<LegalPage title="Aviso legal" />} />
        <Route path="/privacidad" element={<LegalPage title="Privacidad" />} />
        <Route path="/cookies" element={<LegalPage title="Cookies" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
