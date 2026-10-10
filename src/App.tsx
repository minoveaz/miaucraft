import { Route, Routes } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import CollectionPage from './pages/CollectionPage';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import { NotFoundPage } from './pages/StaticPages';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/coleccion/:handle" element={<CollectionPage />} />
        <Route path="/producto/:handle" element={<ProductPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
