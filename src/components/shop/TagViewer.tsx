import { ShieldCheck } from 'lucide-react';
import type { Layer, ProductFace, ViewMode } from '@minoveaz/product-viewer';
import { ProductViewer } from '../viewer/ProductViewer';
import type { TagStudioConfig } from '../../lib/products';
import { tagDimensionsMm, tagHole, tagOutline } from '../../lib/tag-outlines';
import type { TagEngravingItem, TagSide, TagStudioValue } from './TagStudio';
import { getInitialEngravings } from './TagStudio';

const base = import.meta.env.BASE_URL;
const image = (file: string) => `${base}images/${encodeURI(file)}`;

export function wrapTextToLines(text: string, maxCharsPerLine = 19): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
    } else if ((currentLine + ' ' + word).length <= maxCharsPerLine) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export const clampFontSize = (desired: number, text: string) => {
  const maxAllowable = 0.78 / Math.max(1, text.length * 0.52);
  return Math.min(desired, maxAllowable);
};

export function buildFaceLayers(
  engravings: TagEngravingItem[],
  face: TagSide,
  fonts: TagStudioConfig['fonts'],
  engravingColor = '#292622',
): Layer[] {
  const items = engravings.filter((item) => item.side === face && item.text.trim().length > 0);
  if (items.length === 0) return [];

  const topItem = items.find((i) => i.zone === 'top');
  const centerItem = items.find((i) => i.zone === 'center');
  const bottomItem = items.find((i) => i.zone === 'bottom');

  const layers: Layer[] = [];

  const hasTop = Boolean(topItem);
  const hasCenter = Boolean(centerItem);
  const hasBottom = Boolean(bottomItem);

  let topY = 0.44;
  let topSize = 0.055;
  let centerY = 0.58;
  let centerSize = 0.082;
  let bottomY = 0.70;
  let bottomSize = 0.052;

  if (hasTop && hasCenter && hasBottom) {
    topY = 0.42;
    topSize = 0.048;
    centerY = 0.56;
    centerSize = 0.065;
    bottomY = 0.70;
    bottomSize = 0.046;
  } else if (hasTop && hasCenter && !hasBottom) {
    topY = 0.44;
    topSize = 0.052;
    centerY = 0.63;
    centerSize = 0.076;
  } else if (!hasTop && hasCenter && hasBottom) {
    centerY = 0.52;
    centerSize = 0.076;
    bottomY = 0.68;
    bottomSize = 0.052;
  } else if (hasTop && !hasCenter && hasBottom) {
    topY = 0.45;
    topSize = 0.055;
    bottomY = 0.68;
    bottomSize = 0.055;
  } else if (!hasTop && centerItem && !hasBottom) {
    centerY = 0.58;
    centerSize = 0.084;
  } else if (topItem && !hasCenter && !hasBottom) {
    topY = 0.54;
    topSize = 0.065;
  } else if (!hasTop && !hasCenter && bottomItem) {
    bottomY = 0.65;
    bottomSize = 0.065;
  }

  const renderItem = (item: TagEngravingItem, baseY: number, baseSize: number) => {
    const fontConfig = fonts.find((f) => f.value === item.font) ?? fonts[0];
    const rawText = item.text.trim();
    const displayText = item.uppercase ? rawText.toUpperCase() : rawText;

    const scale = item.scale ?? 1.0;
    const finalSize = clampFontSize(baseSize * scale, displayText);

    const yNudge = item.yOffset ?? 0;
    const finalY = Math.max(0.38, Math.min(0.80, baseY + yNudge));

    const xNudge = item.xOffset ?? 0;
    const finalX = Math.max(0.18, Math.min(0.82, 0.5 + xNudge));

    const wrapped = wrapTextToLines(displayText, 19);

    if (wrapped.length <= 1) {
      layers.push({
        id: `${face}-${item.zone}-0`,
        type: 'text',
        text: displayText,
        x: finalX,
        y: finalY,
        fontSize: finalSize,
        fontFamily: fontConfig.previewFontFamily,
        fontWeight: fontConfig.previewFontWeight,
        fontStyle: fontConfig.previewFontStyle,
        color: engravingColor,
      });
    } else {
      const lineStep = 0.054 * scale;
      const startY = finalY - ((wrapped.length - 1) * lineStep) / 2;
      wrapped.forEach((line, idx) => {
        layers.push({
          id: `${face}-${item.zone}-${idx}`,
          type: 'text',
          text: line,
          x: finalX,
          y: Math.max(0.38, Math.min(0.75, startY + idx * lineStep)),
          fontSize: clampFontSize(finalSize * 0.88, line),
          fontFamily: fontConfig.previewFontFamily,
          fontWeight: fontConfig.previewFontWeight ?? 'normal',
          fontStyle: fontConfig.previewFontStyle,
          color: engravingColor,
        });
      });
    }
  };

  if (topItem) renderItem(topItem, topY, topSize);
  if (centerItem) renderItem(centerItem, centerY, centerSize);
  if (bottomItem) renderItem(bottomItem, bottomY, bottomSize);

  return layers;
}

export interface TagViewerProps {
  config: TagStudioConfig;
  value: TagStudioValue;
  view: ViewMode;
  side: ProductFace;
  showSafeZone?: boolean;
  className?: string;
}

export function TagViewer({
  config,
  value,
  view,
  side,
  showSafeZone = false,
  className,
}: TagViewerProps) {
  const design = config.designs.find((item) => item.value === value.design) ?? config.designs[0];
  const font = config.fonts.find((item) => item.value === value.font) ?? config.fonts[0];
  const finish = config.finishes.find((item) => item.value === value.finish);
  const engravingColor = '#292622';
  const isFrontDesign = design.nameSide === 'front';

  const engravings =
    value.engravings && value.engravings.length > 0
      ? value.engravings
      : getInitialEngravings(value, design, config.defaultFont || 'FT12');

  const frontTextLayers = isFrontDesign
    ? buildFaceLayers(engravings, 'front', config.fonts, engravingColor)
    : [];

  const backTextLayers = buildFaceLayers(engravings, 'back', config.fonts, engravingColor);

  const frontLayers: Layer[] = [
    {
      id: 'design',
      type: 'image',
      src: image(design.artwork),
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    },
    ...frontTextLayers,
  ];

  const backLayers: Layer[] =
    backTextLayers.length > 0
      ? backTextLayers
      : [
          {
            id: 'back-placeholder',
            type: 'text',
            text: 'Datos de contacto',
            x: 0.5,
            y: 0.58,
            fontSize: 0.054,
            fontFamily: font.previewFontFamily,
            color: 'rgba(41, 38, 34, 0.28)',
          },
        ];

  const mainName = value.name.trim() || 'Tag';

  return (
    <div className={`relative ${className ?? ''}`}>
      <ProductViewer
        view={view}
        source={{
          baseImage: image(finish?.baseImage ?? 'tag-cats/base/tag-golden.png'),
          sideColor: finish?.sideColor,
          outline: tagOutline.map(([x, y]) => ({ x, y })),
          hole: tagHole,
          widthMm: tagDimensionsMm.width,
          heightMm: tagDimensionsMm.height,
          thicknessMm: tagDimensionsMm.thickness,
        }}
        frontLayers={frontLayers}
        backLayers={backLayers}
        side={side}
        className="h-full w-full"
        label={`Tag ${design.label}, ${side === 'front' ? 'frontal' : 'reverso'}${mainName ? `, ${mainName}` : ''}`}
      />
      {showSafeZone && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-2">
          <svg viewBox="0 0 100 100" className="h-full w-full max-h-full max-w-full">
            <rect
              x="13"
              y="37"
              width="74"
              height="41"
              rx="12"
              fill="rgba(229, 44, 119, 0.07)"
              stroke="#e52c77"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
