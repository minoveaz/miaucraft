# Benchmark ecommerce USA: Wild One y Max & Molly

Estado: segunda pasada. Wild One: lectura directa del HTML público de Shopify. Max & Molly: verificada en navegador en `https://www.max-molly.com/en-es` (la tienda real). `www.maxandmolly.com` es una página de dominio en venta (GoDaddy), no la tienda. Max & Molly es una marca alemana con precios en EUR y envío gratis solo en Alemania. Es una referencia de UX y estructura, no de mercado USA.

## 1. Enfoque visual de producto

### Wild One (wildone.com)
- Marca de accesorios premium para perros (arneses, correas, grooming, juguetes), con enfoque en "better essentials" y un tono de estilo de vida, no de tienda de mascotas genérica.
- Tipografía: ModernEra (Medium y Bold, cargadas como woff2 desde el tema). Estilo sans geométrico, contemporáneo.
- Tema: Shopify Dawn 13.0.1 personalizado (`wild-one-dawn`). Base limpia, sin skin pesado.
- Mensaje principal: "Better Essentials For Dogs". Copy corto y de comunidad ("Join The Pack", programa de embajadores).
- Imagen: foto de estilo de vida con perros, fondo neutro, colección "Shop All" con imagen de portada vertical (2000x2500).
- Precios en USD, locale `en-US`, país `US`, Apple Pay y PayPal/Venmo activos.

### Max & Molly (max-molly.com/en-es, verificada)
- Marca de accesorios urbanos para perros y gatos, con estampados llamativos por colección (Garden, Kindergarten, Little Monsters, Tropical, Cherry Bloom).
- Enfoque de producto: "GOTCHA! Smart ID Collar" (collar con tag QR y app de perfil de mascota) es el producto estrella, con variantes por estampado. También Soundshield (ultrasonido contra garrapatas y pulgas), H-Harness y Multi Function Leash.
- Mensaje de portada: "Finally available" con el nuevo tag GOTCHA! y CTA "Discover Now". Sin imagen de lifestyle en el hero visible en texto; a revisar en capturas.
- Barra de confianza en home: envío gratis (en Alemania desde €39,90), atención telefónica, "Quality since 2010", "500,000+ satisfied customers", pagos (Klarna, PayPal, tarjeta).
- Reseñas en home con 720 opiniones (en alemán e inglés), y precios con "From €15,90" en la card.
- Categorías del menú: Leashes, Harnesses, Collars, Matrix Ultra LED, Accessories, Grooming, Raincoats, Bathrobes, Toys.
- Enlaces de utilidad: B2B, cuenta, carrito, selector de idioma, búsqueda, FAQ, guía de tallas, sobre nosotros, devoluciones (14 días).

### Lectura para Miaucraft
- Ambas marcas usan fotografía de mascota en uso, no fondos de catálogo.
- Paleta limpia y pocos colores de acento. Miaucraft (rosa `#E52C77`) puede servir de acento único si el resto es neutro.
- Personalización visible (Max & Molly) es el patrón más cercano a nuestros id tags y bandanas.

## 2. Customer journey

Pasos típicos observados en tiendas de este tipo (Wild One confirmado en estructura Shopify; Max & Molly a verificar):

1. **Descubrimiento**: home con hero de estilo de vida, anuncio superior (envío, promociones), colecciones por tipo de producto y por tipo de mascota.
2. **Navegación**: menú de categorías (perro/gato, tipo de producto), buscador, filtros por talla, color y precio.
3. **Listado**: grid de cards con imagen de hover (segunda foto), nombre, precio, opciones de color, badges ("New", "Best seller").
4. **Producto**: galería grande, selector de talla con guía de tallas, opción de personalización, reseñas, bloque "Complete the look".
5. **Carrito**: drawer lateral (no página nueva), subtotal, envío gratis por umbral, sugerencias de upsell.
6. **Checkout**: Shopify Checkout (en Miaucraft se mantiene), express pay (Apple Pay, Shop Pay, PayPal).
7. **Post-compra**: email de confirmación, cuenta de cliente, programa de fidelidad o embajadores.

## 3. Componentes y estructura de navegación

| Componente | Wild One | Max & Molly | Recomendación Miaucraft |
|---|---|---|---|
| Anuncio superior | Sí (promos y envíos) | Sí (barra "Novelties" con enlace a novedades) | Barra con envío y promos |
| Header | Logo, menú, búsqueda, cuenta, carrito | Logo, menú, búsqueda, B2B, idioma, cuenta, carrito | Logo, menú con mega menú, búsqueda, carrito |
| Mega menú | A verificar | Menú de categorías en barra (enlaces directos) | Por categoría con imágenes |
| Búsqueda | Predictiva (Shopify) | Campo de búsqueda en header | Predictiva |
| Card de producto | Imagen, nombre, precio | Imagen, nombre, "From" precio, número de reseñas, "+N" variantes | Imagen con hover, nombre, precio, colores |
| Filtros | Por tipo y precio | A verificar | Talla, color, precio, tipo de mascota |
| Página de producto | Galería, descripción, compra | A verificar (abrir ficha de producto) | Galería, selector de talla, personalización, reseñas |
| Carrito | Drawer / página | Página de carrito (`/cart`) | Drawer lateral con upsell |
| Checkout | Shopify | A verificar (Klarna, PayPal, tarjeta anunciados) | Shopify Checkout |
| Footer | Enlaces, newsletter | Marketing, legal, contacto, pagos, Facebook/Instagram/TikTok | Newsletter, redes, políticas |
| Móvil | Menú hamburguesa | Botón "Toggle menu" en header | Menú a pantalla completa, CTA sticky en producto |

## 4. Blog y redes sociales

### Wild One
- Blog: no confirmado. `/blogs/news` no devolvió contenido de blog en la lectura directa.
- Instagram: alrededor de 186.000 seguidores (según búsqueda, a verificar).
- TikTok: @wildonepets, unos 6.500 seguidores según búsqueda (cifra baja respecto a Instagram; a verificar).
- Email: lista grande (más de 500.000 suscriptores según búsqueda), probablemente su canal principal.
- Presencia en retail: Petco, Target, Chewy, Nordstrom (según búsqueda).

### Max & Molly
- Blog: enlace `/blogs/news` presente en el sitio (contenido no abierto; verificar).
- Redes verificadas por enlace en la tienda: Instagram `@maxmollyurbanpets`, TikTok `@maxmolly_official`, Facebook `maxmollyurbanpets`. Cifras de seguidores no verificadas.
- Amazon: no verificado en esta pasada.

### Implicación para Miaucraft
- El blog de Max & Molly es de contenido de marca, no de noticias. Es una buena referencia para SEO de personalización.
- Email y comunidad (Wild One) pesan más que el blog para la conversión.

## 5. Qué copiar y qué no

Copiar:
- Hero de estilo de vida con mascota real.
- Cards con segunda imagen en hover.
- Personalización visible en la página de producto.
- Drawer de carrito y CTA sticky en móvil.
- Anuncio superior con envío y promociones.

No copiar:
- Estilo visual exacto. Miaucraft debe tener identidad propia (rosa de marca, Poppins/Inter).
- Mega menú con demasiadas categorías. Miaucraft tiene 3 colecciones reales; el menú debe ser corto.

## 6. Pendientes de verificación

- Abrir una ficha de producto de Max & Molly y el checkout (no revisados).
- Abrir `/blogs/news` y revisar contenido (no revisado).
- Confirmar número de seguidores en Instagram y TikTok con capturas.
- Confirmar si Max & Molly tiene tienda USA o solo UE (solo se ve EUR y envío a Alemania).
- Revisar checkout y cuenta de cliente de ambas tiendas.
- Revisar versión móvil de ambas.
