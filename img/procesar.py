"""Procesa las fotos de Instagram para la web de shula.

Pasos por foto:
  1. Recorte (fracciones x0, y0, x1, y1 del original) buscando encuadre vertical amplio.
  2. Borrado de textos/stickers superpuestos (no del producto) con LaMa, solo dentro de
     rectángulos marcados, detectando los píxeles del texto por color.
  3. Mejora de resolución con Real-ESRGAN (x4) cuando el lado corto queda < 1400 px.
  4. Ajuste a 1600 px de lado largo y JPEG optimizado.

Uso:  python img/procesar.py [nombre ...]      (sin nombres = todas)
Requiere: tools/resr (Real-ESRGAN ncnn), pip: pillow numpy simple-lama-inpainting
"""
import os, sys, subprocess, tempfile
import numpy as np
from PIL import Image, ImageFilter

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, "ig")
OUT = os.path.join(BASE, "web")
RESR = os.path.abspath(os.path.join(BASE, "..", "..", "tools", "resr", "realesrgan-ncnn-vulkan.exe"))
DEBUG = os.path.join(BASE, "_debug")

# nombre: (original, recorte, [zonas con texto superpuesto (fracciones del RECORTE)], modo)
#   modo "claro": texto blanco/crema y emojis; "todo": toda la zona se reconstruye
FOTOS = {
    "hero-lago":        ("DccGByaFOjI_0",   (0, 0, 1, 1), []),
    "minifalda":        ("DcNAr61lOlZ_0",   (0.2, 0.16, 1, 1), []),
    "minifalda-2":      ("DcNAr61lOlZ_2",   (0.3, 0, 1, 1), []),
    "minifalda-espalda":("DccGByaFOjI_4_v", (0, 0, 1, 1), []),
    "faja":             ("DcNAr61lOlZ_1",   (0.36, 0.1, 1, 0.43), []),
    "top-rojo":         ("Dc9KEallE4O_5",   (0.25, 0.36, 1, 1), []),
    "top-caida":        ("Dd49SFPihJC_0_v", (0, 0, 1, 0.82), [(0.1, 0.46, 0.9, 0.7, "claro")]),
    "canas-1":          ("DccGByaFOjI_2",   (0, 0, 1, 1), []),
    "canas-2":          ("DccGByaFOjI_3",   (0, 0, 1, 1), []),
    "canas-3":          ("DccGByaFOjI_1_v", (0, 0, 1, 1), []),
    "canas-4":          ("DbmfUAjjWxn_0",   (0, 0, 1, 0.7), []),
    "canas-5":          ("DbmfUAjjWxn_1",   (0, 0, 0.54, 1), []),
    "canas-medida":     ("DbmfUAjjWxn_2",   (0, 0, 1, 1), []),
    "canas-grupo":      ("DcNAr61lOlZ_3",   (0, 0.22, 0.8, 0.78), []),
    "portalentes":      ("DdHNlHtuid6_0",   (0, 0, 1, 1), []),
    "portalentes-2":    ("Dc9KEallE4O_4",   (0.12, 0, 1, 0.66), []),
    "espejito":         ("Dc9KEallE4O_7",   (0, 0, 1, 1), []),
    "espejito-bolso":   ("Dc9KEallE4O_6",   (0.06, 0.02, 0.94, 0.73), []),
    "tote":             ("Dc9KEallE4O_1",   (0, 0.08, 0.66, 1), [(0.06, 0.5, 0.9, 0.8, "claro")]),
    "cintos-tachas":    ("Dc9KEallE4O_1",   (0.56, 0.18, 1, 0.98), []),
    "chapones":         ("Dc9KEallE4O_3",   (0, 0, 1, 0.7), []),
    "llaveros":         ("Dc9KEallE4O_2",   (0, 0, 0.9, 0.62), [(0.0, 0.0, 1.0, 0.16, "claro")]),
    "materas":          ("Dc4ELb2iiKe_0_v", (0, 0.2, 1, 1), [(0.0, 0.0, 1.0, 0.1, "claro")]),
    "stand":            ("DczEE6-K1p9_0_v", (0, 0.22, 1, 1), [(0.0, 0.0, 1.0, 0.1, "claro")]),
    "stand-2":          ("Dc9KEallE4O_0",   (0, 0.14, 1, 1), [(0.0, 0.0, 1.0, 0.12, "claro")]),
}
IG = ["Dd49SFPihJC_0_v", "DdHNlHtuid6_0", "Dc9KEallE4O_0", "Dc4ELb2iiKe_0_v", "DcNAr61lOlZ_0", "DccGByaFOjI_0"]

_lama = None
def lama():
    global _lama
    if _lama is None:
        from simple_lama_inpainting import SimpleLama
        _lama = SimpleLama()
    return _lama

def overlay_mask(img, zonas):
    """Máscara de píxeles de texto/emoji superpuesto dentro de las zonas."""
    a = np.asarray(img).astype(np.int16)
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1)
    sat = (mx - mn) / np.maximum(mx, 1)
    m = np.zeros(R.shape, bool)
    H, W = R.shape
    for (x0, y0, x1, y1, modo) in zonas:
        ys, xs = slice(int(y0 * H), int(y1 * H)), slice(int(x0 * W), int(x1 * W))
        if modo in ("claro+", "clonar"):
            modo = "claro"
        if modo == "todo":
            m[ys, xs] = True
            continue
        blanco = (mn[ys, xs] > 205) & (sat[ys, xs] < 0.22)                       # texto blanco
        crema = (R[ys, xs] > 215) & (G[ys, xs] > 180) & (B[ys, xs] > 110) & (sat[ys, xs] < 0.5)  # texto crema
        emoji = (R[ys, xs] > 200) & (G[ys, xs] > 130) & (B[ys, xs] < 110) & (sat[ys, xs] > 0.45)  # amarillo emoji
        rojo = (R[ys, xs] > 190) & (G[ys, xs] < 80) & (B[ys, xs] < 90)            # corazones
        morado = (B[ys, xs] > 80) & (B[ys, xs] > R[ys, xs] * 0.95) & (B[ys, xs] > G[ys, xs] * 1.2)  # contorno de emojis
        m[ys, xs] |= blanco | crema | emoji | rojo | morado
    mask = Image.fromarray((m * 255).astype(np.uint8))
    # cerrar huecos de letras y agrandar el borde ("claro+" = margen más amplio, para contornos de emojis)
    r = max(3, int(min(W, H) * 0.006))
    pasadas = 4 if any(z[4] in ("claro+", "clonar") for z in zonas) else 2
    for _ in range(pasadas):
        mask = mask.filter(ImageFilter.MaxFilter(2 * r + 1))
    return mask

def clonar(img, mask):
    """Rellena la máscara copiando la trama real de otra zona de la misma foto
    (como el tampón de clonar). Busca el desplazamiento que mejor encaja en el borde."""
    a = np.asarray(img).astype(np.float32)
    m = np.asarray(mask) > 127
    H, W = m.shape
    ys, xs = np.where(m)
    y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    ring = np.asarray(mask.filter(ImageFilter.MaxFilter(31))) > 127
    ring &= ~m
    ry, rx = np.where(ring)
    best, bd = None, 1e18
    my, mx_ = ys[::50], xs[::50]
    ring_mean = a[ry, rx].mean(0)
    for dy in range(-(y0 - 5), H - y1 - 5, 3):
        if abs(dy) < (y1 - y0):
            continue
        for dx in range(-12, 13, 3):
            sy, sx = ry + dy, rx + dx
            ok = (sy >= 0) & (sy < H) & (sx >= 0) & (sx < W)
            if ok.mean() < 0.98:
                continue
            d = ((a[sy[ok], sx[ok]] - a[ry[ok], rx[ok]]) ** 2).mean()
            # la zona de origen tiene que ser del mismo cuero (color parecido)
            src_mean = a[np.clip(my + dy, 0, H - 1), np.clip(mx_ + dx, 0, W - 1)].mean(0)
            d += 6 * ((src_mean - ring_mean) ** 2).sum()
            if d < bd:
                bd, best = d, (dy, dx)
    dy, dx = best
    src = np.roll(np.roll(a, -dy, 0), -dx, 1)
    soft = np.asarray(mask.filter(ImageFilter.GaussianBlur(4))).astype(np.float32)[..., None] / 255
    out = a * (1 - soft) + src * soft
    print(f"   clonado desde desplazamiento {best}")
    return Image.fromarray(out.clip(0, 255).astype(np.uint8))

def upscale(img):
    with tempfile.TemporaryDirectory() as t:
        i, o = os.path.join(t, "i.png"), os.path.join(t, "o.png")
        img.save(i)
        subprocess.run([RESR, "-i", i, "-o", o, "-n", "realesrgan-x4plus", "-s", "4"],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                       cwd=os.path.dirname(RESR))
        return Image.open(o).convert("RGB")

def procesar(nombre, src, crop, zonas):
    im = Image.open(os.path.join(SRC, src + ".jpg")).convert("RGB")
    w, h = im.size
    x0, y0, x1, y1 = crop
    im = im.crop((int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h)))
    pasos = []
    if zonas:
        mask = overlay_mask(im, zonas)
        os.makedirs(DEBUG, exist_ok=True)
        mask.save(os.path.join(DEBUG, nombre + "-mask.png"))
        if any(z[4] == "clonar" for z in zonas):
            im = clonar(im, mask)
        else:
            im = lama()(im, mask).crop((0, 0, im.width, im.height)).convert("RGB")
        pasos.append("texto borrado")
    if min(im.size) < 1400:
        im = upscale(im)
        pasos.append("x4 IA")
    im.thumbnail((1600, 1600), Image.LANCZOS)
    im.save(os.path.join(OUT, nombre + ".jpg"), "JPEG", quality=84, optimize=True, progressive=True)
    print(f"{nombre:18s} {im.size}  {' + '.join(pasos)}")

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    pedidos = sys.argv[1:] or list(FOTOS)
    for n in pedidos:
        if n in FOTOS:
            procesar(n, *FOTOS[n])
    if not sys.argv[1:]:
        for i, src in enumerate(IG):
            im = Image.open(os.path.join(SRC, src + ".jpg")).convert("RGB")
            s = min(im.size); l = (im.width - s) // 2; t = (im.height - s) // 2
            im = im.crop((l, t, l + s, t + s))
            if s < 900:
                im = upscale(im)
            im.resize((700, 700), Image.LANCZOS).save(os.path.join(OUT, f"ig-{i + 1}.jpg"), "JPEG", quality=82, optimize=True, progressive=True)
        print("ig ok")
