# AGENTS.md

Guía para agentes y colaboradores de `miaucraft`.

## Stack
- Vite 6, React 19, TypeScript, Tailwind 3, react-router-dom 7.
- Catálogo y checkout: Shopify (Storefront API). El checkout siempre es de Shopify.

## Reglas
- Mobile-first: sin anchos fijos, usar `flex-wrap` y `grid`. Mantener el meta viewport.
- Tokens de marca en `tailwind.config.js`: `brand` (DEFAULT #E52C77 rosa, strong #C81E63 para botones con texto blanco, soft #FFE0E4, cream #FFF8F1, ink #101010). Fuentes: Poppins (display) e Inter (texto).
- Fuentes: Poppins (display) e Inter (texto).
- Nunca usar tokens de Admin API en el frontend; solo tokens públicos de Storefront.
- Flujo de ramas: trabajar en `feature/*` → PR a `develop`. Solo `develop` puede abrir PR a `main`.

## Comandos
- `npm ci`, `npm run dev`, `npm run typecheck`, `npm run build`.
