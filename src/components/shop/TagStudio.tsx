import { useId } from 'react';
import type { TagStudioConfig } from '../../lib/products';

export interface TagStudioValue {
  design: string;
  finish: string;
  name: string;
  font: string;
  phone: string;
}

interface TagStudioProps {
  config: TagStudioConfig;
  value: TagStudioValue;
  onChange: (value: TagStudioValue) => void;
}

function TagShape({ shape, fill }: { shape: TagStudioConfig['designs'][number]['shape']; fill: string }) {
  if (shape === 'round') {
    return <circle cx="160" cy="160" r="104" fill={fill} stroke="#9b6d24" strokeWidth="3" />;
  }

  if (shape === 'bone') {
    return (
      <path
        d="M92 81c-19-18-47-7-47 16 0 13 10 22 23 24l81 82c2 14 12 25 27 25 22 0 33-27 17-43l-81-82c-2-14-12-25-26-25-11 0-19 6-24 15Z"
        fill={fill}
        stroke="#9b6d24"
        strokeWidth="3"
        transform="translate(4 0) scale(1.05)"
      />
    );
  }

  if (shape === 'paw') {
    return (
      <g fill={fill} stroke="#9b6d24" strokeWidth="3">
        <ellipse cx="160" cy="187" rx="67" ry="54" />
        <ellipse cx="91" cy="116" rx="23" ry="31" transform="rotate(-22 91 116)" />
        <ellipse cx="137" cy="92" rx="23" ry="31" transform="rotate(-8 137 92)" />
        <ellipse cx="184" cy="92" rx="23" ry="31" transform="rotate(8 184 92)" />
        <ellipse cx="229" cy="116" rx="23" ry="31" transform="rotate(22 229 116)" />
      </g>
    );
  }

  return (
    <path
      d="M76 91 55 49c-3-7 4-14 11-10l51 30c27-10 57-10 84 0l51-30c7-4 14 3 11 10l-21 42c23 25 35 53 35 84 0 69-51 113-116 128-65-15-116-59-116-128 0-31 12-59 35-84Z"
      fill={fill}
      stroke="#9b6d24"
      strokeWidth="3"
    />
  );
}

function TagPreview({
  config,
  value,
  finishColor,
  font,
}: {
  config: TagStudioConfig;
  value: TagStudioValue;
  finishColor: string;
  font: TagStudioConfig['fonts'][number];
}) {
  const ids = useId().replace(/:/g, '');
  const design = config.designs.find((item) => item.value === value.design) ?? config.designs[0];
  const displayName = value.name.trim() || 'Nombre';
  const textSize = Math.max(19, Math.min(34, 34 - Math.max(0, displayName.length - 5) * 1.25));

  return (
    <svg
      viewBox="0 0 320 320"
      role="img"
      aria-label={`Vista previa orientativa: tag ${design.label}, nombre ${displayName}, tipografía ${font.label}`}
      className="mx-auto h-full max-h-64 w-full"
    >
      <defs>
        <linearGradient id={`tag-metal-gold-${ids}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8e4a8" />
          <stop offset="0.45" stopColor="#ddb653" />
          <stop offset="1" stopColor="#f4d783" />
        </linearGradient>
        <filter id={`tag-shadow-${ids}`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#4b3520" floodOpacity="0.16" />
        </filter>
      </defs>
      <ellipse cx="160" cy="286" rx="80" ry="12" fill="#382c1d" opacity="0.08" />
      <g filter={`url(#tag-shadow-${ids})`}>
        <path d="M160 30c-12 0-21 9-21 21v25h42V51c0-12-9-21-21-21Z" fill="none" stroke="#ad7a2a" strokeWidth="9" />
        <circle cx="160" cy="50" r="7" fill="#f8e4a8" stroke="#ad7a2a" strokeWidth="3" />
        <TagShape shape={design.shape} fill={`url(#tag-metal-gold-${ids})`} />
        {design.shape === 'cat-head' && (
          <g fill="none" stroke="#9d6d22" strokeLinecap="round" strokeWidth="2.5" opacity="0.72">
            <path d="M115 197h35m-35 10h35m20-10h35m-35 10h35" />
            <path d="m153 219 7 5 7-5" />
          </g>
        )}
        <text
          x="160"
          y="166"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={finishColor}
          fontFamily={font.previewFontFamily}
          fontSize={textSize}
          fontWeight={font.previewFontWeight ?? 'normal'}
          fontStyle={font.previewFontStyle ?? 'normal'}
        >
          {displayName}
        </text>
      </g>
    </svg>
  );
}

export default function TagStudio({ config, value, onChange }: TagStudioProps) {
  const instanceId = useId().replace(/:/g, '');
  const design = config.designs.find((item) => item.value === value.design) ?? config.designs[0];
  const font = config.fonts.find((item) => item.value === value.font) ?? config.fonts[0];
  const finish = config.finishes.find((item) => item.value === value.finish);
  const finishColor = config.finishSwatches?.[value.finish] ?? '#292622';
  const previewName = value.name || 'Amber';

  const update = (next: Partial<TagStudioValue>) => onChange({ ...value, ...next });

  return (
    <section aria-labelledby={`${instanceId}-title`} className="mt-6 rounded-2xl border border-[#e6dcd3] bg-white p-4 sm:p-5">
      <div>
        <h2 id={`${instanceId}-title`} className="font-display text-xl font-semibold text-brand-ink">
          Diseña tu tag
        </h2>
        <p className="mt-1 text-sm text-brand-ink/70">Combina el diseño, el acabado y la tipografía.</p>
      </div>

      <div className="mt-4 rounded-xl bg-brand-cream p-3">
        <div className="mx-auto flex aspect-square max-h-64 items-center justify-center">
          <TagPreview config={config} value={value} finishColor={finishColor} font={font} />
        </div>
        <p className="mt-2 text-center text-xs text-brand-ink/70">
          Vista previa orientativa; el grabado final puede variar.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        {config.designs.length > 1 ? (
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-brand-ink">01. Elige el diseño</legend>
            <div className="grid grid-cols-2 gap-2">
              {config.designs.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={value.design === option.value}
                  onClick={() => update({ design: option.value })}
                  className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    value.design === option.value
                      ? 'border-brand bg-brand-soft text-brand-strong'
                      : 'border-[#e6dcd3] bg-white text-brand-ink hover:border-brand'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
        ) : (
          <div>
            <p className="mb-2 text-sm font-semibold text-brand-ink">01. Diseño</p>
            <p className="rounded-lg border border-brand bg-brand-soft px-3 py-2 text-sm font-semibold text-brand-strong">
              {design.label}
            </p>
          </div>
        )}

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-brand-ink">02. Elige el acabado</legend>
          <div className="grid grid-cols-2 gap-2">
            {config.finishes.map((option) => {
              const selected = value.finish === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => update({ finish: option.value })}
                  className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    selected
                      ? 'border-brand bg-brand-soft text-brand-strong'
                      : 'border-[#e6dcd3] bg-white text-brand-ink hover:border-brand'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 rounded-full border border-black/15"
                    style={{ backgroundColor: config.finishSwatches?.[option.value] ?? '#d9d4cb' }}
                  />
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor={`${instanceId}-name`} className="mb-2 block text-sm font-semibold text-brand-ink">
            03. ¿Cómo se llama tu mascota?
          </label>
          <input
            id={`${instanceId}-name`}
            type="text"
            value={value.name}
            maxLength={config.maxNameLength}
            onChange={(event) => update({ name: event.target.value })}
            placeholder="Escribe el nombre"
            aria-describedby={`${instanceId}-name-help`}
            className="h-11 w-full rounded-lg border border-[#cfc4bb] bg-white px-3 text-sm text-brand-ink outline-none placeholder:text-[#6b6b6b] focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <p id={`${instanceId}-name-help`} className="mt-1.5 flex justify-between gap-2 text-xs text-brand-ink/70">
            <span>El nombre es necesario para añadir el tag al carrito.</span>
            <span className="shrink-0">
              {value.name.length}{config.maxNameLength ? ` / ${config.maxNameLength}` : ''}
            </span>
          </p>
        </div>

        {config.phoneEnabled && (
          <div>
            <label htmlFor={`${instanceId}-phone`} className="mb-2 block text-sm font-semibold text-brand-ink">
              Teléfono (opcional)
            </label>
            <input
              id={`${instanceId}-phone`}
              type="tel"
              value={value.phone}
              maxLength={config.phoneMaxLength}
              onChange={(event) => update({ phone: event.target.value })}
              placeholder="Escribe el teléfono"
              className="h-11 w-full rounded-lg border border-[#cfc4bb] bg-white px-3 text-sm text-brand-ink outline-none placeholder:text-[#6b6b6b] focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
        )}

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-brand-ink">04. Elige la tipografía</legend>
          <div className="grid grid-cols-3 gap-2">
            {config.fonts.map((option) => {
              const selected = value.font === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => update({ font: option.value })}
                  className={`min-h-[58px] rounded-lg border px-2 py-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    selected
                      ? 'border-brand bg-brand-soft text-brand-strong'
                      : 'border-[#e6dcd3] bg-white text-brand-ink hover:border-brand'
                  }`}
                >
                  <span className="block text-[10px] font-semibold tracking-wide">{option.label}</span>
                  <span
                    className="mt-1 block truncate text-lg leading-tight"
                    style={{
                      fontFamily: option.previewFontFamily,
                      fontWeight: option.previewFontWeight ?? 'normal',
                      fontStyle: option.previewFontStyle ?? 'normal',
                    }}
                  >
                    {previewName}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-brand-ink/70">
            Las muestras son orientativas; se conserva el código de la fuente elegida.
          </p>
        </fieldset>

        <div className="rounded-lg bg-brand-cream px-3 py-3 text-sm">
          <p className="font-semibold text-brand-ink">Tu diseño</p>
          <p className="mt-1 text-brand-ink/80">
            {design.label} · {finish?.label ?? 'Elige un acabado'} · {value.name.trim() || 'Añade un nombre'} · {font.label}
          </p>
        </div>
      </div>
    </section>
  );
}
