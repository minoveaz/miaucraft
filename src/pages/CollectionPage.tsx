import { useParams } from 'react-router-dom';
import { collectionLinks } from '../lib/navigation';
import StaticPage from './StaticPage';

export default function CollectionPage() {
  const { handle } = useParams();
  const collection = collectionLinks.find((c) => c.handle === handle);

  if (!collection) {
    return <StaticPage title="Colección no encontrada" body="Revisa el menú de colecciones." />;
  }

  return (
    <StaticPage
      title={collection.title}
      body="Los productos de esta colección llegarán desde Shopify en la siguiente fase."
    />
  );
}
