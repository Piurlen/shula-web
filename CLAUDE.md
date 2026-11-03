# shula: web catálogo

Web de **shula**, marca de piezas de cuero de Martina (Río Cuarto, Córdoba). Instagram @shula.rc · WhatsApp +54 9 358 424-3970.
Publicada en **https://shula-web.vercel.app** (más adelante, shula.com.ar).

## Reglas de la marca (no romper)
- **Es un catálogo, no un e-commerce.** Sin carrito, sin checkout, sin precios. Los pedidos se arman en la ficha de cada pieza y se mandan por WhatsApp.
- Estética editorial y premium, muy fotográfica. Paleta: crema, cognac, chocolate, bordó y latón (tokens al inicio de `css/shula.css`). Tipografía Century Gothic (si falta, se usa TeX Gyre Adventor, en `fonts/`).
- Evitar: gradientes decorativos, sombras, tarjetas redondeadas, glassmorphism, neón y textos genéricos.
- Voz: voseo, cercana y canchera, como en el Instagram. Los textos de "Sobre shula" y de "Devolución" los escribió Martina: no reescribirlos sin que lo pida.
- No inventar productos, medidas ni datos. Lo que falta está marcado como `[a cargar]`.
- Fotos reales de shula. Se pueden mejorar (recorte, nitidez), pero nunca cambiar el producto.

## Cómo está hecha
HTML + CSS + JavaScript, sin frameworks y sin build. **No migrar a Next.js ni a otro framework.**

| Archivo | Qué es |
|---|---|
| `index.html` | Home. Orden: portada (bolso) → Nuestras piezas (categorías que filtran) → Destacadas → Proceso (video) → Personalizados → Cómo pedir → Sobre shula → Reels → Devolución → pie |
| `pieza.html?id=…` | Ficha de pieza + "armá tu pedido" por WhatsApp |
| `js/data.js` | **Casi todo se edita acá**: WhatsApp, Instagram, categorías (con foto), opciones del pedido (cuero, color, detalles), piezas (nombre, categoría, fotos, descripción) y reels |
| `js/shula.js` | Comportamiento: catálogo, filtros, ficha, mensaje de WhatsApp, animaciones |
| `css/shula.css` | Estilos |
| `img/web/` | Fotos que usa la web (JPG optimizados, lado largo máximo 1600–2000 px, menos de 500 KB) |
| `vista.html` | Vista de prueba: mobile y desktop lado a lado (no se publica) |
| `direccion.html` | Dirección visual del proyecto (no se publica) |

### Tareas comunes
- **Agregar una pieza**: sumar un objeto en `piezas` de `js/data.js` (`id`, `nombre`, `categoria` = slug de `categorias`, `tono`, `fotos: ["img/web/….jpg"]`, `descripcion`). La primera foto es la principal.
- **Cambiar la foto de una categoría**: `foto` en `categorias` de `js/data.js`.
- **Agregar un reel**: sumarlo al principio de `posts` en `js/data.js`, con la miniatura vertical (9:16) en `img/web/reel-<código>.jpg`.
- **Fotos nuevas**: guardarlas en `img/web/` optimizadas (JPG con calidad ~84, lado largo ≤ 1600 px). Las originales pesadas no van al repositorio.
- **Video del proceso**: en `index.html` hay un comentario `VIDEO PENDIENTE` con el `<video>` listo. Los archivos van en `video/proceso-mobile.mp4` (9:16) y `video/proceso-desktop.mp4` (16:9), comprimidos (menos de 8 MB cada uno, sin audio).
- **Pendiente de fotos**: Brazaletes, Tabaqueras (categorías y destacada) y el video del proceso.

## Ver los cambios en la compu
```
python -m http.server 5173
```
Abrir http://localhost:5173 (o http://localhost:5173/vista.html para ver mobile y desktop). Revisar siempre en 390 px de ancho (mobile) y en 1440 px (desktop), y que no haya errores en la consola.

## Publicar
La web se publica sola en Vercel cada vez que se sube un cambio a la rama `main` de GitHub:
```
git add -A
git commit -m "Qué cambió"
git push
```
En uno o dos minutos se actualiza https://shula-web.vercel.app. Antes de hacer push, traer los cambios del otro lado con `git pull`, porque también se edita desde otra compu.
