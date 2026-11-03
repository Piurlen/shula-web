# shula: catálogo web

Estático (HTML/CSS/JS, sin build). Para verlo en local: `python -m http.server 5173` → http://localhost:5173/vista.html

**Es un catálogo, no un e-commerce.** No hay carrito ni precios. En cada pieza, "armá tu pedido" (cuero, color, medidas, detalles, idea) abre WhatsApp (+54 9 358 424-3970) con el mensaje listo.

| Archivo | Qué es |
|---|---|
| `index.html` | Home |
| `pieza.html?id=top-caida` | Ficha de pieza + pedido por WhatsApp |
| `direccion.html` | Dirección visual + wireframe |
| `vista.html` | Mobile 390 y desktop 1440 lado a lado |
| `js/data.js` | **Editar acá**: WhatsApp, Instagram, categorías, opciones del pedido y piezas |
| `css/shula.css` | Sistema visual (tokens al inicio) |
| `img/web/` | Fotos que usa la web (recortadas y optimizadas) |
| `img/ig/` | Originales bajadas del Instagram (no hace falta subirlas) |
| `img/procesar.py` | Regenera `img/web/` desde `img/ig/`: recorta, borra textos/precios superpuestos (LaMa) y mejora resolución con IA (Real-ESRGAN) |
| `img/logo-referencia.jpg` | Logo que pasaron (referencia) |

## Publicar
El código está en GitHub (**github.com/Piurlen/shula-web**) y Vercel publica solo cada cambio que llega a `main`:
**https://shula-web.vercel.app**

```
git pull
git add -A
git commit -m "Qué cambió"
git push
```

`.vercelignore` deja afuera lo interno y `.gitignore` deja afuera las fotos originales. Para usar **shula.com.ar**: Vercel → shula-web → Settings → Domains.

## Editar desde otra compu (con Claude)
1. Instalar Git, Python y Claude Code.
2. `git clone https://github.com/Piurlen/shula-web.git` y abrir esa carpeta con Claude.
3. Claude lee `CLAUDE.md`, que explica la web, las reglas de la marca y cómo publicar.

## Reemplazar fotos
Cada placeholder es un `<figure class="ph …">` que dice qué toma va. Hay que meterle un `<img>` adentro y la etiqueta se oculta sola:

```html
<figure class="ph t-cognac"><img src="img/cartera-01.jpg" alt="…" loading="lazy"><span class="ph__label">…</span></figure>
```
En el catálogo alcanza con agregar `foto: "img/…jpg"` a la pieza en `js/data.js`.

## Pendiente de shula
- Logo en SVG (hoy se escribe con la tipografía, en minúscula bold)
- Fotos originales de las piezas (las de Instagram están mejoradas con IA, pero una foto original siempre va a verse mejor)
- Fotos de los procesos (la destacada "procesos" de Instagram necesita sesión iniciada)
- Piezas de carteras, cintos y charms, y las descripciones marcadas "[a cargar]"
- Confirmar tipos de cuero, colores y detalles que se ofrecen (`opciones` en `js/data.js`)
- Nombre de la colección / produ y su frase
- Medidas de cada pieza y texto de cuidados
- Licencia de webfont de Century Gothic (hoy, si falta, se usa TeX Gyre Adventor)

## Retoque de fotos
Las fotos de Instagram se mejoraron sin inventar contenido:
- **Real-ESRGAN** (x4) en las que tenían poca resolución: define bordes y textura, no agrega objetos.
- **LaMa** solo para borrar textos, emojis y precios pegados encima (top con caída, tote, llaveros, materas, stand). Nunca sobre el producto en sí.
- Herramientas: `D:/CLAUDE/tools/resr` (Real-ESRGAN) y `pip install simple-lama-inpainting`.
