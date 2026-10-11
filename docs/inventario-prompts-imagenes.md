# Inventario de prompts para imágenes

Prompts de producción para preparar una futura sustitución de las composiciones de referencia de Miaucraft por imágenes fotográficas. Este documento no genera ni reemplaza archivos.

## Estado y reglas comunes

- **Estado:** 11 prompts preparados para los assets de referencia; no se generaron imágenes. Los PNG existentes continúan siendo las composiciones de referencia de `docs/assets/ia/` y sus copias públicas en `public/images/ia/`.
- **Estilo:** fotografía editorial cálida, natural y limpia; fondos marfil `#FFF8F1`, acentos rosa `#E52C77` y rosa suave `#FFE0E4`, con detalles oscuros `#101010`. El rosa es un acento, no un fondo dominante.
- **Marca y texto:** no generar logotipos, letras, números, marcas de agua, etiquetas legibles, insignias, precios ni claims. El logotipo y cualquier texto se incorporan después en la interfaz o en una plantilla.
- **Fidelidad comercial:** las escenas con accesorios son imágenes ambientales genéricas, no fotografías de SKU. No inventar estampados, materiales, herrajes, medidas, grabados, certificaciones ni características del catálogo. Las fotos de fichas de producto deben ser fotos reales del artículo exacto.
- **Consistencia:** si una misma sesión genera varias imágenes, conservar la identidad visual de las mascotas de las escenas lifestyle: perro pequeño mestizo de pelaje crema/canela y gato doméstico gris atigrado. No implican que sean mascotas reales de Miaucraft.
- **Entrega sugerida:** PNG, sRGB, dimensiones exactas del asset. Revisar rostro, ojos, patas, correas, siluetas y recorte a tamaño móvil antes de sustituir un archivo.

## Asset seleccionado y aportado (sin generación)

### Hero actual de la home

- **Archivo:** `public/images/home.png` (copia sin cambios del archivo aportado por el usuario).
- **Ubicación:** imagen principal del hero en `src/pages/HomePage.tsx`.
- **Tamaño / proporción:** **1774 × 887 px**, aproximadamente **2:1**.
- **Estado:** archivo existente proporcionado por el usuario y usado tal cual. **No requiere prompt ni generación.** El hash SHA-256 del original y de la copia es `27b5ec3634aa085e8c70878cc6e6ff7c2eba48a6f76976bd816a17384d44c371`.
- **Continuidad / composición:** fotografía de un perro pequeño de pelaje claro con bandana rosa y placa, situado a la derecha sobre fondo marfil; el espacio negativo izquierdo funciona con el texto actual del hero. Mantener el archivo original intacto. `IA-HOME-HERO-D.png` permanece en el inventario de assets de referencia, pero ya no es la imagen que muestra el hero actual.

## Prompts por asset

### 1. Hero de home — escritorio

- **Archivo:** `IA-HOME-HERO-D.png` en `docs/assets/ia/` y `public/images/ia/`
- **Ubicación / salida:** hero de inicio en escritorio; **2400 × 1200 px**, proporción **2:1**.
- **Prompt:** Fotografía editorial fotorrealista para la cabecera de una tienda de accesorios para mascotas. Un perro pequeño mestizo de pelaje crema/canela, aspecto natural y expresión tranquila, sentado en un estudio luminoso sobre fondo marfil cálido. Lleva únicamente una bandana rosa lisa y un pequeño colgante metálico sin letras ni diseño identificable; ambos deben parecer genéricos, no reproducir un producto concreto. Composición panorámica 2:1: deja el tercio izquierdo despejado, sencillo y de bajo contraste para colocar después un titular; sitúa al perro en el tercio derecho, con aire alrededor y sin cortar orejas ni patas. Luz suave de ventana, sombras rosa muy pálido, textura real del pelaje, paleta crema con rosa `#E52C77` discreto, acabado editorial de ecommerce cuidado y natural.
- **Negativo / restricciones:** texto, letras, números, logotipo, marca de agua, marcas comerciales, insignias, precio, estrellas o reseñas; collar o bandana con patrón inventado; grabados legibles; múltiples mascotas; pose agresiva; anatomía deformada; patas u orejas extra; ojos artificiales; piel/plástico; fondo recargado; sombras duras; saturación alta; desenfoque del sujeto; recorte de cabeza o extremidades.
- **Composición / continuidad:** mantener espacio negativo real a la izquierda, no añadir objetos sobre esa zona. Debe poder recortarse a formatos más estrechos conservando al perro completo; coordinar su aspecto con la versión móvil.

### 2. Hero de home — móvil

- **Archivo:** `IA-HOME-HERO-M.png` en `docs/assets/ia/` y `public/images/ia/`
- **Ubicación / salida:** variante vertical del hero de inicio; **1080 × 1350 px**, proporción **4:5**.
- **Prompt:** Crear la versión vertical 4:5 de la fotografía editorial de la cabecera de Miaucraft. Usar el mismo perro pequeño mestizo de pelaje crema/canela y la misma bandana lisa rosa genérica de la versión de escritorio, con colgante metálico pequeño y completamente en blanco. Estudio cálido marfil `#FFF8F1`, iluminación suave de ventana y sombras rosadas muy tenues. Colocar al perro centrado horizontalmente en el tercio inferior, encuadrado con aire por encima y a los lados; reservar la parte superior para texto que se añadirá después. Fotografía fotorrealista, natural, elegante y coherente con una marca de accesorios para mascotas.
- **Negativo / restricciones:** texto o letras en cualquier forma, logotipo, marca de agua, símbolos comerciales, patrones o grabados inventados, producto con apariencia distinta a la escena de escritorio, recorte de orejas/cabeza/patas, anatomía incorrecta, extremidades extra, ojos irreales, accesorios flotantes, fondo abarrotado, contraste agresivo, rosa fluorescente.
- **Composición / continuidad:** tratar de conservar la misma identidad visual, tono de pelaje, bandana y luz del hero de escritorio; adaptar el encuadre verticalmente, no estirar ni recortar la versión panorámica. Dejar zona superior despejada y legible para una superposición posterior.

### 3. Escena de gato en casa

- **Archivo:** `IA-HOME-CAT-SCENE.png` en `docs/assets/ia/` y `public/images/ia/`
- **Ubicación / salida:** escena lifestyle para inicio o historia de marca; **1600 × 1000 px**, proporción **8:5**.
- **Prompt:** Fotografía editorial fotorrealista de un gato doméstico gris atigrado descansando relajado sobre un cojín de lino color marfil en una casa luminosa. El gato lleva un collar sencillo de tono cálido con un pequeño colgante metálico liso, sin letras, grabado ni forma de producto reconocible. Una flor rosa suave aparece desenfocada en un borde del encuadre; luz matinal natural, textura de lino y pelaje realistas, composición horizontal 8:5 con el gato como protagonista y espacio visual tranquilo alrededor. Paleta cálida `#FFF8F1`, rosa `#FFE0E4` como acento leve y negros naturales; sensación cercana y serena, sin escenografía excesiva.
- **Negativo / restricciones:** texto, logo, marca de agua, etiquetas o grabados; afirmaciones visuales sobre el accesorio; manos sujetando al gato; pose de estrés, dientes expuestos o pupilas artificiales; ojos asimétricos; patas, cola u orejas extra; pelaje de plástico; flores que tapen al animal; habitación desordenada; luz fría o flash duro; colores chillones.
- **Composición / continuidad:** ambiente doméstico realista, no taller ni estudio de producto. Mantener espacio de recorte a ambos lados para adaptar la escena a distintos bloques; el accesorio es ambiental y no una representación de un SKU.

### 4. Categoría de collares

- **Archivo:** `IA-CAT-COLLAR.png` en `docs/assets/ia/` y `public/images/ia/`
- **Ubicación / salida:** tarjeta cuadrada de categoría en inicio; **1200 × 1200 px**, proporción **1:1**.
- **Prompt:** Fotografía macro editorial de un collar genérico para mascota, ordenado en una curva suave sobre una superficie textil marfil `#FFF8F1`. Mostrar materiales y cierres sin marca, sin herrajes distintivos ni detalles que sugieran una especificación concreta. Añadir un pequeño acento rosa suave en el fondo, iluminación cálida difusa, sombras blandas, textura nítida y composición minimalista cuadrada. El collar debe quedar entero dentro del encuadre y reconocerse como accesorio para mascota sin incluir al animal.
- **Negativo / restricciones:** texto, marca, logotipo, etiqueta, grabado, precio, packaging, claims de seguridad, hebillas flotantes, cierre imposible, piezas metálicas deformadas, varias correas cruzadas, producto cortado, objetos desordenados, reflejos quemados, fondo rosa saturado.
- **Composición / continuidad:** centrar el accesorio y dejar margen uniforme para recortes responsive. No presentar el collar como el diseño exacto de ningún producto actual.

### 5. Categoría de bandanas

- **Archivo:** `IA-CAT-BANDANA.png` en `docs/assets/ia/` y `public/images/ia/`
- **Ubicación / salida:** tarjeta cuadrada de categoría en inicio; **1200 × 1200 px**, proporción **1:1**.
- **Prompt:** Fotografía editorial cenital de una bandana lisa de tela rosa suave doblada con cuidado sobre una superficie marfil cálida. Añadir una única flor pequeña desenfocada como acento y una sombra natural de ventana. La tela debe verse real, suave y sin estampado reconocible; no mostrar cierres ni costuras técnicas inventadas. Estética minimalista de ecommerce, paleta crema `#FFF8F1` con rosa `#FFE0E4` y un toque de `#E52C77`, encuadre cuadrado y producto completo.
- **Negativo / restricciones:** letras, logotipos, marca de agua, patrón, bordado o diseño no confirmado; hebilla o botón inventado; animal parcial; manos; múltiples bandanas; flor cubriendo la tela; arrugas excesivas; fondo cargado; color neón; textura plástica; producto fuera de cuadro.
- **Composición / continuidad:** vista cenital limpia, lectura inmediata de la categoría y espacio de aire alrededor para recorte 1:1. La bandana es una escena genérica, no una foto de producto vendible.

### 6. Categoría de tags / placas

- **Archivo:** `IA-CAT-TAGS.png` en `docs/assets/ia/` y `public/images/ia/`
- **Ubicación / salida:** tarjeta cuadrada de categoría en inicio; **1200 × 1200 px**, proporción **1:1**.
- **Prompt:** Fotografía macro editorial de dos o tres placas de identificación genéricas para mascotas, metálicas y lisas, colocadas sobre lino color marfil. Las superficies deben estar completamente en blanco, sin letras, números, símbolos, grabado ni forma exclusiva de una marca. Incorporar una cinta rosa muy discreta y sombras cálidas suaves; composición cuadrada, ordenada, con detalle metálico realista, reflejos controlados y espacio entre cada pieza. Estilo de estudio artesanal limpio, no catálogo técnico.
- **Negativo / restricciones:** texto o pseudo-letras, nombres, teléfonos, códigos QR, logotipos, marca de agua, marcas comerciales, formas de SKU específicas, precios, packaging; placas duplicadas superpuestas, agujeros imposibles, bordes deformados, reflejos espejo quemados, dedos/manos, fondo desordenado.
- **Composición / continuidad:** mantener las placas dentro del cuadro y separadas visualmente; no simular personalización ni prometer que el grabado está incluido.

### 7. Categoría de charms con forma de hueso

- **Archivo:** `IA-CAT-BONE.png` en `docs/assets/ia/` y `public/images/ia/`
- **Ubicación / salida:** tarjeta cuadrada de categoría de accesorios; **1200 × 1200 px**, proporción **1:1**.
- **Prompt:** Fotografía macro de un charm metálico genérico con silueta sencilla de hueso, colocado sobre una superficie marfil mate. Acabado metálico neutro, sin color de baño, logotipo, grabado, inscripción ni detalle identificable como un artículo específico. Un pétalo rosa suave puede aparecer desenfocado en el borde para conectar con la paleta Miaucraft. Iluminación de estudio cálida y difusa, sombra suave, reflejos controlados, composición cuadrada con el charm completo y centrado.
- **Negativo / restricciones:** hueso comestible real, producto para consumo, letras, símbolos, marca de agua, marca comercial, grabado, packaging, mosquetón o enganche inventado, deformación de la silueta, reflejos metálicos quemados, múltiples charms amontonados, colores neón.
- **Composición / continuidad:** comunicar “accesorio/charm”, no alimento ni juguete. Mantener el mismo fondo y temperatura de color que las tarjetas de collares, bandanas y tags.

### 8. Banner de colección

- **Archivo:** `IA-COLL-BANNER.png` en `docs/assets/ia/` y `public/images/ia/`
- **Ubicación / salida:** cabecera panorámica reutilizable en colecciones; **2400 × 800 px**, proporción **3:1**.
- **Prompt:** Fondo panorámico abstracto para una cabecera de ecommerce de mascotas, proporción 3:1. Gradiente muy sutil y capas de papel/textil en marfil `#FFF8F1` y rosa pálido `#FFE0E4`, con luz de estudio cálida y textura apenas perceptible. En el tercio derecho, una sola silueta fotográfica genérica y discreta de un accesorio para mascota, parcialmente fuera de foco y sin detalles de producto identificables. Mantener al menos los dos tercios izquierdos limpios, luminosos y de bajo contraste para que el título de la colección se añada en HTML. Elegante, minimalista y compatible con recortes bajos de escritorio y móvil.
- **Negativo / restricciones:** texto, tipografía, letras, logotipo, marca de agua, iconos, etiquetas, claims, producto reconocible, patrones o grabados inventados, demasiados objetos, alto contraste detrás del área de título, rosas saturados, ruido, viñeta oscura.
- **Composición / continuidad:** el área izquierda debe conservar contraste suficiente para texto negro superpuesto; no integrar título en píxeles. Mantener los elementos principales lejos de los bordes superior e inferior por los recortes responsive.

### 9. Cabecera de guía del blog

- **Archivo:** `IA-BLOG-HEADER.png` en `docs/assets/ia/` y `public/images/ia/`
- **Ubicación / salida:** cabecera de artículo o guía de tallas; **1600 × 900 px**, proporción **16:9**.
- **Prompt:** Fotografía editorial fotorrealista, plano cercano de dos manos cuidadosas midiendo el cuello de un perro pequeño y tranquilo con una cinta métrica flexible de costura. Mostrar solo manos, cinta y una parte natural del pelaje; no mostrar rostro humano. La cinta puede verse, pero sus marcas y números deben quedar fuera de foco o fuera de cuadro para no comunicar medidas. Fondo marfil cálido, luz de ventana suave, composición horizontal 16:9 con espacio despejado en un lado para el título añadido después, tono didáctico y amable, sin parecer una consulta veterinaria.
- **Negativo / restricciones:** números o medidas legibles, texto, logotipo, marca de agua, collar apretado, presión sobre el animal, señales de estrés, manos deformes, dedos extra, cinta atravesando el cuerpo, herramienta rígida o peligrosa, fondo clínico, objetos desordenados, promesas sobre tallas o ajuste.
- **Composición / continuidad:** transmitir la acción de medir con suavidad sin presentar instrucciones numéricas. Dejar margen superior/lateral para superponer el título de la guía sin tapar la acción.

### 10. Historia / estudio

- **Archivo:** `IA-ABOUT-STUDIO.png` en `docs/assets/ia/` y `public/images/ia/`
- **Ubicación / salida:** bloque editorial de “Nosotros” o historia; **1600 × 1000 px**, proporción **8:5**.
- **Prompt:** Fotografía editorial de una mesa de trabajo ordenada en un estudio luminoso: herramientas pequeñas de manualidades y piezas metálicas genéricas sobre una superficie de madera clara y lino marfil, con una tela rosa suave doblada como acento. Luz natural lateral de ventana, paleta crema `#FFF8F1`, rosa `#FFE0E4` y detalles negros discretos. Encuadre horizontal 8:5, profundidad de campo moderada, composición tranquila con un área de aire para texto de página. Sin personas; mostrar un espacio de trabajo posible, no una fábrica ni evidencia de un método de producción concreto.
- **Negativo / restricciones:** texto, logos, marca de agua, marca comercial, manos/personas, herramientas peligrosas, equipo industrial, desorden, productos terminados con formas o grabados reconocibles, afirmaciones visuales de fabricación artesanal, certificados, etiquetas, colores saturados, luz fría o sombras duras.
- **Composición / continuidad:** mantener herramientas como utilería ambiental secundaria. La imagen no debe afirmar que un artículo concreto está hecho a mano, probado o fabricado en ese espacio.

### 11. Open Graph / compartir

- **Archivo:** `IA-OG-SHARE.png` en `docs/assets/ia/` y `public/images/ia/`
- **Ubicación / salida:** base visual para compartir la home; **1200 × 630 px**, proporción **40:21**.
- **Prompt:** Crear una fotografía editorial panorámica para la imagen Open Graph de Miaucraft, proporción 40:21. Un perro pequeño mestizo de pelaje crema/canela con una bandana rosa lisa y un colgante metálico genérico completamente en blanco aparece en el tercio derecho, sobre un fondo marfil cálido con sombras suaves rosa pálido. Reservar el 45 % izquierdo como espacio negativo claro y uniforme para superponer después, mediante una plantilla, el logotipo oficial y el título de la página. Luz cálida de estudio, textura natural, composición limpia que siga siendo reconocible en una miniatura pequeña.
- **Negativo / restricciones:** cualquier texto, letra, logotipo, marca de agua, nombre de marca, interfaz falsa, insignias, precio, estrellas/reseñas, patrones o grabados de producto inventados, objetos sobre el área izquierda, mascotas adicionales, anatomía deformada, accesorios flotantes, saturación alta o fondo ruidoso.
- **Composición / continuidad:** esta imagen es solo el fondo fotográfico. Añadir logotipo y titular después con recursos oficiales; no pedir al generador que reproduzca la identidad visual. Mantener sujeto y área despejada dentro de una zona segura central para recortes de plataformas.

## Control antes de sustituir un PNG

1. Generar y revisar la imagen a tamaño completo y en los recortes reales de escritorio/móvil.
2. Confirmar que no contenga texto accidental, anatomía anómala, marcas ni detalles que puedan confundirse con especificaciones reales del catálogo.
3. Validar licencia y condiciones comerciales de la herramienta antes de publicar.
4. Exportar con el nombre exacto del asset y actualizar de forma coordinada `docs/assets/ia/` y `public/images/ia/`; no reemplazar fotos de producto reales por imágenes generadas.
