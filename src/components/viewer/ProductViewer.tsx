import { lazy, Suspense, type ReactNode } from 'react';
import { Product2D } from '@minoveaz/product-viewer';
import type { Layer, ProductFace, ProductSource, ViewMode } from '@minoveaz/product-viewer';
import type { Model3D } from './Product3D';

const Product3D = lazy(() => import('./Product3D').then((module) => ({ default: module.Product3D })));

export interface ProductViewerProps {
  view: ViewMode;
  source: ProductSource;
  layers?: Layer[];
  frontLayers?: Layer[];
  backLayers?: Layer[];
  side?: ProductFace;
  model?: Model3D;
  className?: string;
  label?: string;
  fallback?: ReactNode;
}

/**
 * Enhanced ProductViewer with closer default 3D camera zoom,
 * floating zoom controls (+ / - / reset), and touch interaction guide.
 */
export function ProductViewer({
  view,
  source,
  layers,
  frontLayers,
  backLayers,
  side = 'front',
  model,
  className,
  label,
  fallback,
}: ProductViewerProps) {
  if (view === '2d') {
    return (
      <Product2D
        source={source}
        layers={layers}
        frontLayers={frontLayers}
        backLayers={backLayers}
        side={side}
        className={className}
        label={label}
      />
    );
  }

  return (
    <Suspense
      fallback={
        fallback ?? (
          <Product2D
            source={source}
            layers={layers}
            frontLayers={frontLayers}
            backLayers={backLayers}
            side={side}
            className={className}
            label={label}
          />
        )
      }
    >
      <Product3D
        source={source}
        layers={layers}
        frontLayers={frontLayers}
        backLayers={backLayers}
        side={side}
        model={model}
        className={className}
        label={label}
      />
    </Suspense>
  );
}
