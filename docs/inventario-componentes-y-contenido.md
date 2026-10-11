# Inventario de componentes y contenido: Miaucraft v2

Estado: borrador para revisión. Base: `docs/benchmark-ecommerce-usa-v2.md`, wireframes `docs/wireframes/01-05`, código actual `src/`, referencias de cascarón de Vitablue y Rivera, y auditoría de la tienda publicada.

Leyenda de origen:
- **V** = Vitablue (cascarón público: navbar, footer, drawer móvil, tarjetas, hero, blog, FAQ).
- **R** = Rivera (cascarón administrativo: AppShell, tablas, drawers, badges, diálogos). Solo para admin/LoopDev, no para la tienda pública.
- **N** = nuevo, específico de ecommerce.
- **S** = Shopify (lo renderiza o controla Shopify; no lo construimos).
- **M** = Miaucraft actual (ya existe en `src/`).

---

## 1. Cascarón compartido (todas las pantallas)

| Componente | Origen | Qué hace | Notas |
|---|---|---|---|
| `Shell` público (`PublicLayout`) | V (`components/layouts/PublicLayout`) + M | Envuelve header, main y footer, y gestiona `<title>`/canonical | Ya existe una versión mínima en M |
| `Header` sticky con logo, búsqueda, cuenta y carrito | V (`organisms/Navbar`) + M (`layout/Navbar`) | Navegación principal y acceso a carrito | M ya tiene sticky y dropdown de colecciones |
| `MegaMenu` de categorías | N (patrón de V) | Dropdown con imagen por categoría | Sustituye al dropdown simple de M |
| `MobileDrawer` (menú hamburguesa) | V (`Drawer`) + M | Menú móvil con acordeón de categorías | Bloquea scroll; cierra con Escape |
| `SearchBar` / `SearchOverlay` | N | Buscador con sugerencias de producto | Pendiente de decidir: Shopify Search & Discovery o propio |
| `CartIndicator` (badge) | N | Número de artículos | Dato desde Shopify Cart API |
| `AccountLink` | N | Login o cuenta | Shopify Customer Accounts; ver §4 |
| `AnnouncementBar` | N | Envío gratis desde $49, devoluciones 30 días | Texto en CMS, configurable |
| `Footer` multicolumna | V (`organisms/Footer`) + M | Enlaces, newsletter, redes, pagos, legales | M ya tiene versión mínima |
| `NewsletterSignup` | V (`CtaBanner`/`InputText`) | Captura email | Integrar con LoopDev CRM |
| `SocialLinks` | V (`atoms/WhatsAppIcon` patrón) | Iconos Instagram, TikTok, Pinterest, YouTube | Handle actual: `miaucraft.pawlovers` |
| `Breadcrumbs` | V (`molecules/Breadcrumbs`) | Ruta de navegación | Obligatorio en colección y producto |
| `FloatingCart` / `MiniCart` (drawer) | N | Carrito lateral, muestra total y envío | Ver wireframe 04 |
| `CookieBanner` | V (`organisms/CookieBanner`) | Consentimiento | Requerido en US según CCPA/CPRA y en UE (pública) |
| `FloatingChat` | V (`FloatingWhatsApp`) | Soporte | Decidir: WhatsApp no aplica igual en US; usar chat o email |
| `Button`, `Badge`, `InputText`, `Checkbox` | V (`atoms`) | Átomos | Ajustar tokens de Miaucraft |
| `Logo` | M (`layout/Logo`) | Wordmark | Usar `logo_en_conjunto...png` (ver §5) |

---

## 2. Inventario por pantalla

### 2.1 Home (`/`)
Referencia: `wireframes/01-home` (si existe) y benchmark §componentes.

| Bloque | Componente | Origen | Estado en M |
|---|---|---|---|
| Hero con foto ambientada y CTA | `HeroBanner` (patrón V `BrandHero`) | V + N | Falta: M solo tiene texto |
| Barra de confianza (envío, devolución, pago seguro) | `TrustBar` (V `ProductTrustBar`) | V | Falta |
| Categorías en tarjetas | `CategoryCard` (V `ProductCategoryCard`) | V | Falta |
| Bestsellers (carrusel) | `ProductCarousel` + `ProductCard` (V `ProductCard`) | V + N | M tiene grid simple |
| Bloque de historia de marca | `BrandStory` (V `SectionIntro`) | V | Falta |
| Reseñas | `ReviewWall` / `TestimonialCard` (V) | V | Falta; reseñas reales requieren fuente (Shopify reviews app o Judge.me) |
| Blog o guías destacadas | `BlogPostCard` (V `BlogPostCard`) | V | Falta |
| Newsletter | `NewsletterSignup` | V | Falta |
| Footer | `Footer` | V + M | Parcial |

### 2.2 Colección / listado (`/coleccion/:handle`)
Referencia: `wireframes/02-collection`.

| Bloque | Componente | Origen |
|---|---|---|
| Cabecera de colección con imagen y descripción | `CollectionHeader` (V `BlogHeader` patrón) | V + N |
| Barra de filtros y orden | `FilterBar` (V `BlogFilterBar`) + `FilterDrawer` (V `Drawer`) | V |
| Grid de productos | `ProductGrid` + `ProductCard` | V |
| Badge de stock y precio | `Badge` (V) + `PriceTag` (N) | V + N |
| Paginación o "Cargar más" | `Pagination` (R `components/ui/pagination`) | R |
| Estado vacío | `EmptyState` (R `common/EmptyState`) | R |
| Skeleton de carga | `LoadingState` / `ProductCardSkeleton` (R `common/LoadingState`) | R |

### 2.3 Producto (`/producto/:handle`)
Referencia: `wireframes/03-product`.

| Bloque | Componente | Origen |
|---|---|---|
| Galería de imágenes con miniaturas y zoom | `ProductGallery` (N) | N |
| Selector de variante (color, talla) | `VariantSelector` (N) | N |
| Selector de talla y guía de tallas | `SizeGuideDialog` (N, usa imagen `Descripcion_Size_Details`) | N |
| Precio, comparación y stock | `ProductPrice` (N) | N |
| Botón añadir al carrito | `Button` (V) | V |
| Compra rápida / pago express | `ExpressCheckout` (S) | S |
| Acordeones de detalle, envío y devoluciones | `Accordion` (V `molecules/Accordion`) | V |
| Hero de producto con trust bar | `ProductHero` / `ProductTrustBar` (V) | V |
| Productos relacionados | `ProductCarousel` | V + N |
| Reseñas del producto | `ReviewWall` | V |
| Ficha de transparencia (materiales, fabricación) | `ProductTransparencySection` (V) | V |
| Breadcrumbs | `Breadcrumbs` (V) | V |
| Sticky de compra móvil | `StickyAddToCart` (N) | N |

### 2.4 Carrito (`/cart` o drawer)
Referencia: `wireframes/04-cart`.

| Bloque | Componente | Origen |
|---|---|---|
| Lista de líneas (imagen, variante, cantidad, precio) | `CartLine` (N) | N |
| Cantidad editable | `QuantityStepper` (N) | N |
| Resumen con subtotal, envío estimado y total | `OrderSummary` (N, patrón R `DetailDrawer`) | N + R |
| Código de descuento | `DiscountInput` (N, Shopify) | S |
| Envío gratis hasta $49 | `FreeShippingProgress` (N) | N |
| Botón checkout | `Button` | V |
| Cross-sell | `ProductCarousel` | V |

### 2.5 Checkout
Referencia: `wireframes/05-checkout`. Shopify Checkout es alojado y solo personalizable en parte.

| Bloque | Componente | Origen |
|---|---|---|
| Formulario de contacto, envío y pago | Shopify Checkout | S |
| Branding del checkout (logo, colores) | Configuración Shopify Checkout | S |
| Resumen de pedido lateral | Shopify Checkout | S |
| Pagos y wallets (Apple Pay, Shop Pay, PayPal) | Shopify Payments | S |
| Página de confirmación | Shopify thank-you + `OrderConfirmation` propio (opcional) | S + N |

### 2.6 Cuenta (`/cuenta`)
| Bloque | Componente | Origen |
|---|---|---|
| Login y registro | Shopify Customer Accounts | S |
| Historial de pedidos | `OrderList` (R `DataTable`) | R (solo si se construye fuera de Shopify) |
| Direcciones | Shopify | S |
| Wishlist | `WishlistGrid` (N) | N, fase 2 |

### 2.7 Búsqueda (`/buscar`)
| Bloque | Componente | Origen |
|---|---|---|
| Campo y resultados | `SearchResults` (N) + `ProductGrid` | N |
| Filtros | `FilterBar` | V |
| Sin resultados | `EmptyState` (R) | R |

### 2.8 Blog y guías (`/blog`, `/blog/:slug`)
Referencia: benchmark §blog. Patrón completo en Vitablue.

| Bloque | Componente | Origen |
|---|---|---|
| Listado con filtros | `BlogList` + `BlogFilterBar` + `BlogPostCard` (V) | V |
| Cabecera de artículo | `ArticleHeader` (V) | V |
| Renderizado de bloques | `BlogSectionRenderer` (V) | V |
| Índice de contenido | `ArticleToc` (V) | V |
| CTA al producto | `BlogAdvisorCta` (V) adaptado a producto | V |
| Autor y fecha | `AdvisorCard` (V) | V |

### 2.9 Acerca de, contacto, FAQ, legales
| Página | Componentes | Origen |
|---|---|---|
| Nosotros | `SectionIntro`, `TestimonialGrid`, `IllustrationGallery` (V) | V |
| Contacto | `ContactChannelCard` (V) + `FormField` (V) | V |
| FAQ | `FaqSection` (V) + `Accordion` | V |
| Envíos y devoluciones | `StaticPage` (M) + `Accordion` | M + V |
| Privacidad, términos, aviso | `LegalPage` (V `LegalPage` de Rivera `info/LegalPage` como referencia) | V + R |
| Política de cookies | `CookiesPolicy` (V) | V |
| 404 | `NotFoundPage` (M) | M |

---

## 3. Componentes exclusivos del admin (LoopDev, no la tienda)

| Componente | Origen | Uso |
|---|---|---|
| `AppShell`, `Sidebar`, `Topbar` | R (`components/layout`) | Panel de administración |
| `PageHeader`, `PageContainer`, `SurfaceCard` | R (`common`) | Estructura de páginas admin |
| `DataTable`, `TablePagination`, `TableSkeleton` | R | Catálogo, pedidos, inventario |
| `StatCard`, `ChartCard` | R | KPIs |
| `ProductDialog`, `CategoryDialog`, `OrderForm` | R (`features/commerce`) | Alta/edición en LoopDev |
| `StatusBadge` | R | Estado de stock y pedido |
| `ConfirmDialog`, `DetailDrawer` | R | Acciones destructivas |
| `CommandMenu` | R | Búsqueda rápida |

---

## 4. Integración por pantalla con Shopify y LoopDev

| Pieza | Fuente de verdad | Mostrada en |
|---|---|---|
| Catálogo y precio | LoopDev (PIM) → Shopify | Home, colección, producto |
| Stock | LoopDev (maestro) → Shopify | Producto, carrito |
| Carrito, checkout, pago | Shopify | Carrito, checkout |
| Clientes y campañas | LoopDev (CRM) | Newsletter, cuenta |
| Blog y guías | Contenido propio (`src/`) o CMS | Blog |
| Reseñas | App de Shopify o LoopDev | Producto, home |

---

## 5. Auditoría de imágenes y contenido de la tienda publicada

Decisiones: **Conservar** (usar en v2), **Reeditar** (usar pero con mejor calidad), **Descartar**, **Revisar** (depende de confirmación).

**Decisión (usuario):** se conservan **todas** las imágenes actuales en v2. Los ítems marcados "Revisar" en este apartado pasan a Conservar. Pendiente: identificar las imágenes que faltan y cómo conseguirlas o generarlas.

### 5.1 Logo y marca
| Archivo | Uso actual | Decisión | Destino en v2 |
|---|---|---|---|
| `logo_en_conjunto_png_1540.5_x_473.4_para_web.png` | Logo de cabecera | Conservar | `Logo` (header y footer) |
| `Trans.Gata_MiauCraft_2000_x_2000.png` | Favicon | Conservar | `favicon` y avatar de redes |
| `Trans1._Main.png`, `Trans2.png` | Ilustraciones | Revisar | Hero o sección de marca |

### 5.2 Hero y ambientadas
| Archivo | Decisión | Destino |
|---|---|---|
| `FOTO_AMBIENTADA_ROUND.png` | Conservar | Hero de home |
| `Main.png` | Conservar | Hero o imagen de colección |
| `Main_7f71c129...png` | Revisar (duplicado de `Main.png`) | Comparar y eliminar uno |
| `Untitled-2.png` | Revisar | Banner promocional |
| `Gemini_Generated_Image_*` (3) | Descartar | Imágenes generadas por IA, no representan la marca; reemplazar por foto real |

### 5.3 Fotos de producto
| Archivo | Decisión | Destino |
|---|---|---|
| `cuffed-beanie-*` (navy, royal, white, heather-grey, baby-pink) | Conservar la mejor versión de cada color | Galería de producto |
| `cuffed-beanie-*` (versiones repetidas) | Descartar duplicados | — |
| `pet-bandana-collar-black-{s,m,l,xl}-front-*` | Conservar (una por talla) | Galería de bandana, selector de talla |
| `pet-bandana-collar-animal-print` (imágenes) | Revisar | Colección bandanas |
| `Hoodie_Negro.png` | Revisar (producto sin ficha activa) | Solo si hay producto |
| `DSA001_-_CHERRY_BLOSSOM.png` | Conservar | Colección bandanas |
| `M016-Paw_Single.png` | Conservar | Colección ID tags |
| `Trans.Gata_MiauCraft_2000_x_2000.png` | Conservar | Producto Tag Cat |
| `Bone_*` (gold, silver) | Conservar | Colección ID tags |
| `cara_de_gato_*` (gold, silver) | Conservar | Colección Tag Cat |
| `Pendiente.png`, `detalle_cristal.png` | Revisar | Galería de detalle (macro) |
| `1.Main.png`, `2.Golden.png`, `2._Silver.png` | Conservar | Variantes de tag |
| `DOG.png` | Revisar | Escena con mascota, sirve al hero o a la ficha |
| `blanco.jpg` | Descartar si es fondo sin producto | — |

### 5.4 Guía de tallas
| Archivo | Decisión | Destino |
|---|---|---|
| `Descripcion_Size_Details*.png` | Reeditar (pasar a tabla HTML) | `SizeGuideDialog` |

### 5.5 Equipo y social
| Archivo | Decisión | Destino |
|---|---|---|
| `bayron.jpg`, `paula.jpg`, `taylor.jpg` | Revisar (confirmar que son del equipo y que hay permiso) | Página Nosotros |
| `perro_amazon.jpg` | Conservar (decidido: foto propia). Está en el carrusel de íconos del homepage, sin `alt`. Añadir texto alternativo. | Carrusel de la home |

### 5.6 Colecciones
| Archivo | Decisión | Destino |
|---|---|---|
| `cuffed-beanie-navy-front-*.jpg` | Reeditar | Miniatura de colección |
| `genera-una-imagen-de-kay-chain-...png` | Descartar (prompt de IA en el nombre, colección vacía) | — |
| `lapiz_*.png` | Revisar | Sin colección clara |
| `pet-bandana-collar-black-xl-front-*.png` | Descartar (duplicado de talla XL) | — |

### 5.7 Contenido y catálogo
| Elemento | Decisión |
|---|---|
| 23 productos en la tienda; 19 reales en `products.ts` | Conservar 19 y revisar precios |
| Precios $0.99 y $0.00 | Descartar (errores o tags sin venta) |
| `test-one`, `golden-cat`, `bone-product` | Descartar (pruebas) |
| Bandanas agotadas | Revisar: ocultar, o mostrar con "avisar cuando llegue" |
| Páginas `privacy-policy`, `terms` | Reeditar con revisión legal en US |
| Colecciones vacías (Embroidery, Kay Chain) | Descartar del menú hasta tener productos |

---

### 5.8 Imágenes que faltan (por pantalla)

| Pantalla | Imagen necesaria | Estado actual | Cómo conseguirla |
|---|---|---|---|
| Home: hero | Foto ambientada de marca (escritorio 16:9 y móvil vertical) | Falta. Solo hay `DOG.png` y `Gemini_Generated_Image…` | Generación IA (ver §5.9) |
| Home: categorías | Una imagen por categoría (collares, bandanas, tags, huesos) | Parcial | Generación IA (ver §5.9) |
| Home: historia de marca | Foto de marca o del equipo | Parcial (`bayron`, `paula`, `taylor`) | Generación IA (ver §5.9) |
| Colección: cabecera | Banner por colección | Parcial (algunas colecciones tienen imagen) | Generación IA (ver §5.9) |
| Producto: galería | 4–6 fotos: fondo blanco, ambientada y detalle | Parcial: entre 2 y 9 fotos por producto | Fotos reales de producto (no IA) |
| Producto: guía de tallas | Ilustración de tallas | Existe (`Descripcion_Size_Details`) | Reeditar si la calidad es baja |
| Blog: cabecera por artículo | Imagen de cabecera | Falta | Generación IA (ver §5.9) |
| Nosotros | Foto de taller o marca | Falta | Generación IA (ver §5.9) |
| Confianza (envío, pago, devolución) | Iconos | Falta | SVG propio, no foto |
| Compartir en redes (Open Graph) | 1200×630 por página | Falta | Plantilla generada a partir de las imágenes IA |

### 5.9 Brief de imágenes generadas por IA

**Estado:** las 11 imágenes están creadas en `docs/assets/ia/` como composiciones gráficas (SVG renderizado a PNG) con la paleta de marca. Son marcadores de diseño, no fotografías. Sirven para maquetar las pantallas y reemplazarlas después por fotos reales o generación fotográfica con IA, usando los prompts de esta tabla.

| Archivo en `docs/assets/ia/` | Tamaño |
|---|---|
| `IA-HOME-HERO-D.png` | 2400×1200 |
| `IA-HOME-HERO-M.png` | 1080×1350 |
| `IA-HOME-CAT-SCENE.png` | 1600×1000 |
| `IA-CAT-COLLAR.png`, `IA-CAT-BANDANA.png`, `IA-CAT-TAGS.png`, `IA-CAT-BONE.png` | 1200×1200 |
| `IA-COLL-BANNER.png` | 2400×800 |
| `IA-BLOG-HEADER.png` | 1600×900 |
| `IA-ABOUT-STUDIO.png` | 1600×1000 |
| `IA-OG-SHARE.png` | 1200×630 |

**Reglas:**
- La IA genera solo escenas, fondos y cabeceras. Las fotos de producto siempre son reales, porque la IA no puede reproducir con exactitud los diseños, tallas ni materiales.
- Ninguna imagen muestra texto, logos ni marcas de terceros. El texto va en la web, no en la imagen.
- Paleta: rosa `#E52C77`, cream `#FFF8F1`, rosa suave `#FFE0E4`, tinta `#101010`. Luz de estudio cálida, estilo editorial.
- Negativo común: `text, watermark, logo, brand name, distorted paws, extra limbs, deformed face, plastic skin, cluttered background, low resolution`.
- Cada imagen se revisa a mano antes de publicarse. Se guarda el prompt exacto y la versión en `docs/assets/ia/`.

| ID | Pantalla y uso | Tamaño | Prompt (en inglés) |
|---|---|---|---|
| `IA-HOME-HERO-D` | Home, hero escritorio | 2400×1200 | "Editorial pet photography, a small dog wearing a pink bandana with a subtle silver tag, sitting on a warm cream backdrop with soft pink shadows, warm studio light, empty space on the left third for a headline, premium e-commerce style, natural fur detail, shallow depth of field" |
| `IA-HOME-HERO-M` | Home, hero móvil | 1080×1350 | Igual que la anterior, encuadre vertical, sujeto centrado en el tercio inferior |
| `IA-HOME-CAT-SCENE` | Home, sección de historia o gato | 1600×1000 | "Cat wearing a golden collar with a small bone-shaped tag, lying on a cream linen cushion next to a pink soft-focus flower, warm morning light, editorial lifestyle photo" |
| `IA-CAT-COLLAR` | Home, tarjeta categoría collares | 1200×1200 | "Close-up of a pet collar on a cream velvet cloth, soft pink background, studio light, shallow depth of field" |
| `IA-CAT-BANDANA` | Home, tarjeta categoría bandanas | 1200×1200 | "Pet bandana folded on a cream background with a small pink flower, soft daylight, minimal styling" |
| `IA-CAT-TAGS` | Home, tarjeta categoría tags | 1200×1200 | "Pet ID tags laid on a cream surface with a pink ribbon and soft shadows, macro photo, warm studio light" |
| `IA-CAT-BONE` | Home, tarjeta categoría huesos | 1200×1200 | "Bone-shaped metal pet charm on a cream background with a small pink petal, macro, warm studio light" |
| `IA-COLL-BANNER` | Cabecera de colección (plantilla, una por colección) | 2400×800 | "Abstract pink and cream backdrop with soft light and a single accessory silhouette at the right third, minimal, premium, empty space on the left for a title" |
| `IA-BLOG-HEADER` | Cabecera de artículo de guía | 1600×900 | "Two hands measuring a dog's neck with a soft tape measure, cream background, warm soft light, no face visible" |
| `IA-ABOUT-STUDIO` | Página Nosotros | 1600×1000 | "Craft studio desk with small jewelry tools, pink and cream palette, soft window light, no people, editorial" |
| `IA-OG-SHARE` | Compartir en redes (1200×630) | 1200×630 | Se genera con plantilla: fondo de `IA-HOME-HERO-D` con el logo y el título encima |

**Pendiente para sustituirlas por fotos fotográficas:**
1. Elegir la herramienta de generación fotográfica y confirmar sus términos de uso comercial.
2. Definir la raza y el color de los perros y gatos, para mantener coherencia en toda la web.

## 6. Supuestos a confirmar

1. **Idioma y moneda (decidido):** tienda bilingüe inglés/español con precios en USD.
2. **Envío y devoluciones (pendiente):** no hay política publicada en la web actual. Las cifras de los wireframes ($49, 30 días, $9) son propuestas, no se usan hasta definirlas.
3. **Badges "Nuevo" y "Bestseller" (decidido):** solo se muestran con datos reales.
4. **Reseñas (decidido):** app de Shopify.
5. **Soporte (decidido):** chat de Shopify Inbox, igual que la web actual. La web actual no tiene WhatsApp.
6. **Stack del prototipo (decidido):** Tailwind propio como Vitablue, sin shadcn.
7. **Vista previa en GitHub Pages (decidido):** pública. El repo ya es público.
8. **Fotos de equipo (decidido):** `bayron`, `paula` y `taylor` son del equipo y tenemos permiso. Se conservan.
9. **`perro_amazon.jpg` (decidido):** foto propia del equipo o de un cliente. Se conserva en el carrusel de íconos de la home, con texto alternativo.

---

## 7. Siguientes pasos

1. Confirmar supuestos de §6 y decisiones de §5 marcadas como "Revisar".
2. Elegir el cascarón definitivo: Vitablue para la tienda pública y Rivera solo para LoopDev.
3. Crear wireframes móviles (06 home, 07 producto) y la página de guía (08).
4. Plan de implementación por pantalla, siguiendo `module-plan`.
