# Inventario de prompts para imágenes de Miaucraft

> Versión de referencia conservada durante la integración. El inventario vigente está en `inventario-prompts-imagenes.md`.

Prompts de referencia para volver a generar o ampliar el conjunto visual de
`public/images/`. Los archivos listados ya existen; este documento no afirma
que se hayan creado con estos prompts.

## Dirección visual común

- Fotografía editorial de ecommerce, fotorrealista y cálida, con luz natural
  suave y sombras difusas.
- Paleta crema, marfil, rosa suave y rosa Miaucraft; acentos dorados solo en
  herrajes.
- Accesorios para perros y gatos de aspecto artesanal, limpios y creíbles.
- Composición sencilla, premium y acogedora, con textura visible en tela,
  metal y pelaje.
- No añadir texto, letras, logotipos, marcas de agua, etiquetas legibles ni
  accesorios que contradigan la descripción del producto.
- Mantener los productos centrados y completos en las fotos cuadradas; reservar
  espacio negativo donde se indica para permitir texto o recorte adaptable.

## Prompts por archivo

### `home.png` — Hero de la página de inicio

- **Tamaño existente:** 1774 × 887 px (aprox. 2:1).
- **Uso:** hero desktop; el contenido de texto queda a la izquierda.
- **Prompt:** `Fotografía editorial fotorrealista para una marca premium de accesorios para mascotas. Un perro pequeño de pelo crema, tranquilo y mirando a cámara, sentado en un estudio luminoso de color marfil y usando una bandana triangular de tela rosa vivo, bien visible y ajustada de forma natural. Colocar al perro en el tercio derecho; dejar casi la mitad izquierda limpia, clara y sin objetos para texto de una web. Luz de ventana suave, sombras naturales, fondo crema cálido, composición panorámica horizontal 2:1, acabado de fotografía de producto profesional.`
- **Prompt negativo:** `Sin texto ni logotipos; sin collar adicional llamativo; sin bandana deformada, flotante o cubriendo el hocico; sin extremidades duplicadas; sin fondo recargado; sin recorte de orejas, patas o cola.`
- **Composición/continuidad:** conservar aire limpio a la izquierda y el perro completo hacia la derecha. El rosa de la bandana debe armonizar con el rosa de marca.

### `3-gatos.png` — Categoría gatos

- **Tamaño existente:** 1586 × 992 px (aprox. 1.6:1).
- **Uso:** tarjeta de gatos y escenas de producto felino.
- **Prompt:** `Fotografía lifestyle fotorrealista de un gato doméstico atigrado gris descansando sobre un cojín tejido color marfil en una sala luminosa. El gato lleva un collar fino rosa empolvado con una pequeña placa redonda metálica dorada sin grabado. Flores rosas desenfocadas en primer plano, luz natural de mañana, tonos crema y rosa suave, expresión serena, enfoque nítido en el gato y el collar. Encuadre horizontal 16:10, estética editorial cálida de ecommerce.`
- **Prompt negativo:** `Sin texto, letras ni logotipos; sin collar apretado; sin varias placas superpuestas; sin ojos asimétricos, patas duplicadas ni rasgos caricaturescos; sin saturación excesiva.`
- **Composición/continuidad:** dejar al gato como sujeto principal y asegurar que el collar siga visible al recortar a tarjeta.

### `4_collares.png` — Collar

- **Tamaño existente:** 1254 × 1254 px (1:1).
- **Uso:** tarjetas de collar y galería de producto.
- **Prompt:** `Fotografía macro de producto fotorrealista, vista tres cuartos desde arriba: un collar ajustable para mascota hecho de cinta textil tejida rosa empolvado, dispuesto en forma ovalada completa sobre lino marfil. Hebilla y anilla metálicas doradas, proporciones funcionales y costuras visibles. Luz lateral suave, sombras delicadas, una flor rosa desenfocada en la esquina superior izquierda, paleta crema y rosa, composición cuadrada limpia de ecommerce.`
- **Prompt negativo:** `Sin mascota, texto, marca, grabado ni etiqueta; sin hebilla deformada; sin cierres flotantes; sin piezas cortadas por el borde; sin reflejos metálicos quemados.`
- **Composición/continuidad:** mostrar el collar entero y mantener el herraje distinguible a tamaño de miniatura.

### `5_bandana.png` — Bandana

- **Tamaño existente:** 1254 × 1254 px (1:1).
- **Uso:** categoría de perros y productos de bandana.
- **Prompt:** `Fotografía de producto fotorrealista, una bandana triangular rosa coral para perro doblada y anudada en forma de lazo, con tejido suave y costuras finas visibles. Colocarla centrada sobre lino color marfil; incluir flores rosadas muy desenfocadas en el borde superior izquierdo. Luz natural difusa, sombras suaves, textura realista de algodón, composición cuadrada y fondo limpio para tienda online.`
- **Prompt negativo:** `Sin perro, collar, texto, estampado, logotipo ni marca de agua; sin nudo imposible; sin triángulo deformado; sin tela plástica brillante ni elementos cortados.`
- **Composición/continuidad:** rosa cálido y fondo marfil; la silueta triangular debe leerse claramente en miniatura.

### `6_tags.png` — Placas ID

- **Tamaño existente:** 1254 × 1254 px (1:1).
- **Uso:** regalos, tags y productos de identificación.
- **Prompt:** `Fotografía cenital fotorrealista de tres placas de identificación para mascotas, sin grabado, sobre tela de lino marfil: una placa redonda dorada, una con forma de hueso dorada y una con forma de corazón plateada. Cada placa incluye una pequeña argolla metálica realista. Añadir una cinta rosa empolvado parcialmente visible en el borde superior derecho; luz cálida suave, sombras pequeñas, disposición equilibrada con espacio entre piezas, imagen cuadrada de ecommerce.`
- **Prompt negativo:** `Sin letras, números, nombres, huellas, logotipos ni marca de agua; sin argollas duplicadas; sin formas fundidas entre sí; sin metal cromado exagerado; sin piezas fuera del encuadre.`
- **Composición/continuidad:** los tres tags deben ser distintos y reconocibles; superficies lisas listas para personalización.

### `7_charms.png` — Charm con forma de hueso

- **Tamaño existente:** 1254 × 1254 px (1:1).
- **Uso:** detalle de charm y productos de tag con forma de hueso.
- **Prompt:** `Fotografía de producto en primer plano, fotorrealista, de una única placa metálica dorada con forma de hueso para mascota, sin grabado, unida a una argolla pequeña. La pieza reposa en el centro de una tela de lino color marfil; una cinta rosa suave desenfocada entra desde una esquina sin tapar el producto. Luz difusa cálida, brillo metálico controlado y textura fina, composición cenital cuadrada con bastante aire alrededor.`
- **Prompt negativo:** `Sin texto, letras, números, logotipo ni huellas; sin varias placas; sin hueso deformado; sin argolla rota; sin reflejos blancos quemados ni fondo oscuro.`
- **Composición/continuidad:** priorizar la silueta de hueso completa y el acabado dorado mate/satinado.

### `8_banner.png` — Banner de taller

- **Tamaño existente:** 2172 × 724 px (aprox. 3:1).
- **Uso:** historia de marca o banner de taller.
- **Prompt:** `Fotografía panorámica fotorrealista de una mesa de trabajo artesanal para accesorios de mascotas en una habitación luminosa. Herramientas pequeñas, carretes de hilo rosa, piezas metálicas para tags y tela crema se agrupan en el tercio derecho; la mitad izquierda queda despejada como espacio negativo. Luz de ventana, madera clara, flores rosadas discretas al fondo, tonos marfil y rosa empolvado, ambiente cuidado y real, encuadre horizontal extremadamente ancho 3:1 para banner web.`
- **Prompt negativo:** `Sin personas, texto, logotipos, marcas de agua, desorden excesivo, herramientas peligrosas en primer plano ni productos flotantes; sin repetir objetos de forma evidente.`
- **Composición/continuidad:** concentrar los objetos en la derecha y dejar suficiente espacio libre a la izquierda para un recorte con texto.

### `9_guia blog.png` — Guía para medir el cuello

- **Tamaño existente:** 1672 × 941 px (aprox. 16:9).
- **Uso:** guía de tallas y contenido educativo.
- **Prompt:** `Fotografía educativa fotorrealista, plano medio cercano de una persona midiendo con cuidado el contorno del cuello de un perro pequeño de pelo claro usando una cinta métrica textil rosa. El perro está tranquilo, de perfil, en una habitación luminosa con fondo crema; manos colocadas correctamente y cinta apoyada suavemente, sin apretar. Enfoque claro en la medición y el pelaje, luz natural cálida, composición horizontal 16:9 apta para una guía web.`
- **Prompt negativo:** `Sin números o texto legibles en la cinta; sin cinta sobre la garganta o los ojos; sin gesto de tirón; sin manos deformes, dedos extra ni perro angustiado; sin marcas de agua.`
- **Composición/continuidad:** mostrar claramente dónde pasa la cinta y mantener una interacción amable y segura.

### `10_nosotros.png` — Historia de marca

- **Tamaño existente:** 1586 × 992 px (aprox. 1.6:1).
- **Uso:** página Nosotros y sección de marca.
- **Prompt:** `Fotografía lifestyle fotorrealista de una persona cuidando a un perro pequeño color crema mientras comprueba el ajuste de un accesorio rosa alrededor del cuello. Mostrar al perro tranquilo y la interacción cuidadosa desde un ángulo lateral o posterior, con manos naturales y proporciones correctas. Estudio casero luminoso, fondo crema, detalles rosa empolvado, luz de ventana cálida, sensación auténtica de trabajo artesanal, composición horizontal 16:10.`
- **Prompt negativo:** `Sin texto, logotipos, marca de agua, instrumentos apretando el cuello, perro incómodo, manos deformes ni apariencia de clínica veterinaria.`
- **Composición/continuidad:** enfatizar cuidado y prueba de ajuste, no una sesión médica ni una pose publicitaria rígida.

### `11_open graph.png` — Vista previa al compartir

- **Tamaño existente:** 1729 × 910 px (aprox. 1.9:1).
- **Uso:** Open Graph y vista previa social.
- **Prompt:** `Fotografía editorial fotorrealista para la vista previa social de una marca de accesorios para mascotas. Un perro pequeño de pelo crema, alegre y mirando a cámara, ocupa el tercio derecho y lleva una bandana rosa empolvado con una placa redonda dorada discreta. Fondo de estudio marfil cálido con flores rosas desenfocadas en la esquina superior derecha; dejar espacio negativo amplio y claro a la izquierda para que la plataforma pueda superponer información. Luz natural suave, encuadre horizontal cercano a 1.9:1, alta legibilidad al reducirse a miniatura.`
- **Prompt negativo:** `Sin texto ni logotipo generado; sin marca de agua; sin accesorios deformes, placas con letras, ojos asimétricos, patas duplicadas ni fondo recargado.`
- **Composición/continuidad:** mantener la cara del perro y la bandana dentro de la zona segura central para recortes de redes sociales.

## Notas de uso

- Generar primero en la proporción indicada y después adaptar versiones responsive
  mediante recorte; evitar estirar imágenes.
- Revisar físicamente cada accesorio generado frente al producto real antes de
  usarlo como fotografía de ficha, pues una imagen conceptual no garantiza que
  el producto comercial tenga exactamente esa forma o acabado.
- Las imágenes de gatos/perros son escenas editoriales; no presentarlas como
  clientes reales ni como reseñas/testimonios.
