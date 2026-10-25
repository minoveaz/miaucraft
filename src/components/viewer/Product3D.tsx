import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { composeArtwork, composeEngravingMask } from './compose';
import type { Layer, ProductSource } from '@minoveaz/product-viewer';
import { Minus, Plus, Rotate3d, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export type Model3D = { kind: 'extrude' } | { kind: 'glb'; url: string };

const SIDE = '#e3c27c';
/** One scene unit = 16 mm, so the tag stays in a comfortable range for the camera. */
const MM_PER_UNIT = 16;

function frameOf(outline: Array<{ x: number; y: number }>) {
  const xs = outline.map((p) => p.x);
  const ys = outline.map((p) => p.y);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

function sizeOf(source: ProductSource) {
  const frame = frameOf(source.outline);
  const width = source.widthMm / MM_PER_UNIT;
  const aspect = (frame.maxY - frame.minY) / (frame.maxX - frame.minX);
  const height = source.heightMm ? source.heightMm / MM_PER_UNIT : width * aspect;
  return { width, height, thickness: source.thicknessMm / MM_PER_UNIT, frame };
}

function StudioEnvironment() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    scene.environmentIntensity = 0.55;
    return () => {
      scene.environment = null;
      environment.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
}

function buildGeometry(source: ProductSource) {
  const { width, height, thickness, frame } = sizeOf(source);
  const bevel = thickness * 0.4;
  const sx = (width - 2 * bevel) / width;
  const sy = (height - 2 * bevel) / height;
  const bw = frame.maxX - frame.minX;
  const bh = frame.maxY - frame.minY;
  const cx = (frame.minX + frame.maxX) / 2;
  const cy = (frame.minY + frame.maxY) / 2;

  const toScene = (u: number, v: number): [number, number] => [
    ((u - cx) / bw) * width * sx,
    (-(v - cy) / bh) * height * sy,
  ];

  const shape = new THREE.Shape();
  const points = source.outline.map((p) => new THREE.Vector2(...toScene(p.x, p.y)));
  shape.moveTo(points[0].x, points[0].y);
  shape.splineThru([...points.slice(1), points[0]]);
  shape.closePath();

  if (source.hole) {
    const [hx, hy] = toScene(source.hole.x, source.hole.y);
    const hr = (source.hole.r / bw) * width * sx;
    const hole = new THREE.Path();
    hole.absarc(hx, hy, hr, 0, Math.PI * 2, true);
    shape.holes.push(hole);
  }

  const depth = Math.max(thickness - 2 * bevel, thickness * 0.1);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 8,
    curveSegments: 40,
  });

  geo.translate(0, 0, -depth / 2);

  const position = geo.attributes.position;
  const normal = geo.attributes.normal;
  const uv = geo.attributes.uv;

  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const u = (x / (width * sx)) * bw + cx;
    const v = -(y / (height * sy)) * bh + cy;
    const isBack = normal.getZ(i) < -0.5;
    uv.setXY(i, isBack ? 1 - u : u, 1 - v);
  }
  uv.needsUpdate = true;
  geo.computeVertexNormals();

  const [caps, sides] = geo.groups;
  geo.clearGroups();
  geo.addGroup(caps.start, caps.count / 2, 2);
  geo.addGroup(caps.start + caps.count / 2, caps.count / 2, 0);
  geo.addGroup(sides.start, sides.count, 1);
  return geo;
}

function ExtrudedObject({
  source,
  frontLayers,
  backLayers,
}: {
  source: ProductSource;
  frontLayers: Layer[];
  backLayers: Layer[];
}) {
  const geometry = useMemo(() => buildGeometry(source), [source]);
  const layersKey = JSON.stringify([frontLayers, backLayers]);
  const [textures, setTextures] = useState<{
    front: THREE.CanvasTexture;
    back: THREE.CanvasTexture;
    frontRelief: THREE.CanvasTexture;
    backRelief: THREE.CanvasTexture;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let created: {
      front: THREE.CanvasTexture;
      back: THREE.CanvasTexture;
      frontRelief: THREE.CanvasTexture;
      backRelief: THREE.CanvasTexture;
    } | null = null;

    Promise.all([composeArtwork(source, frontLayers), composeArtwork(source, backLayers)]).then(
      ([frontCanvas, backCanvas]) => {
        if (cancelled) return;
        const front = new THREE.CanvasTexture(frontCanvas);
        const back = new THREE.CanvasTexture(backCanvas);
        front.colorSpace = THREE.SRGBColorSpace;
        back.colorSpace = THREE.SRGBColorSpace;
        front.anisotropy = 8;
        back.anisotropy = 8;

        const frontRelief = new THREE.CanvasTexture(composeEngravingMask(frontLayers));
        const backRelief = new THREE.CanvasTexture(composeEngravingMask(backLayers));
        frontRelief.anisotropy = 8;
        backRelief.anisotropy = 8;

        created = { front, back, frontRelief, backRelief };
        setTextures(created);
      },
    );

    return () => {
      cancelled = true;
      created?.front.dispose();
      created?.back.dispose();
      created?.frontRelief.dispose();
      created?.backRelief.dispose();
    };
  }, [source, layersKey]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        attach="material-0"
        map={textures?.front ?? null}
        bumpMap={textures?.frontRelief ?? null}
        bumpScale={2}
        metalness={0.05}
        roughness={0.62}
        key={textures?.front.uuid ?? 'no-front-texture'}
      />
      <meshStandardMaterial
        attach="material-1"
        color={source.sideColor ?? SIDE}
        metalness={0.2}
        roughness={0.5}
      />
      <meshStandardMaterial
        attach="material-2"
        map={textures?.back ?? null}
        bumpMap={textures?.backRelief ?? null}
        bumpScale={2}
        metalness={0.05}
        roughness={0.62}
        key={textures?.back.uuid ?? 'no-back-texture'}
      />
    </mesh>
  );
}

function GlbObject({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const copy = useMemo(() => scene.clone(), [scene]);
  return <primitive object={copy} />;
}

/**
 * Camera framing with customized tighter zoom factor (1.15 instead of 1.6)
 * so the tag renders large and close by default.
 */
function FitCamera({ radius, zoomScale = 1.15 }: { radius: number; zoomScale?: number }) {
  const camera = useThree((state) => state.camera as THREE.PerspectiveCamera);
  const size = useThree((state) => state.size);

  useEffect(() => {
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const aspect = size.width / size.height;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const fov = Math.min(vFov, hFov);
    // Adjusted multiplier from 1.6 down to 1.15 for a closer, larger initial frame
    const distance = (radius * zoomScale) / Math.sin(fov / 2);
    camera.position.set(0, 0, distance);
    camera.lookAt(0, 0, 0);
    camera.near = distance / 100;
    camera.far = distance * 4;
    camera.updateProjectionMatrix();
  }, [camera, size, radius, zoomScale]);

  return null;
}

export interface Product3DProps {
  source: ProductSource;
  layers?: Layer[];
  frontLayers?: Layer[];
  backLayers?: Layer[];
  model?: Model3D;
  className?: string;
  label?: string;
}

export function Product3D({
  source,
  layers,
  frontLayers,
  backLayers,
  model = { kind: 'extrude' },
  className,
  label = 'Vista 3D del producto',
}: Product3DProps) {
  const { isEn, t } = useTranslation();
  const { width, height, thickness } = sizeOf(source);
  const radius = Math.sqrt(width * width + height * height + thickness * thickness) / 2;
  const resolvedFrontLayers = frontLayers ?? layers ?? [];
  const resolvedBackLayers = backLayers ?? layers ?? [];
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const zoomIn = () => {
    if (controlsRef.current) {
      const cam = controlsRef.current.object;
      cam.position.multiplyScalar(0.85);
      controlsRef.current.update();
    }
  };

  const zoomOut = () => {
    if (controlsRef.current) {
      const cam = controlsRef.current.object;
      cam.position.multiplyScalar(1.18);
      controlsRef.current.update();
    }
  };

  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div role="img" aria-label={label} className={`relative ${className ?? 'h-full w-full'}`}>
      <Canvas
        camera={{ fov: 30 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
      >
        <FitCamera radius={radius} zoomScale={1.15} />
        <StudioEnvironment />
        <ambientLight intensity={0.55} />
        <directionalLight position={[-width, height * 2, width * 2]} intensity={0.9} />
        {model.kind === 'glb' ? (
          <GlbObject url={model.url} />
        ) : (
          <ExtrudedObject source={source} frontLayers={resolvedFrontLayers} backLayers={resolvedBackLayers} />
        )}
        <ContactShadows
          position={[0, -radius - width * 0.04, 0]}
          opacity={0.3}
          scale={radius * 3}
          blur={3}
          far={radius * 2}
        />
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={radius * 0.8}
          maxDistance={radius * 6}
          rotateSpeed={0.8}
        />
      </Canvas>

      {/* Floating 3D Navigation Controls (Zoom in / out / reset) */}
      <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 rounded-full border border-[#e6dcd3] bg-white/90 p-1 shadow-xs backdrop-blur-xs">
        <button
          type="button"
          onClick={zoomIn}
          aria-label={isEn ? 'Zoom in' : 'Acercar'}
          title={isEn ? 'Zoom in' : 'Acercar'}
          className="flex h-7 w-7 items-center justify-center rounded-full text-brand-ink transition-colors hover:bg-brand-soft hover:text-brand-strong"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={zoomOut}
          aria-label={isEn ? 'Zoom out' : 'Alejar'}
          title={isEn ? 'Zoom out' : 'Alejar'}
          className="flex h-7 w-7 items-center justify-center rounded-full text-brand-ink transition-colors hover:bg-brand-soft hover:text-brand-strong"
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={resetView}
          aria-label={isEn ? 'Reset view' : 'Restablecer'}
          title={isEn ? 'Reset view' : 'Restablecer'}
          className="flex h-7 w-7 items-center justify-center rounded-full text-brand-ink transition-colors hover:bg-brand-soft hover:text-brand-strong"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>

      {/* Subtle interaction guidance badge */}
      <div className="pointer-events-none absolute top-2 left-2 z-10">
        <span className="flex items-center gap-1.5 rounded-full border border-[#e6dcd3] bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-brand-ink shadow-xs backdrop-blur-xs">
          <Rotate3d className="h-3.5 w-3.5 text-brand" strokeWidth={2} />
          <span>{t.product.dragToRotate}</span>
        </span>
      </div>
    </div>
  );
}
