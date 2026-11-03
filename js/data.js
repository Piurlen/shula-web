/* ==========================================================================
   shula — datos editables
   Fuente: Instagram @shula.rc (bio y publicaciones, septiembre 2026).
   Fotos: img/web/ (generadas desde img/ig/ con img/recortes.py).
   Lo marcado [ ] falta completarlo con shula.
   ========================================================================== */

window.SHULA = {
  sitio: "https://shula.com.ar",
  whatsapp: "5493584243970",           // +54 9 358 424-3970
  whatsappVisible: "+54 9 358 424-3970",
  instagram: "shula.rc",

  /* Categorías definitivas. foto: vacía = recuadro hasta que lleguen las fotos. */
  categorias: [
    { slug: "carteras",     nombre: "Carteras",     foto: "img/web/tote.jpg" },
    { slug: "indumentaria", nombre: "Indumentaria", foto: "img/web/top-rojo.jpg" },
    { slug: "materas",      nombre: "Materas",      foto: "img/web/materas.jpg" },
    { slug: "cinturones",   nombre: "Cinturones",   foto: "img/web/cintos-tachas.jpg" },
    { slug: "brazaletes",   nombre: "Brazaletes",   foto: "" },
    { slug: "llaveros",     nombre: "Llaveros",     foto: "img/web/llaveros.jpg" },
    { slug: "portalentes",  nombre: "Portalentes",  foto: "img/web/portalentes.jpg" },
    { slug: "tabaqueras",   nombre: "Tabaqueras",   foto: "" }
  ],

  /* Opciones del pedido (página de pieza). Confirmar con shula. */
  opciones: {
    cuero: ["Liso", "Gamuza", "Con pelo", "Animal print", "Lo charlamos"],
    color: [
      { nombre: "Negro",       hex: "#1B1715" },
      { nombre: "Suela",       hex: "#A8743F" },
      { nombre: "Marrón",      hex: "#5C3A24" },
      { nombre: "Bordó",       hex: "#5A1E24" },
      { nombre: "Rojo",        hex: "#B3261E" },
      { nombre: "Gris",        hex: "#7A756D" },
      { nombre: "Verde oliva", hex: "#4E5237" }
    ],
    detalles: ["Tachas", "Tiento", "Retazos", "Otro"]
  },

  /* Piezas. fotos: la primera es la principal. */
  piezas: [
    { id: "top-rojo", nombre: "Top rojo", categoria: "indumentaria", tono: "bordo",
      fotos: ["img/web/top-rojo.jpg"],
      descripcion: "[Descripción a cargar]" },
    { id: "top-caida", nombre: "Top con caída", categoria: "indumentaria", tono: "bordo",
      fotos: ["img/web/top-caida.jpg"],
      descripcion: "El top de cuero con una caída en el cuello que lo hace único. Y lo mejor: es regulable, para acomodarlo como más te guste." },
    { id: "minifalda", nombre: "Minifalda roja", categoria: "indumentaria", tono: "bordo",
      fotos: ["img/web/minifalda.jpg", "img/web/minifalda-2.jpg", "img/web/minifalda-espalda.jpg"],
      descripcion: "[Descripción a cargar]" },
    { id: "canas", nombre: "Cañas de botas", categoria: "indumentaria", tono: "negro",
      fotos: ["img/web/canas-1.jpg", "img/web/canas-2.jpg", "img/web/canas-5.jpg", "img/web/canas-4.jpg", "img/web/canas-3.jpg", "img/web/canas-medida.jpg"],
      descripcion: "No compres botas nuevas: transformá las tuyas. Cañas intercambiables, con jeans o pollera, con retazos o tachas. Vos elegís el cuero y el diseño." },
    { id: "portalentes", nombre: "Portalentes", categoria: "portalentes", tono: "gris",
      fotos: ["img/web/portalentes.jpg", "img/web/portalentes-2.jpg"],
      descripcion: "En cueros lisos, gastados o animal print, con tachas y tiento. [Descripción a completar]" },
    { id: "espejito", nombre: "Espejito con tachas", categoria: "llaveros", tono: "negro",
      fotos: ["img/web/espejito.jpg", "img/web/espejito-bolso.jpg"],
      descripcion: "[Descripción a cargar]" },
    { id: "tabaqueras", nombre: "Tabaqueras", categoria: "tabaqueras", tono: "suela",
      fotos: [],
      descripcion: "[Descripción a cargar]" },
    { id: "materas", nombre: "Materas", categoria: "materas", tono: "suela",
      fotos: ["img/web/materas.jpg"],
      descripcion: "[Descripción a cargar]" },
    { id: "tote", nombre: "Tote bag", categoria: "carteras", tono: "choco",
      fotos: ["img/web/tote.jpg"],
      descripcion: "[Descripción a cargar]" },
    { id: "faja", nombre: "Faja con tachas", categoria: "cinturones", tono: "bordo",
      fotos: ["img/web/faja.jpg", "img/web/minifalda-2.jpg"],
      descripcion: "[Descripción a cargar]" },
    { id: "cintos-tachas", nombre: "Cinturones", categoria: "cinturones", tono: "negro",
      fotos: ["img/web/cintos-tachas.jpg"],
      descripcion: "[Descripción a cargar]" },
    { id: "chapones", nombre: "Chapones", categoria: "cinturones", tono: "laton",
      fotos: ["img/web/chapones.jpg"],
      descripcion: "Hebillas para armar tu cinto. [Descripción a completar]" },
    { id: "llaveros-botita", nombre: "Llaveros botita", categoria: "llaveros", tono: "arena",
      fotos: ["img/web/llaveros.jpg"],
      descripcion: "[Descripción a cargar]" }
  ],

  /* Reels publicados en Instagram (miniatura + link), del más nuevo al más viejo */
  posts: [
    { foto: "img/web/reel-DfH9CrpCgMk.jpg", url: "https://www.instagram.com/reel/DfH9CrpCgMk/", alt: "Corbatas de cuero vacuno" },
    { foto: "img/web/reel-DfFYSYBiGnt.jpg", url: "https://www.instagram.com/reel/DfFYSYBiGnt/", alt: "Portalentes 100% cuero" },
    { foto: "img/web/reel-De2D4-dCzmg.jpg", url: "https://www.instagram.com/reel/De2D4-dCzmg/", alt: "El proceso: siempre matecito" },
    { foto: "img/web/reel-DeN71ziOxE-.jpg", url: "https://www.instagram.com/reel/DeN71ziOxE-/", alt: "La repetición: todo es parte del proceso" },
    { foto: "img/web/reel-DeKAUSgCnEt.jpg", url: "https://www.instagram.com/reel/DeKAUSgCnEt/", alt: "Cinturones reversibles 2 en 1" },
    { foto: "img/web/reel-Dd49SFPihJC.jpg", url: "https://www.instagram.com/reel/Dd49SFPihJC/", alt: "El top de cuero con caída" },
    { foto: "img/web/reel-Dc4ELb2iiKe.jpg", url: "https://www.instagram.com/reel/Dc4ELb2iiKe/", alt: "Día 3 en la Rural: materas" },
    { foto: "img/web/reel-Dc1J7YQC8tt.jpg", url: "https://www.instagram.com/reel/Dc1J7YQC8tt/", alt: "Día 2 en la Expo Rural" },
    { foto: "img/web/reel-DczEE6-K1p9.jpg", url: "https://www.instagram.com/reel/DczEE6-K1p9/", alt: "Primer día de Rural: el stand de shula" }
  ]
};
