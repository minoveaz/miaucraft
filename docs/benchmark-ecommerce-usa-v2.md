# Benchmark ecommerce USA (v2): tiendas de mascotas

Estado: **borrador de trabajo**. Sin commit ni PR.
Mercado: Estados Unidos, USD, inglés.
Sustituye como referencia ampliada a `benchmark-ecommerce-usa.md` (v1).

Leyenda de verificación:
- **[V]** verificado en la página en vivo con fetch directo.
- **[B]** procedente de búsqueda web (resumen automático). Puede estar desactualizado o contener errores. Verificar antes de decidir.
- **[X]** bloqueado (429, 404 o redirección) o no comprobado.

---

## 0. Cobertura y limitaciones

| Tienda | Web | Acceso | Notas |
|---|---|---|---|
| Wild One (wildone.com) | Shopify, tema Dawn 13.0.1 personalizado | [V] | Datos de plataforma verificados en el HTML |
| Ruffwear (ruffwear.com) | Shopify (rutas `/blogs/`, `/collections/`) | [V] parcial | Home y blog legibles; la página de colección devolvió solo texto de ayuda |
| BARK (bark.co) | Custom o Shopify (no confirmado) | [X] | `barkbox.com` redirige a una página de sorteo. Sin datos de catálogo |
| Blueberry Pet (blueberrypet.com) | Shopify (no confirmado) | [X] | Solo se obtiene el aviso "You have successfully subscribed!" |
| Kurgo (kurgo.com) | Headless: imágenes en `cdn.sanity.io` | [V] parcial | `/collections/all` da 404. Probable CMS Sanity + frontend propio |
| Chewy (chewy.com) | Custom | [X] | 429 (rate limit). Solo datos de búsqueda |
| Max & Molly (max-molly.com/en-es) | Custom | [V] en v1 | Tienda alemana en EUR. No es referencia de mercado USA |

Conclusión de cobertura: **la mayoría de datos de componentes proceden de búsqueda**. Antes de decidir la UI final hay que recorrer en navegador real (no con fetch) las 4 tiendas de referencia principales: Chewy, Ruffwear, Wild One y BARK.

---

## 1. Resumen ejecutivo

- Las tiendas que venden en USA con buen rendimiento combinan **navegación por necesidad** (tipo de mascota, categoría, problema a resolver) con **páginas de producto muy explicativas** (tallas, materiales, garantía, reseñas).
- **Ruffwear** y **Wild One** usan la marca como historia: blog, UGC y tono de comunidad. Miaucraft puede copiar la parte de contenido sin copiar el estilo outdoor.
- **Chewy** demuestra que el valor de recurrencia está en Autoship y en la atención posventa. Para Miaucraft no aplica el catálogo masivo, pero sí la idea de suscripción o "reponer" para consumibles.
- **BARK** usa suscripción como producto principal. Miaucraft no necesita suscripción el primer trimestre, pero conviene dejar el hueco en la arquitectura.
- Miaucraft debe pasar de "catálogo Shopify con plantilla" a **tienda con jerarquía clara**: 4 colecciones principales, ficha de producto con tallas y reseñas, carrito lateral y checkout delegado en Shopify.

---

## 2. Enfoque visual

| Aspecto | Wild One [V] | Ruffwear [V/B] | Chewy [B] | BARK [B/X] | Blueberry [B] | Kurgo [V/B] |
|---|---|---|---|---|---|---|
| Tipografía | ModernEra (fuente propia) | Sans limpia | Sans estándar | Display redondeada | Serif/sans decorativa | Sans limpia |
| Color | Neutros cálidos, acentos sobrios | Verde/naranja outdoor, mucho blanco | Azul y blanco funcional | Colores vivos por caja | Pastel, patrones | Azul/neutro |
| Imagen | Lifestyle con perro, fondo limpio | Fotografía de aventura y producto | Producto + promoción | Producto en caja y mascota | Producto + modelo | Producto en coche |
| Densidad | Media, mucho espacio | Media-alta | Alta (muy cargada) | Media | Media-alta | Media |
| Tono | Cercano y cuidado | Aventura, técnico | Utilitario y conveniente | Divertido | Moda y estilo | Seguridad y viaje |

**Lección para Miaucraft:** el tono de marca rosa `#E52C77` debe ser un acento, no el fondo de todo. Blanco o crema `#FFF8F1` como base, imagen de producto grande con mascota real, tipografía geométrica (Poppins para títulos, Inter para texto).

Recomendación de imagen: **fondo neutro en fotos de producto** y **lifestyle con mascota** en la home y colecciones. Evitar fotos de catálogo genéricas.

---

## 3. Customer journey

### 3.1 Recorrido típico en estas tiendas

1. **Llegada** (redes, búsqueda, anuncio). Home con promoción visible y acceso a colecciones.
2. **Descubrimiento**: menú por mascota, categoría o necesidad (ej. "Harnesses", "For puppies", "Travel").
3. **Comparación**: filtros (talla, color, precio), reseñas y ficha con tallas.
4. **Ficha de producto**: galería, selector de variante, tabla de tallas, beneficios, reseñas, envío y devoluciones visibles.
5. **Carrito**: drawer lateral con subtotal, envío estimado y upsell.
6. **Checkout**: express (Shop Pay, Apple Pay, PayPal) y tarjeta.
7. **Post compra**: email de confirmación, seguimiento y solicitud de reseña.
8. **Retención**: suscripción, programa de puntos, email/SMS y contenido en blog o redes.

### 3.2 Fricciones detectadas (a validar en navegador)

- Muchas tiendas muestran **envío gratis con umbral** en la cabecera. Es una palanca de conversión, no un detalle.
- La **tabla de tallas** es crítica en arneses y collares. Ruffwear la integra en la ficha; Miaucraft tiene "Sizes" en bandanas y collares pero debe revisarse.
- **Reseñas con fotos** aparecen en Ruffwear (Okendo) [B]. Miaucraft no tiene reseñas aún: prioridad alta cuando haya clientes.

---

## 4. Componentes y navegación

| Componente | Wild One [V] | Ruffwear [V/B] | Chewy [B] | BARK [B] | Blueberry [B] | Recomendación Miaucraft |
|---|---|---|---|---|---|---|
| Barra de anuncio | Sí | Sí | Sí (promos) | Sí | Sí (multi-compra) | Sí: envío gratis + garantía |
| Header | Logo centrado, búsqueda, carrito | Logo, búsqueda, cuenta | Mega menú por mascota | Logo, cuenta | Logo, búsqueda | Logo, búsqueda, carrito, cuenta |
| Menú principal | Colecciones | Por categoría y por actividad | Por mascota y tipo de producto | Por caja y tipo | Por línea de producto | 4 colecciones + "Sobre nosotros" |
| Mega menú | No (sencillo) | Sí, con actividades | Sí, muy amplio | No | Sí | Mega menú ligero con imagen por colección |
| Buscador | Predictivo | Sí | Predictivo, búsquedas populares | Sí | Sí | Predictivo (Shopify Predictive Search) |
| Cards de producto | Imagen, nombre, precio | Imagen, precio, estrellas | Imagen, precio, reseñas, opciones | Imagen, precio | Imagen, precio | Imagen con hover, precio, badge, estrellas |
| Badges | Nuevo, bestseller | Nuevo | Oferta | Nuevo | Nuevo, colaboración | Nuevo, Solo quedan X, Bestseller |
| Ficha: variantes | Sí | Tallas y colores | Opciones | Cajas | Tallas y colores | Tallas en selector visual + tabla |
| Ficha: reseñas | Sí | Sí, con fotos | Sí | Sí | Sí | Fase 2 (reseñas con fotos) |
| Carrito | Drawer | Página/drawer [X] | Página | Drawer | Drawer | **Drawer lateral** con envío estimado |
| Checkout | Shopify (express + tarjeta) | Shopify | Propio | Propio | Shopify | **Shopify Checkout** (sin cambios) |
| Footer | Enlaces de política, redes | Ayuda, tiendas, redes | Amplio (servicios) | Amplio | Enlaces, redes | Políticas, contacto, redes, newsletter |
| Newsletter | Sí | Sí | Sí | Sí | Sí | Sí, con cupón de bienvenida |
| Cuenta de usuario | Sí | Sí | Sí | Sí | Sí | Fase 2 (Shopify Customer Accounts) |

---

## 5. Blog y presencia en redes

| Tienda | Blog | Redes [B] | Observación |
|---|---|---|---|
| Ruffwear | **Sí**, sección "Explored" en la home [V] | Instagram ~434k [B] | Blog de historias, guías y diseño. Modelo de contenido más fuerte del set |
| Wild One | Sí en tema (no comprobado en detalle) [X] | Instagram ~186k (de v1) [B] | Programa de embajadores: no comprobado en esta pasada [X] |
| BARK | Sí [B] | TikTok ~306k [B] | Suscripción con temas mensuales. Fuerte en contenido de caja |
| Chewy | Sí, contenido de cuidado [B] | Redes amplias [B] | Contenido orientado a salud y consejos |
| Blueberry | Poco [B] | Instagram activo [B] | Enfocado a colaboraciones y moda |
| Kurgo | Sí (footer, guías) [B] | Instagram [X] | Guías de viaje con perro |

**Lección:** el blog con **guías útiles** (cómo medir un arnés, viajar con perro, limpiar un collar) es más valioso que el blog de noticias. Miaucraft debe empezar con 6-8 guías de compra antes de publicar noticias.

Cifras de seguidores son **[B]**. No usar para decisiones de presupuesto sin revisarlas en cada perfil y con fecha.

---

## 6. Estado de verificación

| Dato | Estado |
|---|---|
| Wild One: plataforma Shopify Dawn 13.0.1, USD, pagos Shop Pay/Apple Pay/PayPal | [V] (HTML) |
| Wild One: blog y programa de embajadores | Embajadores [V]; blog [X] |
| Ruffwear: sección "Explored" en la home, navegación por categoría y actividad | [V] (home), [B] (menú) |
| Ruffwear: reseñas con Okendo y fotos | [B] |
| Kurgo: CMS headless (imágenes Sanity) | [V] (CDN). Confirmar stack [X] |
| Kurgo: guías de viaje en blog/footer | [B] |
| BARK: suscripción desde $24/mes, cajas por estilo de juego | [B]. Pendiente de verificar en `bark.co` |
| BARK: TikTok ~306k | [B] |
| Blueberry: Shopify, colaboraciones, multi-compra | [B] |
| Chewy: Autoship (35% primer pedido, 5% recurrente) | [B] |
| Chewy: mega menú por mascota | [B] |
| Instagram Ruffwear ~434k, Wild One ~186k | [B] (fechas inciertas) |

**Pendiente antes de decidir UI:**
1. Recorrer en navegador real la home, colección, ficha, carrito y checkout de Chewy, Ruffwear, Wild One y BARK (escritorio y móvil).
2. Confirmar el número de seguidores de cada cuenta con captura y fecha.
3. Revisar `bark.co/collections/*` y `wildone.com/blogs/*` para contar artículos y frecuencia.

---

## 7. Recomendaciones para Miaucraft

### Imprescindible (MVP)
1. Navegación por **4 colecciones** claras (bandanas, collares/ID, tags, accesorios nuevos) con mega menú ligero.
2. **Ficha de producto** con galería, selector de variante, tabla de tallas, envío, devoluciones y garantía visibles.
3. **Cards de producto** con imagen hover, precio, badge y estado de stock.
4. **Carrito drawer** con subtotal y envío estimado. Checkout en Shopify.
5. **Barra de anuncio** con envío y garantía.
6. Footer con políticas, contacto y redes. Newsletter con cupón.
7. Búsqueda predictiva.
8. Eliminar cualquier producto o sección de prueba (ya hecho en `baaebdb`).

### Debería tener (fase 2)
1. Reseñas con fotos (Okendo o similar).
2. Blog con 6-8 guías de compra (tallas, viaje, limpieza, ID tags).
3. Cuentas de cliente y pedidos (Shopify Customer Accounts).
4. Ficha con "comprar juntos" o kits.

### Más adelante
1. Suscripción para consumibles (ahora no aplica).
2. Programa de embajadores (estilo Wild One).
3. Integración de inventario desde LoopDev (ver estrategia de integración).

---

## 8. Riesgos y decisiones abiertas

- **Datos de competidores incompletos.** Chewy y BARK no se pudieron verificar en vivo. La decisión de navegación para Chewy debe tomarse con recorrido en navegador.
- **Idioma y moneda:** la web es para USA. Confirmar inglés como idioma principal (no español).
- **Copyright:** no copiar fotografía, copy ni diseño de tiendas de referencia. Usar sólo como guía de patrones.
- **Fuentes de la marca:** KG Lego House (live site) tiene licencia desconocida. Usar Poppins/Inter o una fuente con licencia clara.
