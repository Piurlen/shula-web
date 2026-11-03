/* shula — interacciones. Vanilla, sin dependencias. */
(function () {
  "use strict";
  var S = window.SHULA || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function catName(slug) {
    var c = (S.categorias || []).filter(function (x) { return x.slug === slug; })[0];
    return c ? c.nombre : slug;
  }
  function waLink(msg) {
    return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(msg || "Hola shula! Quería hacer una consulta.");
  }
  function openWa(msg) {
    window.open(waLink(msg), "_blank", "noopener");
  }

  /* ---------- Enlaces de contacto ---------- */
  function wireContact() {
    document.querySelectorAll("[data-wa]").forEach(function (a) {
      a.href = waLink(a.getAttribute("data-wa"));
      a.target = "_blank"; a.rel = "noopener";
    });
    document.querySelectorAll("[data-ig]").forEach(function (a) {
      a.href = "https://instagram.com/" + S.instagram;
      a.target = "_blank"; a.rel = "noopener";
    });
    document.querySelectorAll("[data-ig-handle]").forEach(function (el) { el.textContent = "@" + S.instagram; });
    document.querySelectorAll("[data-wa-visible]").forEach(function (el) { el.textContent = S.whatsappVisible; });
  }

  /* ---------- Revelado al scroll ---------- */
  var io = null;
  function observe(root) {
    var els = (root || document).querySelectorAll(".rv, .rv-img, .stitch");
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          // .rv-img arranca recortada (clip-path) y el observer no la "ve":
          // se observa el contenedor y se revela la imagen desde ahí.
          var t = e.target;
          if (t.matches(".rv, .stitch")) t.classList.add("is-in");
          (t.__reveal || []).forEach(function (x) { x.classList.add("is-in"); });
          io.unobserve(t);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
    }
    els.forEach(function (el) {
      var t = el;
      if (el.classList.contains("rv-img")) {
        t = el.parentElement;
        (t.__reveal = t.__reveal || []).push(el);
      }
      io.observe(t);
    });
  }

  /* ---------- Header ---------- */
  function header() {
    var h = document.querySelector(".hdr");
    if (!h || h.classList.contains("hdr--static")) return;
    var hero = document.querySelector(".hero");
    var last = 0, ticking = false;
    function update() {
      var y = window.scrollY;
      var limit = hero ? hero.offsetHeight - 80 : 10;
      h.classList.toggle("is-solid", y > limit);
      h.classList.toggle("is-hidden", y > limit + 200 && y > last);
      last = y; ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Menú móvil ---------- */
  function menu() {
    var m = document.querySelector(".menu");
    if (!m) return;
    var openers = document.querySelectorAll("[data-menu-open]");
    function set(open) {
      m.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      openers.forEach(function (b) { b.setAttribute("aria-expanded", String(open)); });
      if (open) m.querySelector("[data-menu-close]").focus();
    }
    openers.forEach(function (b) { b.addEventListener("click", function () { set(true); }); });
    m.querySelectorAll("[data-menu-close], .menu__list a").forEach(function (b) {
      b.addEventListener("click", function () { set(false); });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
  }

  /* ---------- Tarjeta de pieza ---------- */
  function pieceCard(p) {
    var a = document.createElement("a");
    a.className = "piece zoom";
    a.href = "pieza.html?id=" + p.id;
    var foto = (p.fotos || [])[0];
    var media = foto
      ? '<img src="' + foto + '" alt="' + p.nombre + '" loading="lazy" decoding="async">'
      : '<span class="ph__label">Foto<b>' + (p.toma || p.nombre) + " · 3:4</b></span>";
    a.innerHTML =
      '<figure class="ph t-' + p.tono + '">' + media + "</figure>" +
      '<div class="piece__meta"><span class="piece__name">' + p.nombre + "</span>" +
      '<span class="piece__cat">' + catName(p.categoria) + "</span>" +
      '<span class="piece__cta">Ver pieza</span></div>';
    return a;
  }

  /* ---------- Nuestras piezas: categorías (con foto) que filtran el catálogo ---------- */
  var CAT_TONO = { carteras: "cognac", indumentaria: "bordo", materas: "suela", cinturones: "tabaco",
                   brazaletes: "laton", llaveros: "arena", portalentes: "gris", tabaqueras: "choco" };
  function catalog() {
    var grid = document.querySelector("[data-catalog]");
    var track = document.querySelector("[data-cats]");
    if (!grid || !track) return;
    var piezas = S.piezas || [];
    var state = document.querySelector("[data-cat-state]");
    var panel = document.querySelector("[data-cat-panel]");

    (S.categorias || []).forEach(function (c, i) {
      var media = c.foto
        ? '<img src="' + c.foto + '" alt="" loading="lazy" decoding="async">'
        : '<span class="ph__label">Foto<b>' + c.nombre + "</b></span>";
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cat zoom rv" + (i % 4 ? " rv-d" + (i % 4) : "");
      b.dataset.slug = c.slug;
      b.setAttribute("aria-pressed", "false");
      b.innerHTML = '<figure class="ph t-' + (CAT_TONO[c.slug] || "arena") + '">' + media + "</figure>" +
        '<span class="cat__name">' + c.nombre + "</span>";
      track.appendChild(b);
    });

    function render(slug) {
      grid.innerHTML = "";
      var list = slug ? piezas.filter(function (p) { return p.categoria === slug; }) : piezas;
      track.querySelectorAll(".cat").forEach(function (x) {
        var on = x.dataset.slug === slug;
        x.classList.toggle("is-active", on);
        x.setAttribute("aria-pressed", on ? "true" : "false");
      });
      track.classList.toggle("has-active", !!slug);
      if (panel) panel.hidden = !slug;   // las piezas solo se ven al elegir una categoría
      if (state && slug) state.querySelector("[data-cat-now]").textContent = catName(slug);
      if (!slug) return;
      if (!list.length) {
        grid.innerHTML = '<p class="grid__empty">Todavía no cargamos piezas acá. Escribinos y te mostramos trabajos que ya hicimos.</p>';
        return;
      }
      list.forEach(function (p, i) {
        var card = pieceCard(p);
        card.style.animationDelay = Math.min(i, 8) * 45 + "ms";
        grid.appendChild(card);
      });
    }

    var current = "";
    track.addEventListener("click", function (e) {
      var b = e.target.closest(".cat");
      if (!b) return;
      current = current === b.dataset.slug ? "" : b.dataset.slug;   // tocar de nuevo = ver todas
      render(current);
      if (current) panel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    if (state) state.querySelector("[data-cat-all]").addEventListener("click", function () { current = ""; render(""); track.scrollIntoView({ behavior: "smooth", block: "center" }); });

    render("");
  }

  /* ---------- Página de pieza + pedido ---------- */
  function product() {
    var pdp = document.querySelector("[data-pdp]");
    if (!pdp) return;
    var id = new URLSearchParams(location.search).get("id");
    var p = (S.piezas || []).filter(function (x) { return x.id === id; })[0] || (S.piezas || [])[0];

    document.querySelectorAll("[data-p-name]").forEach(function (el) { el.textContent = p.nombre; });
    document.querySelectorAll("[data-p-cat]").forEach(function (el) { el.textContent = catName(p.categoria); });
    document.querySelectorAll("[data-p-desc]").forEach(function (el) { el.textContent = p.descripcion || ""; });
    document.title = p.nombre + " — shula";
    var canon = document.createElement("link");
    canon.rel = "canonical"; canon.href = (S.sitio || location.origin) + "/pieza.html?id=" + p.id;
    document.head.appendChild(canon);
    // Galería desde las fotos de la pieza
    var gal = pdp.querySelector(".gal__track");
    if (p.fotos && p.fotos.length) {
      gal.innerHTML = p.fotos.map(function (src, i) {
        return '<figure class="ph t-' + p.tono + '"><img src="' + src + '" alt="' + p.nombre + " — foto " + (i + 1) + '"' +
          (i ? ' loading="lazy"' : ' fetchpriority="high"') + ' decoding="async"></figure>';
      }).join("");
      pdp.classList.toggle("gal--single", p.fotos.length === 1);
    }
    // "Detalles": usa fotos extra de la pieza; si no hay suficientes, se oculta
    var det = document.querySelector(".pdp__details");
    if (det) {
      var extra = (p.fotos || []).slice(1);
      var slots = det.querySelectorAll(".details__grid figure");
      if (extra.length >= 2) {
        slots.forEach(function (fig, i) {
          var src = extra[i] || extra[0];
          var ph = fig.querySelector(".ph");
          ph.innerHTML = '<img src="' + src + '" alt="' + p.nombre + ' — detalle" loading="lazy" decoding="async">';
          var cap = fig.querySelector("figcaption");
          if (cap) cap.remove();
          if (i >= extra.length && extra.length < 3) fig.style.display = "none";
        });
      } else {
        det.style.display = "none";
      }
    }

    // Relacionadas: misma categoría primero
    var rel = document.querySelector("[data-related]");
    if (rel) {
      S.piezas.filter(function (x) { return x.id !== p.id; })
        .sort(function (a, b) { return (b.categoria === p.categoria) - (a.categoria === p.categoria); })
        .slice(0, 4)
        .forEach(function (x) { rel.appendChild(pieceCard(x)); });
    }

    // Galería: contador + barra
    var track = pdp.querySelector(".gal__track");
    var count = pdp.querySelector("[data-gal-count]");
    var bar = pdp.querySelector(".gal__bar i");
    var slides = track.children.length;
    bar.style.width = 100 / slides + "%";
    track.addEventListener("scroll", function () {
      var i = Math.round(track.scrollLeft / track.clientWidth);
      count.textContent = (i + 1) + " / " + slides;
      bar.style.transform = "translateX(" + i * 100 + "%)";
    }, { passive: true });
    count.textContent = "1 / " + slides;

    // Opciones del pedido desde data.js
    var O = S.opciones || {};
    function fill(key, render) {
      var box = pdp.querySelector('[data-opts="' + key + '"]');
      if (box) (O[key] || []).forEach(function (v) { box.insertAdjacentHTML("beforeend", render(v)); });
    }
    fill("cuero", function (v) { return '<button class="opt" type="button" aria-pressed="false" data-name="' + v + '">' + v + "</button>"; });
    fill("color", function (v) { return '<button class="sw" type="button" aria-pressed="false" style="--tone:' + v.hex + '" data-name="' + v.nombre + '" aria-label="' + v.nombre + '" title="' + v.nombre + '"></button>'; });
    fill("detalles", function (v) { return '<button class="opt" type="button" aria-pressed="false" data-name="' + v + '">' + v + "</button>"; });

    var state = { cuero: "", color: "", medida: "Estándar", detalles: [] };
    var medidaBox = pdp.querySelector("[data-medida-box]");

    pdp.querySelectorAll("[data-group]").forEach(function (g) {
      var key = g.dataset.group, multi = g.hasAttribute("data-multi");
      g.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (!b) return;
        var name = b.getAttribute("data-name");
        if (multi) {
          var on = b.getAttribute("aria-pressed") !== "true";
          b.setAttribute("aria-pressed", String(on));
          state[key] = [].slice.call(g.querySelectorAll('[aria-pressed="true"]')).map(function (x) { return x.dataset.name; });
        } else {
          g.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
          state[key] = name;
          var out = pdp.querySelector('[data-out="' + key + '"]');
          if (out) out.textContent = name;
        }
        if (key === "medida" && medidaBox) {
          medidaBox.classList.toggle("is-on", name === "A medida");
          if (name === "A medida") medidaBox.querySelector("input").focus();
        }
      });
    });

    function orderMessage() {
      var medidaTxt = (pdp.querySelector("#medida-txt") || {}).value || "";
      var nota = (pdp.querySelector("#nota") || {}).value || "";
      var lines = [
        "Hola shula! Quiero pedir esta pieza:",
        "*" + p.nombre + "* (" + catName(p.categoria) + ")",
        "",
        "• Cuero: " + (state.cuero || "a definir"),
        "• Color: " + (state.color || "a definir"),
        "• Medidas: " + (state.medida === "A medida" ? "a medida" + (medidaTxt ? " — " + medidaTxt : "") : "estándar")
      ];
      if (state.detalles.length) lines.push("• Detalles: " + state.detalles.join(", "));
      if (nota.trim()) lines.push("• Idea: " + nota.trim());
      lines.push("", location.origin + location.pathname + "?id=" + p.id);
      return lines.join("\n");
    }

    var form = pdp.querySelector("[data-pedido]");
    form.addEventListener("submit", function (e) { e.preventDefault(); openWa(orderMessage()); });
    document.querySelectorAll("[data-send-order]").forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); openWa(orderMessage()); });
    });

    // CTA fijo en mobile: visible mientras el botón del pedido no está en pantalla
    var sticky = document.querySelector(".sticky-cta");
    var main = document.querySelector("[data-main-cta]");
    if (sticky && main && "IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        sticky.classList.toggle("is-on", !en[0].isIntersecting);
      }).observe(main);
    }
  }

  /* ---------- Grilla de Instagram ---------- */
  function igGrid() {
    var g = document.querySelector("[data-ig-grid]");
    if (!g) return;
    g.innerHTML = (S.posts || []).map(function (p) {
      return '<a class="reel zoom" href="' + p.url + '" target="_blank" rel="noopener" aria-label="Ver reel: ' + p.alt + '"><figure class="ph t-choco"><img src="' + p.foto + '" alt="' + p.alt + '" loading="lazy" decoding="async"></figure><span class="reel__play" aria-hidden="true"></span></a>';
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    
    igGrid();
    catalog();
    product();
    wireContact();
    header();
    menu();
    observe();
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  });
})();
