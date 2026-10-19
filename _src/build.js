/* ============================================================
   build.js — genera el sitio Enterprise Thinking (EN / ES / NL)

   Textos:      _src/i18n/en.json, es.json, nl.json
   Legales:     _src/legal/<idioma>/{legal,privacy,cookies}.html
   Salida:      /en/, /es/, /nl/ + index.html raíz, 404, sitemap, etc.

   Ejecutar tras cualquier cambio:   node _src/build.js
============================================================ */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SRC = __dirname;
const ROOT = path.resolve(SRC, '..');
const LANGS = ['en', 'es', 'nl'];
const PAGES = ['home', 'et', 'book', 'about', 'contact', 'legal', 'privacy', 'cookies'];
const BRAND = 'Fialka Enterprise Thinking';
const TODAY = new Date().toISOString().slice(0, 10);
const YEAR = new Date().getFullYear();

const SITE = {
    url: 'https://www.fialka.es',
    email: 'alex@fialka.es',
    phone: '+34641058422',
    phoneDisplay: '+34 641 05 84 22',
    linkedin: 'https://www.linkedin.com/in/alexfialka/',
    ga: 'G-2D53PM9XB3',
    // TODO: pega aquí la URL de Formspree (p. ej. https://formspree.io/f/xxxx) para
    // que el formulario se envíe sin abrir el correo. Vacío = se abre el email.
    formEndpoint: ''
};

const BOOK = {
    // Búsqueda con todas las ediciones (enlace facilitado por Alex)
    search: 'https://www.amazon.es/s?k=alex+fialka',
    editions: {
        en: { asin: 'B0HGRXD4M3', title: 'Enterprise Thinking: The practical logic behind a strong enterprise', pages: 240, isbn: '979-8170076987', date: '2026-08-26' },
        es: { asin: 'B0HGX1CB8W', title: 'Enterprise Thinking: La lógica práctica detrás de una empresa sólida', pages: 268, isbn: '979-8170191796', date: '2026-08-27' },
        nl: { asin: 'B0HGX8F8BJ', title: 'Enterprise Thinking: De praktische logica achter een sterke onderneming', pages: 285, isbn: '979-8170189878', date: '2026-08-27' }
    }
};
const amazon = lang => `https://www.amazon.es/dp/${BOOK.editions[lang].asin}`;

/* ---------- Load content ---------- */
const T = {};
const LEGAL = {};
LANGS.forEach(l => {
    T[l] = JSON.parse(fs.readFileSync(path.join(SRC, 'i18n', l + '.json'), 'utf8'));
    LEGAL[l] = {};
    ['legal', 'privacy', 'cookies'].forEach(p => {
        LEGAL[l][p] = fs.readFileSync(path.join(SRC, 'legal', l, p + '.html'), 'utf8');
    });
});

/* ---------- Helpers ---------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fill = (s, map) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in map ? map[k] : m));
const url = (lang, page) => `/${lang}/${T[lang].slugs[page]}`;
const abs = (lang, page) => SITE.url + url(lang, page);
const hash = file => crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, file))).digest('hex').slice(0, 8);
const V = { css: hash('assets/css/site.css'), js: hash('assets/js/site.js') };
const r1 = n => Math.round(n * 10) / 10;

function write(rel, content) {
    const file = path.join(ROOT, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
}

/* ---------- SVG pieces ---------- */
const P = (cx, cy, r, deg) => [r1(cx + r * Math.cos(deg * Math.PI / 180)), r1(cy + r * Math.sin(deg * Math.PI / 180))];

// Media luna del logo: gruesa a la izquierda, fina a la derecha, abierta por la derecha.
function crescent(cx, cy, R, t, gap) {
    const off = (t - 0.6) / 2;
    const r = R - off - 0.6;
    const [ax, ay] = P(cx, cy, R, -gap);
    const [bx, by] = P(cx, cy, R, gap);
    const [cx2, cy2] = P(cx + off, cy, r, gap);
    const [dx, dy] = P(cx + off, cy, r, -gap);
    return `M${ax} ${ay}A${R} ${R} 0 1 0 ${bx} ${by}L${cx2} ${cy2}A${r} ${r} 0 1 1 ${dx} ${dy}Z`;
}
// Mismo recorrido como trazo (para dibujarlo con stroke-dashoffset)
function arcPath(cx, cy, R, gap) {
    const [ax, ay] = P(cx, cy, R, -gap);
    const [bx, by] = P(cx, cy, R, gap);
    return `M${ax} ${ay}A${R} ${R} 0 1 0 ${bx} ${by}`;
}
const gradient = (id, a = '#052352', b = '#79808A') =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

function sep() {
    return `<div class="sep" aria-hidden="true"><svg viewBox="0 0 40 40"><defs>${gradient('sg')}</defs><path d="${crescent(20, 20, 17, 2.4, 24)}" fill="url(#sg)"/></svg></div>`;
}

/* Hero: puzle redondo dentro del círculo abierto del logo.
   Las piezas llegan dispersas y giradas, encajan de fuera hacia dentro y
   la última (azul marino) completa el conjunto: "ver el todo". */
const PUZZLE = { cx: 260, cy: 260, r: 196, n: 4, seed: 11 };

// Pestaña de puzle sobre una arista (0→1 en x, saliente hacia y negativa)
const TAB = [
    [[0.42, 0], [0.46, -0.04], [0.44, -0.10]],
    [[0.40, -0.20], [0.33, -0.30], [0.50, -0.30]],
    [[0.67, -0.30], [0.60, -0.20], [0.56, -0.10]],
    [[0.54, -0.04], [0.58, 0], [1, 0]]
];

function puzzlePieces() {
    const { cx, cy, r, n } = PUZZLE;
    let seed = PUZZLE.seed;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const size = r * 2, cell = size / n, x0 = cx - r, y0 = cy - r;

    // Arista como lista de segmentos cúbicos en coordenadas absolutas.
    // dir: 0 = recta (borde exterior), ±1 = pestaña hacia un lado u otro.
    function edge(ax, ay, bx, by, dir) {
        const ux = bx - ax, uy = by - ay;
        if (!dir) return { start: [ax, ay], segs: [[[ax, ay], [bx, by], [bx, by]]] };
        const L = Math.hypot(ux, uy), nx = -uy / L, ny = ux / L;
        const shift = (rnd() - 0.5) * 0.08, scale = 0.92 + rnd() * 0.16;
        const map = ([x, y]) => {
            const t = x === 0 || x === 1 ? x : x + shift;
            return [r1(ax + ux * t + nx * L * y * scale * dir), r1(ay + uy * t + ny * L * y * scale * dir)];
        };
        const first = [[ax, ay], map([0.36, 0]), map([0.36, 0])];
        return { start: [ax, ay], segs: [first, ...TAB.map(seg => seg.map(map))] };
    }
    const reverse = e => {
        const pts = [e.start, ...e.segs.map(s => s[2])];
        const segs = e.segs.map((s, i) => [s[1], s[0], pts[i]]).reverse();
        return { start: pts[pts.length - 1], segs };
    };
    const toPath = edges => 'M' + edges[0].start.join(' ') +
        edges.map(e => e.segs.map(s => 'C' + s.map(p => p.join(' ')).join(' ')).join('')).join('') + 'Z';

    // Aristas compartidas: horizontales H[fila][col] y verticales V[fila][col]
    const H = [], V = [];
    for (let i = 0; i <= n; i++) {
        H[i] = []; V[i] = [];
        for (let j = 0; j < n; j++) {
            const y = y0 + i * cell, x = x0 + j * cell;
            H[i][j] = edge(x, y, x + cell, y, i === 0 || i === n ? 0 : (rnd() < 0.5 ? 1 : -1));
        }
        for (let j = 0; j <= n && i < n; j++) {
            const x = x0 + j * cell, y = y0 + i * cell;
            V[i][j] = edge(x, y, x, y + cell, j === 0 || j === n ? 0 : (rnd() < 0.5 ? 1 : -1));
        }
    }

    const pieces = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        // Solo las celdas que tocan el disco
        const nxp = Math.max(x0 + j * cell, Math.min(cx, x0 + (j + 1) * cell));
        const nyp = Math.max(y0 + i * cell, Math.min(cy, y0 + (i + 1) * cell));
        if (Math.hypot(nxp - cx, nyp - cy) >= r) continue;
        const d = toPath([H[i][j], V[i][j + 1], reverse(H[i + 1][j]), reverse(V[i][j])]);
        const mx = x0 + (j + 0.5) * cell - cx, my = y0 + (i + 0.5) * cell - cy;
        pieces.push({ i, j, d, dist: Math.hypot(mx, my), ang: Math.atan2(my, mx) });
    }

    // Orden de llegada: de fuera hacia dentro; las dos piezas destacadas, al final
    const accent = { '1-1': 'is-key', '2-2': 'is-alt' };
    pieces.forEach(p => { p.cls = accent[`${p.i}-${p.j}`] || ''; });
    pieces.sort((a, b) => (!!a.cls - !!b.cls) || (b.dist - a.dist) || (a.ang - b.ang));
    const keyLast = pieces.splice(pieces.findIndex(p => p.cls === 'is-key'), 1)[0];
    pieces.push(keyLast);

    return pieces.map((p, k) => {
        // Posición inicial: desplazada hacia fuera (con algo de azar) y girada
        const out = 70 + rnd() * 80;
        const a = p.ang + (rnd() - 0.5) * 0.9;
        const dx = Math.round(Math.cos(a) * out), dy = Math.round(Math.sin(a) * out);
        const rot = Math.round((rnd() < 0.5 ? -1 : 1) * (14 + rnd() * 34));
        return `<g class="pz${p.cls ? ' ' + p.cls : ''}" style="--i:${k};--dx:${dx}px;--dy:${dy}px;--rot:${rot}deg"><path d="${p.d}" clip-path="url(#pzc)"/></g>`;
    }).join('');
}

function heroArt(label) {
    const { cx, cy, r } = PUZZLE;
    return `<svg class="hero-art" viewBox="0 0 520 520" role="img" aria-label="${esc(label)}">
        <defs>${gradient('hg')}<mask id="hm"><path class="ring-draw" d="${arcPath(260, 260, 236, 22)}" fill="none" stroke="#fff" stroke-width="30" pathLength="1"/></mask>
            <clipPath id="pzc"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
        <path d="${crescent(260, 260, 240, 11, 22)}" fill="url(#hg)" mask="url(#hm)"/>
        <g class="puzzle">${puzzlePieces()}</g>
        <circle class="pz-whole" cx="${cx}" cy="${cy}" r="${r}"/>
        <g class="art-pi" transform="translate(482 256)" aria-hidden="true"><path d="M1 7C2.5 4.5 5 3.6 8 3.6H32M11.5 3.6C11.5 14 10.5 23 7 30M23 3.6V25C23 29 25 30.5 28.5 29"/></g>
    </svg>`;
}

// Diagrama sobre el círculo abierto (escritorio): los elementos conectados
// entre sí y todos con los resultados del centro.
function diagramCircle(els, center, label) {
    // Ancho extra a la derecha para etiquetas largas ("Verantwoordelijkheden")
    const cx = 340, cy = 280, R = 190, n = els.length, step = 360 / n;
    const pts = els.map((_, k) => P(cx, cy, R, -90 + k * step));
    let lines = '', i = 0;
    for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
        if (b - a === 1 || (a === 0 && b === n - 1)) continue;
        lines += `<line class="chord" x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}" pathLength="1" style="--i:${i++}"/>`;
    }
    pts.forEach(([x, y]) => {
        lines += `<line class="spoke" x1="${x}" y1="${y}" x2="${cx}" y2="${cy}" pathLength="1" style="--i:${i++}"/>`;
    });
    const labels = els.map((name, k) => {
        const ang = (-90 + k * step) * Math.PI / 180;
        const [lx, ly] = P(cx, cy, R + 26, -90 + k * step);
        const anchor = Math.abs(Math.cos(ang)) < 0.2 ? 'middle' : (Math.cos(ang) > 0 ? 'start' : 'end');
        const dy = Math.sin(ang) < -0.9 ? -4 : Math.sin(ang) > 0.5 ? 22 : 7;
        return `<circle class="dot" cx="${pts[k][0]}" cy="${pts[k][1]}" r="9" style="--i:${k}"/>` +
               `<text x="${lx}" y="${r1(ly + dy)}" text-anchor="${anchor}" style="--i:${k}">${esc(name)}</text>`;
    }).join('');
    return `<svg class="diagram diagram-circle" viewBox="0 0 800 560" role="img" aria-label="${esc(label)}">
        <defs>${gradient('dg')}</defs>
        <path class="rim" d="${arcPath(cx, cy, R, 14)}" stroke="url(#dg)" stroke-width="2.4" pathLength="1" style="--i:0"/>
        ${lines}${labels}
        <circle class="core" cx="${cx}" cy="${cy}" r="64" style="--i:${n}"/>
        <text class="core-label" x="${cx}" y="${cy + 7}" text-anchor="middle" style="--i:${n}">${esc(center)}</text>
    </svg>`;
}

// Versión vertical para móvil: diagrama de arcos (todos conectados con todos);
// el último nodo son los resultados.
function diagramArcs(els, center, label) {
    const all = [...els, center], n = all.length;
    const x = 166, top = 40, step = 64;
    const ys = all.map((_, k) => top + k * step);
    let arcs = '', i = 0;
    for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
        const r = (ys[b] - ys[a]) / 2;
        arcs += `<path class="chord${b - a === 1 ? ' rim' : ''}" d="M${x} ${ys[a]}A${r} ${r} 0 0 0 ${x} ${ys[b]}" pathLength="1" style="--i:${i++}"/>`;
    }
    const dots = all.map((name, k) => k === n - 1
        ? `<circle class="core" cx="${x}" cy="${ys[k]}" r="11" style="--i:${k}"/><text class="core-text" x="${x + 24}" y="${ys[k] + 6}" style="--i:${k}">${esc(name)}</text>`
        : `<circle class="dot" cx="${x}" cy="${ys[k]}" r="8" style="--i:${k}"/><text x="${x + 22}" y="${ys[k] + 6}" style="--i:${k}">${esc(name)}</text>`).join('');
    return `<svg class="diagram diagram-arcs" viewBox="0 0 410 ${top * 2 + step * (n - 1)}" role="img" aria-label="${esc(label)}">${arcs}${dots}</svg>`;
}

// Iconos de los cinco servicios: diagnóstico, cadena completa, gestión y riesgo,
// cambio e implantación, asesoramiento independiente.
const ICONS = [
    '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/><circle cx="8.5" cy="9.5" r="1.2"/><circle cx="12.5" cy="12" r="1.2"/><path d="M9.5 10.3l2 1"/>',
    '<path d="M3 5h4.5l4.5 7H21"/><path d="M3 12h9"/><path d="M3 19h4.5l4.5-7"/>',
    '<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    '<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v4h-4"/>',
    '<path d="M12 21v-8"/><path d="M12 13 6.5 7.5"/><path d="M12 13l5.5-5.5"/><path d="M6.5 11V7.5H10"/><path d="M17.5 11V7.5H14"/>'
];
const icon = i => `<svg class="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[i]}</svg>`;

/* ---------- Images ---------- */
const coverImg = (lang, alt, sizes, opts = '') =>
    `<img src="/assets/img/book-cover-${lang}-480.webp" srcset="/assets/img/book-cover-${lang}-480.webp 480w, /assets/img/book-cover-${lang}-900.webp 900w" sizes="${sizes}" width="480" height="716" alt="${esc(alt)}" ${opts}>`;
const portraitImg = (alt, opts = 'loading="lazy" decoding="async"') =>
    `<img src="/assets/img/alex-fialka-480.webp" srcset="/assets/img/alex-fialka-480.webp 480w, /assets/img/alex-fialka-760.webp 760w" sizes="(max-width: 860px) 90vw, 420px" width="480" height="640" alt="${esc(alt)}" ${opts}>`;

/* ---------- Structured data ---------- */
function graph(lang, page) {
    const t = T[lang];
    const person = {
        '@type': 'Person', '@id': SITE.url + '/#alex-fialka', name: 'Alex Fialka', jobTitle: 'Business Architect',
        url: abs(lang, 'about'), image: SITE.url + '/assets/img/alex-fialka-760.webp',
        email: 'mailto:' + SITE.email, sameAs: [SITE.linkedin], nationality: 'NL',
        address: { '@type': 'PostalAddress', addressLocality: 'Almerimar', addressRegion: 'Almería', addressCountry: 'ES' }
    };
    const editions = LANGS.map(l => ({
        '@type': 'Book', name: BOOK.editions[l].title, inLanguage: l, isbn: BOOK.editions[l].isbn,
        numberOfPages: BOOK.editions[l].pages, datePublished: BOOK.editions[l].date,
        publisher: { '@type': 'Organization', name: 'Independently published' },
        url: amazon(l), image: SITE.url + `/assets/img/book-cover-${l}-900.webp`
    }));
    const book = {
        '@type': 'Book', '@id': SITE.url + '/#book', name: 'Enterprise Thinking',
        alternateName: BOOK.editions[lang].title, author: { '@id': person['@id'] },
        description: t.bookPage.aboutParas.join(' '), inLanguage: lang,
        image: SITE.url + `/assets/img/book-cover-${lang}-900.webp`, url: abs(lang, 'book'),
        workExample: editions
    };
    const service = {
        '@type': 'ProfessionalService', '@id': SITE.url + '/#enterprise-thinking', name: BRAND,
        description: t.meta.home.desc, url: abs(lang, 'home'), logo: SITE.url + '/assets/img/et-logo.png',
        image: SITE.url + `/assets/img/og-${lang}.jpg`, founder: { '@id': person['@id'] },
        email: SITE.email, telephone: SITE.phone, areaServed: ['Europe', 'International'],
        availableLanguage: ['English', 'Spanish', 'Dutch'],
        address: person.address,
        hasOfferCatalog: {
            '@type': 'OfferCatalog', name: t.services.heading,
            itemListElement: t.services.items.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.text } }))
        }
    };
    const website = {
        '@type': 'WebSite', '@id': SITE.url + '/#website', url: SITE.url + '/', name: BRAND,
        inLanguage: LANGS, publisher: { '@id': person['@id'] }
    };
    const crumbs = (key) => ({
        '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: BRAND, item: abs(lang, 'home') },
            { '@type': 'ListItem', position: 2, name: t.nav[key] || t.meta[key].title, item: abs(lang, key) }
        ]
    });
    const byPage = {
        home: [website, person, service, book],
        et: [{ '@type': 'WebPage', url: abs(lang, 'et'), name: t.meta.et.title, about: { '@id': service['@id'] } }, service, crumbs('et')],
        book: [book, person, crumbs('book')],
        about: [{ '@type': 'ProfilePage', url: abs(lang, 'about'), mainEntity: { '@id': person['@id'] } }, person, crumbs('about')],
        contact: [{ '@type': 'ContactPage', url: abs(lang, 'contact') }, service, person]
    };
    if (!byPage[page]) return '';
    return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': byPage[page] })}</script>`;
}

/* ---------- Layout ---------- */
function head(lang, page) {
    const t = T[lang];
    const m = t.meta[page];
    const ogImage = page === 'book' ? `${SITE.url}/assets/img/book-cover-${lang}-600.jpg` : `${SITE.url}/assets/img/og-${lang}.jpg`;
    const ogSize = page === 'book' ? ['600', '894'] : ['1200', '630'];
    const alternates = LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="${abs(l, page)}">`).join('\n    ') +
        `\n    <link rel="alternate" hreflang="x-default" href="${abs('en', page)}">`;
    const ogAlt = LANGS.filter(l => l !== lang).map(l => `<meta property="og:locale:alternate" content="${T[l].locale}">`).join('\n    ');
    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(m.title)}</title>
    <meta name="description" content="${esc(m.desc)}">
    <meta name="author" content="Alex Fialka">
    <meta name="theme-color" content="#052352">
    <link rel="canonical" href="${abs(lang, page)}">
    ${alternates}

    <link rel="icon" href="/favicon.ico" sizes="48x48">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">

    <meta property="og:type" content="${page === 'book' ? 'book' : 'website'}">
    <meta property="og:site_name" content="${BRAND}">
    <meta property="og:title" content="${esc(m.title)}">
    <meta property="og:description" content="${esc(m.desc)}">
    <meta property="og:url" content="${abs(lang, page)}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:width" content="${ogSize[0]}">
    <meta property="og:image:height" content="${ogSize[1]}">
    <meta property="og:locale" content="${t.locale}">
    ${ogAlt}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(m.title)}">
    <meta name="twitter:description" content="${esc(m.desc)}">
    <meta name="twitter:image" content="${ogImage}">

    <link rel="preload" href="/assets/fonts/libre-caslon-text-latin.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="/assets/css/site.css?v=${V.css}">

    <!-- Google Analytics 4 con Consent Mode v2: denegado hasta que se acepte.
         gtag.js se descarga con la primera interacción o a los 4 s. -->
    <script>
        document.documentElement.classList.add('js');
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted', wait_for_update: 500 });
        try { if (localStorage.getItem('af_cookie_consent') === '1') gtag('consent', 'update', { analytics_storage: 'granted' }); } catch (e) {}
        gtag('js', new Date());
        gtag('config', '${SITE.ga}', { anonymize_ip: true });
        (function () {
            var done = false, ev = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
            var load = function () {
                if (done) return; done = true;
                ev.forEach(function (e) { window.removeEventListener(e, load, true); });
                var s = document.createElement('script'); s.async = true;
                s.src = 'https://www.googletagmanager.com/gtag/js?id=${SITE.ga}';
                document.head.appendChild(s);
            };
            ev.forEach(function (e) { window.addEventListener(e, load, { passive: true, capture: true }); });
            window.addEventListener('load', function () { setTimeout(load, 4000); });
        })();
    </script>
    ${graph(lang, page)}
</head>`;
}

function langLinks(lang, page) {
    return `<ul class="langs" aria-label="${esc(T[lang].ui.language)}">` + LANGS.map(l =>
        `<li><a href="${url(l, page)}" hreflang="${l}" lang="${l}"${l === lang ? ' aria-current="true"' : ''} title="${esc(T[l].langName)}">${l.toUpperCase()}</a></li>`).join('') + '</ul>';
}

const navItems = lang => [
    ['et', url(lang, 'et')],
    ['services', url(lang, 'home') + '#services'],
    ['book', url(lang, 'book')],
    ['about', url(lang, 'about')],
    ['contact', url(lang, 'contact')]
];

function header(lang, page) {
    const t = T[lang];
    const home = url(lang, 'home');
    const items = navItems(lang).map(([k, href]) => [k, href, ['et', 'book', 'about', 'contact'].includes(k) ? k : null]);
    return `<a class="skip" href="#main">${esc(t.ui.skip)}</a>
<header class="site-header">
    <div class="wrap header-inner">
        <a class="brand" href="${home}">
            <img src="/assets/img/et-logo-96.webp" width="93" height="96" alt="">
            <span class="brand-text"><span class="brand-name">${BRAND}</span><span class="brand-by">${esc(t.ui.byline)}</span></span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="sr-only">${esc(t.ui.menu)}</span><span class="bars" aria-hidden="true"></span></button>
        <nav class="site-nav" id="site-nav" aria-label="${esc(t.ui.menu)}">
            <ul class="nav-list">${items.map(([k, href, p]) =>
                `<li><a href="${href}"${p && p === page ? ' aria-current="page"' : ''}>${esc(t.nav[k])}</a></li>`).join('')}</ul>
            ${langLinks(lang, page)}
        </nav>
    </div>
</header>`;
}

function footer(lang, page) {
    const t = T[lang];
    const f = t.footer;
    const home = url(lang, 'home');
    return `<footer class="site-footer on-dark">
    <div class="wrap">
        <div class="footer-grid">
            <div>
                <a class="footer-brand" href="${home}">
                    <img src="/assets/img/et-logo-white-96.webp" width="93" height="96" alt="" loading="lazy">
                    <span class="brand-text"><span class="brand-name">${BRAND}</span><span class="brand-by">${esc(t.ui.byline)}</span></span>
                </a>
                <p class="footer-tagline">${esc(f.tagline)}</p>
            </div>
            <div class="footer-col">
                <h2>${esc(f.explore)}</h2>
                <ul>
                    ${navItems(lang).map(([k, href]) => `<li><a href="${href}">${esc(t.nav[k])}</a></li>`).join('\n                    ')}
                </ul>
            </div>
            <div class="footer-col">
                <h2>${esc(f.contact)}</h2>
                <ul>
                    <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
                    <li><a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li>
                </ul>
                <h2 style="margin-top:24px">${esc(t.ui.language)}</h2>
                ${langLinks(lang, page)}
            </div>
        </div>
        <div class="footer-bottom">
            <p>${esc(fill(f.rights, { year: YEAR }))}</p>
            <ul class="footer-legal">
                <li><a href="${url(lang, 'legal')}">${esc(f.legal)}</a></li>
                <li><a href="${url(lang, 'privacy')}">${esc(f.privacy)}</a></li>
                <li><a href="${url(lang, 'cookies')}">${esc(f.cookies)}</a></li>
                <li><button class="link-button" type="button" data-cookie-settings>${esc(f.cookieSettings)}</button></li>
            </ul>
        </div>
    </div>
</footer>`;
}

function cookieBanner(lang) {
    const c = T[lang].cookie;
    return `<div class="cookie-banner" id="cookie-banner" role="region" aria-label="Cookies" hidden>
    <p>${fill(c.text, { cookies: url(lang, 'cookies') })}</p>
    <div class="cookie-actions">
        <button type="button" class="btn btn-secondary" data-consent="reject">${esc(c.reject)}</button>
        <button type="button" class="btn btn-primary" data-consent="accept">${esc(c.accept)}</button>
    </div>
</div>`;
}

function clientStrings(lang) {
    const t = T[lang];
    const s = { menu: t.ui.menu, close: t.ui.close };
    ['name', 'company', 'role', 'email', 'sending', 'errRequired', 'errEmail', 'errConsent', 'successMail', 'successSent', 'errSend', 'mailSubject']
        .forEach(k => { s[k] = t.form[k]; });
    return JSON.stringify(s).replace(/</g, '\\u003c');
}

function layout(lang, page, main) {
    return `${head(lang, page)}
<body>
${header(lang, page)}
<main id="main">
${main}
</main>
${footer(lang, page)}
${cookieBanner(lang)}
<script id="i18n" type="application/json">${clientStrings(lang)}</script>
<script src="/assets/js/site.js?v=${V.js}" defer></script>
</body>
</html>
`;
}

/* ---------- Forms ---------- */
function form(lang, variant) {
    const t = T[lang], f = t.form;
    const id = variant === 'full' ? 'contact-form' : 'home-form';
    const p = id + '-';
    const field = (name, label, type = 'text', extra = '', optional = false) =>
        `<div class="field"><label for="${p}${name}">${esc(label)}${optional ? ` <span class="opt">(${esc(f.optional)})</span>` : ''}</label>` +
        `<input id="${p}${name}" name="${name}" type="${type}" ${extra}></div>`;
    const company = field('company', f.company, 'text', 'autocomplete="organization"', true);
    const role = field('role', f.role, 'text', 'autocomplete="organization-title"', true);
    return `<form class="form" id="${id}" novalidate${SITE.formEndpoint ? ` action="${SITE.formEndpoint}" method="POST" data-endpoint="${SITE.formEndpoint}"` : ''}>
        <input type="hidden" name="_subject" value="${esc(f.mailSubject)}">
        <input type="hidden" name="language" value="${lang}">
        ${field('name', f.name, 'text', 'autocomplete="name" required')}
        ${variant === 'full' ? `<div class="field-row">${company}${role}</div>` : company}
        ${field('email', f.email, 'email', 'autocomplete="email" required')}
        <div class="field"><label for="${p}message">${esc(variant === 'full' ? f.message : f.goal)}</label>
            <textarea id="${p}message" name="message" rows="${variant === 'full' ? 7 : 5}" required${variant === 'full' ? ` placeholder="${esc(f.goal)}"` : ''}></textarea></div>
        <div class="hp" aria-hidden="true"><label for="${p}website">${esc(f.hp)}</label><input id="${p}website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
        <label class="consent"><input type="checkbox" name="consent" required><span>${fill(f.consent, { privacy: url(lang, 'privacy') })}</span></label>
        <button class="btn btn-primary" type="submit">${esc(f.submit)}</button>
        <p class="form-status" role="status" aria-live="polite"></p>
    </form>`;
}

/* ---------- Pages ---------- */
function homePage(lang) {
    const t = T[lang];
    const bookAlt = t.bookPage.coverAlt;
    return `
<section class="hero">
    <div class="wrap hero-grid">
        <div>
            <span class="eyebrow">${BRAND}</span>
            <h1>${esc(t.hero.title)}</h1>
            <p class="hero-sub">${esc(t.hero.subtitle)}</p>
            <div class="btn-row">
                <a class="btn btn-primary" href="${url(lang, 'et')}">${esc(t.hero.ctaEt)}</a>
                <a class="btn btn-secondary" href="#contact">${esc(t.hero.ctaContact)}</a>
            </div>
        </div>
        ${heroArt(t.hero.visualLabel)}
    </div>
</section>

<section class="section problem" id="challenge" aria-label="${esc(t.problem.label)}">
    <div class="wrap">
        <div class="prose">
            ${t.problem.paras.map(p => `<p class="reveal">${esc(p)}</p>`).join('\n            ')}
            <p class="statement reveal">${esc(t.problem.why)}</p>
            <p class="cta-strong reveal">${esc(t.problem.because)}</p>
            <p class="reveal">${esc(t.problem.how)}</p>
        </div>
    </div>
</section>

${sep()}

<section class="section" id="enterprise-thinking">
    <div class="wrap et-grid">
        <div class="reveal">
            <span class="eyebrow">${esc(t.et.label)}</span>
            <h2>${esc(t.et.heading)}</h2>
            <p class="lead">${esc(t.et.question)}</p>
            ${t.et.paras.map(p => `<p>${esc(p)}</p>`).join('\n            ')}
            <p class="et-closing">${esc(t.et.closing)}</p>
            <a class="text-link" href="${url(lang, 'et')}">${esc(t.hero.ctaEt)}</a>
        </div>
        ${diagramCircle(t.et.elements, t.et.center, t.et.diagramLabel)}
        ${diagramArcs(t.et.elements, t.et.center, t.et.diagramLabel)}
    </div>
</section>

<section class="section" id="why">
    <div class="wrap">
        <div class="prose">
            <h2 class="section-title reveal">${esc(t.why.heading)}</h2>
            <p class="lead reveal">${esc(t.why.intro)}</p>
        </div>
        <table class="symptoms-table reveal">
            <thead><tr><th scope="col">${esc(t.why.colLocal)}</th><th scope="col">${esc(t.why.colWhole)}</th></tr></thead>
            <tbody>${t.why.rows.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}</tbody>
        </table>
        <div class="prose">
            <p class="reveal">${esc(t.why.after)}</p>
        </div>
        <p class="big-question reveal">${esc(t.why.statement)}</p>
    </div>
</section>

${sep()}

${servicesSection(lang)}

<section class="section" id="what-to-expect">
    <div class="wrap split">
        <h2 class="section-title reveal">${esc(t.expect.heading)}</h2>
        <div class="prose">
            ${t.expect.paras.map(p => `<p class="reveal">${esc(p)}</p>`).join('\n            ')}
            <div class="highlights reveal">
                <p>${esc(t.expect.highlight1)}</p>
                <p>${esc(t.expect.highlight2)}</p>
            </div>
            ${gainsList(lang)}
        </div>
    </div>
</section>

<section class="section" id="book">
    <div class="wrap book-feature">
        <div class="book-3d reveal"><a class="book" href="${url(lang, 'book')}" tabindex="-1" aria-hidden="true">${coverImg(lang, bookAlt, '(max-width: 860px) 70vw, 360px', 'loading="lazy" decoding="async"')}</a></div>
        <div class="reveal">
            <span class="book-label">${esc(t.bookBlock.label)}</span>
            <h2 class="book-title">Enterprise Thinking</h2>
            <p class="book-subtitle">${esc(t.bookPage.subtitle)}</p>
            <p class="lead">${esc(t.bookBlock.text)}</p>
            <div class="btn-row">
                <a class="btn btn-primary" href="${url(lang, 'book')}">${esc(t.bookBlock.discover)}</a>
                <a class="btn btn-secondary" href="${amazon(lang)}" target="_blank" rel="noopener">${esc(t.bookBlock.buy)}</a>
            </div>
        </div>
    </div>
</section>

<section class="section" id="who-i-work-with">
    <div class="wrap split">
        <h2 class="section-title reveal">${esc(t.who.heading)}</h2>
        <div class="prose">
            <p class="lead reveal">${esc(t.who.intro)}</p>
            <ul class="checks">${t.who.items.map(i => `<li class="reveal">${esc(i)}</li>`).join('')}</ul>
            <div class="pull-quote reveal">
                <p class="quote-lead">${esc(t.who.quoteLead)}</p>
                <blockquote><p>“${esc(t.who.quote)}”</p></blockquote>
            </div>
        </div>
    </div>
</section>

${sep()}

<section class="section" id="about">
    <div class="wrap about-grid">
        <figure class="portrait reveal">${portraitImg(t.aboutPage.photoAlt)}</figure>
        <div class="prose">
            <h2 class="section-title reveal">${esc(t.aboutPage.heading)}</h2>
            <p class="role reveal">${esc(t.aboutPage.role)}</p>
            <p class="reveal">${esc(t.aboutPage.paras[0])}</p>
            <p class="connections reveal">${esc(t.aboutPage.focus)}</p>
            <a class="text-link reveal" href="${url(lang, 'about')}">${esc(t.aboutShort.link)}</a>
        </div>
    </div>
</section>

<section class="section" id="contact">
    <div class="wrap cta-grid">
        <div class="prose">
            <h2 class="section-title reveal">${esc(t.cta.heading)}</h2>
            ${t.cta.paras.map(p => `<p class="reveal">${esc(p)}</p>`).join('\n            ')}
            <p class="cta-strong reveal">${esc(t.cta.strong)}</p>
            <p class="reveal">${esc(t.cta.after)}</p>
            <div class="signature reveal"><p>${esc(t.cta.sign1)}</p><p>${BRAND}</p></div>
        </div>
        <div class="reveal">${form(lang, 'short')}</div>
    </div>
</section>`;
}

function servicesSection(lang) {
    const s = T[lang].services;
    return `<section class="section" id="services">
    <div class="wrap">
        <div class="prose">
            <h2 class="section-title reveal">${esc(s.heading)}</h2>
            <p class="lead reveal services-intro">${esc(s.intro)}</p>
        </div>
        <ul class="services-grid">${s.items.map((item, i) =>
            `<li class="service reveal" style="--i:${i % 3}">${icon(i)}<h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></li>`).join('')}</ul>
        <p class="services-note reveal">${esc(s.note)}</p>
    </div>
</section>`;
}

function gainsList(lang) {
    const g = T[lang].gains;
    return `<h3 class="gains-title reveal">${esc(g.heading)}</h3>
            <ul class="checks">${g.items.map(i => `<li class="reveal">${esc(i)}</li>`).join('')}</ul>`;
}

function etPage(lang) {
    const t = T[lang], e = t.etPage;
    return `
<section class="page-hero et-hero">
    <div class="wrap et-grid">
        <div>
            <span class="eyebrow">${BRAND}</span>
            <h1>${esc(e.heading)}</h1>
            <p class="hero-sub">${esc(e.tagline)}</p>
            <p class="lead" style="margin-top:28px">${esc(e.intro)}</p>
        </div>
        ${diagramCircle(t.et.elements, t.et.center, t.et.diagramLabel)}
        ${diagramArcs(t.et.elements, t.et.center, t.et.diagramLabel)}
    </div>
</section>

<section class="section" id="what-is-enterprise-thinking">
    <div class="wrap split">
        <h2 class="section-title reveal">${esc(e.whatHeading)}</h2>
        <div class="prose">
            ${e.whatParas.map((p, i) => `<p class="${i === 0 ? 'lead ' : ''}reveal">${esc(p)}</p>`).join('\n            ')}
            <p class="et-closing reveal">${esc(t.et.closing)}</p>
        </div>
    </div>
</section>

${sep()}

<section class="section" id="why-organizations-underperform">
    <div class="wrap">
        <div class="prose">
            <h2 class="section-title reveal">${esc(e.whyHeading)}</h2>
            <p class="lead reveal">${esc(e.whyIntro)}</p>
        </div>
        <ul class="causes">${e.causes.map((c, i) =>
            `<li class="cause reveal" style="--i:${i % 3}"><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></li>`).join('')}</ul>
    </div>
</section>

<section class="section" id="how-it-works">
    <div class="wrap">
        <div class="prose">
            <h2 class="section-title reveal">${esc(e.howHeading)}</h2>
            <p class="lead reveal">${esc(e.howIntro)}</p>
        </div>
        <ol class="chain" aria-label="${esc(e.howHeading)}">${e.steps.map((s, i) =>
            `<li class="chain-step reveal" style="--i:${i}"><span class="chain-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}</ol>
        <div class="highlights reveal prose">
            <p>${esc(t.expect.highlight1)}</p>
            <p>${esc(t.expect.highlight2)}</p>
        </div>
    </div>
</section>

<section class="section" id="what-clients-gain">
    <div class="wrap split">
        <h2 class="section-title reveal">${esc(t.gains.heading)}</h2>
        <div class="prose">
            <p class="lead reveal">${esc(t.gains.intro)}</p>
            <ul class="checks">${t.gains.items.map(i => `<li class="reveal">${esc(i)}</li>`).join('')}</ul>
        </div>
    </div>
</section>

<section class="band on-dark" id="transformation">
    <svg class="band-ring" viewBox="0 0 520 520" aria-hidden="true"><path d="${crescent(260, 260, 240, 12, 22)}" fill="#fff"/></svg>
    <div class="wrap">
        <h2 class="reveal">${esc(t.transformation.heading)}</h2>
        <div class="prose">
            <p class="reveal">${esc(t.transformation.p1)}</p>
        </div>
        <ul class="strike-list">${t.transformation.words.map(w => `<li><s>${esc(w)}</s></li>`).join('')}</ul>
        <div class="prose">
            <p class="reveal">${esc(t.transformation.p2)}</p>
            <p class="reveal">${esc(t.transformation.p3)}</p>
            <p class="reveal">${esc(t.transformation.p4)}</p>
        </div>
        <p class="band-closing reveal">${esc(t.transformation.closing)}</p>
    </div>
</section>

<section class="section" id="next">
    <div class="wrap book-feature">
        <div class="book-3d reveal"><a class="book" href="${url(lang, 'book')}" tabindex="-1" aria-hidden="true">${coverImg(lang, t.bookPage.coverAlt, '(max-width: 860px) 70vw, 360px', 'loading="lazy" decoding="async"')}</a></div>
        <div class="reveal">
            <h2 class="book-title">${esc(e.nextHeading)}</h2>
            <p class="lead">${esc(e.nextText)}</p>
            <div class="btn-row">
                <a class="btn btn-primary" href="${url(lang, 'contact')}">${esc(t.hero.ctaContact)}</a>
                <a class="btn btn-secondary" href="${url(lang, 'book')}">${esc(t.bookBlock.discover)}</a>
            </div>
        </div>
    </div>
</section>`;
}

function bookPage(lang) {
    const t = T[lang], b = t.bookPage, fct = b.facts;
    const ed = BOOK.editions[lang];
    return `
<section class="page-hero">
    <div class="wrap book-feature">
        <div class="book-3d">
            <div class="book">${coverImg(lang, b.coverAlt, '(max-width: 860px) 70vw, 360px', 'fetchpriority="high"')}</div>
        </div>
        <div>
            <span class="book-label">${esc(b.label)}</span>
            <h1>Enterprise Thinking</h1>
            <p class="book-subtitle">${esc(b.subtitle)}</p>
            <p class="muted" style="margin-top:8px">${esc(b.by)}</p>
            <div class="btn-row" style="margin-top:28px">
                <a class="btn btn-primary" href="${amazon(lang)}" target="_blank" rel="noopener">${esc(t.bookBlock.buy)}</a>
                <a class="btn btn-secondary" href="${BOOK.search}" target="_blank" rel="noopener">${esc(b.allEditions)}</a>
            </div>
            <!-- TODO: si existe un capítulo de muestra, añadir aquí el botón "Download a sample chapter" (y en ES/NL) -->
            <dl class="facts">
                <dt>${esc(fct.author)}</dt><dd>Alex Fialka</dd>
                <dt>${esc(fct.published)}</dt><dd>${esc(fct.publishedValue)}</dd>
                <dt>${esc(fct.languages)}</dt><dd>${esc(fct.languagesValue)}</dd>
                <dt>${esc(fct.pages)}</dt><dd>${ed.pages}</dd>
                <dt>${esc(fct.formats)}</dt><dd>${esc(fct.formatsValue)}</dd>
                <dt>ISBN</dt><dd>${ed.isbn}</dd>
                <dt>${esc(fct.publisher)}</dt><dd>${esc(fct.publisherValue)}</dd>
            </dl>
        </div>
    </div>
</section>

<section class="section" id="about-the-book">
    <div class="wrap split">
        <h2 class="section-title reveal">${esc(b.aboutHeading)}</h2>
        <div class="prose">
            ${b.aboutParas.map((p, i) => `<p class="${i === 0 ? 'lead ' : ''}reveal">${esc(p)}</p>`).join('\n            ')}
        </div>
    </div>
</section>

<section class="quote-band">
    <div class="wrap">
        <blockquote class="reveal"><p>“${esc(b.quote)}”</p></blockquote>
        <p class="tagline reveal">${esc(b.tagline)}</p>
    </div>
</section>

<section class="section" id="what-you-will-learn">
    <div class="wrap split">
        <h2 class="section-title reveal">${esc(b.learnHeading)}</h2>
        <div class="prose">
            <p class="lead reveal">${esc(b.learnIntro)}</p>
            <ul class="learn-list">${b.learn.map(i => `<li class="reveal">${esc(i)}</li>`).join('')}</ul>
            <h3 class="reveal" style="margin-top:56px;font-size:var(--fs-h3)">${esc(b.forHeading)}</h3>
            <p class="reveal">${esc(b.forText)}</p>
        </div>
    </div>
</section>

${sep()}

<section class="section" id="editions">
    <div class="wrap">
        <h2 class="section-title reveal">${esc(b.editionsHeading)}</h2>
        <ul class="editions">${LANGS.map((l, i) => {
            const e = BOOK.editions[l];
            return `<li class="edition reveal" style="--i:${i}" lang="${l}">
                <img src="/assets/img/book-cover-${l}-480.webp" width="480" height="716" alt="" loading="lazy" decoding="async">
                <div><h3 lang="${lang}">${esc(b.editions[l])}</h3><p>${esc(e.title)}</p>
                <p lang="${lang}">${e.pages} ${esc(b.pagesUnit)} · ISBN ${e.isbn}</p>
                <a class="text-link" lang="${lang}" href="${amazon(l)}" target="_blank" rel="noopener">${esc(b.viewOnAmazon)}</a></div>
            </li>`;
        }).join('')}</ul>
    </div>
</section>

<section class="section">
    <div class="wrap">
        <div class="prose">
            <h2 class="section-title reveal">${esc(b.foundationHeading)}</h2>
            <p class="lead reveal">${esc(b.foundationText)}</p>
            <p class="reveal" style="margin-top:24px"><a class="text-link" href="${url(lang, 'et')}">${esc(b.foundationLink)}</a></p>
        </div>
    </div>
</section>`;
}

function aboutPage(lang) {
    const t = T[lang], a = t.aboutPage;
    return `
<section class="page-hero">
    <div class="wrap about-grid">
        <figure class="portrait">${portraitImg(a.photoAlt, 'fetchpriority="high"')}</figure>
        <div class="prose">
            <h1>${esc(a.heading)}</h1>
            <p class="role">${esc(a.role)}</p>
            ${a.paras.map((p, i) => `<p${i === 0 ? ' class="lead"' : ''}>${esc(p)}</p>`).join('\n            ')}
            <p class="connections">${esc(a.focus)}</p>
            <p>${esc(a.linkedinNote)}</p>
            <div class="btn-row" style="margin-top:36px">
                <a class="btn btn-primary" href="${url(lang, 'contact')}">${esc(t.hero.ctaContact)}</a>
                <a class="btn btn-secondary" href="${SITE.linkedin}" target="_blank" rel="noopener">${esc(a.linkedinBtn)}</a>
            </div>
        </div>
    </div>
</section>

<section class="section" id="experience">
    <div class="wrap split">
        <h2 class="section-title reveal">${esc(a.expHeading)}</h2>
        <div class="prose">
            ${a.expParas.map((p, i) => `<p class="${i === 0 ? 'lead ' : ''}reveal">${esc(p)}</p>`).join('\n            ')}
            <div class="pull-quote reveal">
                <p class="quote-lead">${esc(a.exampleLabel)}</p>
                <p class="example">${esc(a.example)}</p>
            </div>
            <div class="btn-row reveal" style="margin-top:40px">
                <a class="btn btn-primary" href="${SITE.linkedin}" target="_blank" rel="noopener">${esc(a.expBtn)}</a>
                <a class="btn btn-secondary" href="${url(lang, 'et')}">${esc(t.hero.ctaEt)}</a>
            </div>
        </div>
    </div>
</section>`;
}

function contactPage(lang) {
    const t = T[lang], c = t.contactPage;
    return `
<section class="page-hero">
    <div class="wrap cta-grid">
        <div class="prose">
            <h1>${esc(c.heading)}</h1>
            <p class="lead" style="margin-top:28px">${esc(c.intro)}</p>
            <p>${esc(t.cta.paras[1])}</p>
            <p>${esc(t.cta.after)}</p>
            <div class="signature"><p>${esc(t.cta.sign1)}</p><p>${BRAND}</p></div>
            <dl class="contact-direct">
                <div><dt>${esc(c.emailLabel)}</dt><dd><a href="mailto:${SITE.email}">${SITE.email}</a></dd></div>
                <div><dt>${esc(c.linkedinLabel)}</dt><dd><a href="${SITE.linkedin}" target="_blank" rel="noopener">linkedin.com/in/alexfialka</a></dd></div>
                <div><dt>${esc(c.phoneLabel)}</dt><dd><a href="tel:${SITE.phone}">${SITE.phoneDisplay}</a></dd></div>
                <div><dt>&nbsp;</dt><dd class="muted">${esc(c.location)}</dd></div>
            </dl>
        </div>
        <div>${form(lang, 'full')}</div>
    </div>
</section>`;
}

function legalPage(lang, key) {
    const t = T[lang];
    let body = fill(LEGAL[lang][key], { privacy: url(lang, 'privacy'), cookies: url(lang, 'cookies'), legal: url(lang, 'legal') });
    // Tablas: cada celda lleva su cabecera en data-label para apilarlas en móvil
    body = body.replace(/<table[\s\S]*?<\/table>/g, table => {
        const heads = [...table.matchAll(/<th>([\s\S]*?)<\/th>/g)].map(m => m[1].replace(/<[^>]+>/g, ''));
        return table.replace(/<tr>([\s\S]*?)<\/tr>/g, (row, cells) => {
            let i = 0;
            return '<tr>' + cells.replace(/<td>/g, () => `<td data-label="${esc(heads[i++] || '')}">`) + '</tr>';
        });
    });
    return `
<article class="legal">
    <div class="wrap">
        <h1>${esc(t.meta[key].title.split(' — ')[0])}</h1>
        <p class="updated">${esc(t.legal.updated)}</p>
        <div class="legal-body">
${body}
        </div>
        <p class="legal-back"><a class="text-link" href="${url(lang, 'home')}">${esc(t.legal.back)}</a></p>
    </div>
</article>`;
}

/* ---------- Write pages ---------- */
const RENDER = { home: homePage, et: etPage, book: bookPage, about: aboutPage, contact: contactPage };
let count = 0;
LANGS.forEach(lang => {
    PAGES.forEach(page => {
        const main = RENDER[page] ? RENDER[page](lang) : legalPage(lang, page);
        write(path.join(lang, T[lang].slugs[page], 'index.html'), layout(lang, page, main));
        count++;
    });
});

/* ---------- Root: redirección por idioma (por defecto EN) ---------- */
write('index.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${BRAND} — Alex Fialka</title>
    <meta name="robots" content="noindex, follow">
    <meta name="description" content="${esc(T.en.meta.home.desc)}">
    ${LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="${abs(l, 'home')}">`).join('\n    ')}
    <link rel="alternate" hreflang="x-default" href="${abs('en', 'home')}">
    <link rel="icon" href="/favicon.ico" sizes="48x48">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <script>
        (function () {
            var L = ['en', 'es', 'nl'], s = null;
            try { s = localStorage.getItem('af_lang'); } catch (e) {}
            if (L.indexOf(s) < 0) {
                var n = navigator.languages || [navigator.language || 'en'];
                for (var i = 0; i < n.length; i++) {
                    var c = String(n[i] || '').slice(0, 2).toLowerCase();
                    if (L.indexOf(c) > -1) { s = c; break; }
                }
            }
            location.replace('/' + (L.indexOf(s) > -1 ? s : 'en') + '/' + location.hash);
        })();
    </script>
    <noscript><meta http-equiv="refresh" content="0; url=/en/"></noscript>
    <style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#FAFAF8;color:#052352;font-family:Georgia,serif;text-align:center}a{color:#052352;margin:0 .6em}</style>
</head>
<body>
    <main>
        <p>${BRAND} — Alex Fialka</p>
        <p>${LANGS.map(l => `<a href="${url(l, 'home')}" hreflang="${l}" lang="${l}">${esc(T[l].root.choose)} · ${l.toUpperCase()}</a>`).join('')}</p>
    </main>
</body>
</html>
`);

/* ---------- 404 ---------- */
write('404.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 — ${BRAND}</title>
    <meta name="robots" content="noindex">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/assets/css/site.css?v=${V.css}">
</head>
<body>
<main class="legal"><div class="wrap">
    <img src="/assets/img/et-logo-192.webp" width="186" height="192" alt="${BRAND}" style="width:96px">
    <h1 style="margin-top:32px">404</h1>
    <p class="lead" style="margin-top:16px">This page does not exist. · Esta página no existe. · Deze pagina bestaat niet.</p>
    <p style="margin-top:28px">${LANGS.map(l => `<a class="text-link" href="${url(l, 'home')}" hreflang="${l}" lang="${l}" style="margin-right:24px">${esc(T[l].legal.back)}</a>`).join('')}</p>
</div></main>
</body>
</html>
`);

/* ---------- sitemap.xml ---------- */
const sitemap = ['<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'];
PAGES.forEach(page => LANGS.forEach(lang => {
    sitemap.push('  <url>', `    <loc>${abs(lang, page)}</loc>`, `    <lastmod>${TODAY}</lastmod>`);
    LANGS.forEach(l => sitemap.push(`    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(l, page)}"/>`));
    sitemap.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${abs('en', page)}"/>`);
    sitemap.push(`    <priority>${page === 'home' ? '1.0' : page === 'et' ? '0.9' : ['book', 'about', 'contact'].includes(page) ? '0.8' : '0.3'}</priority>`, '  </url>');
}));
sitemap.push('</urlset>', '');
write('sitemap.xml', sitemap.join('\n'));

write('robots.txt', `# robots.txt — ${SITE.url}
User-agent: *
Allow: /
Disallow: /_src/
Disallow: /_web-anterior/

Sitemap: ${SITE.url}/sitemap.xml
`);

write('site.webmanifest', JSON.stringify({
    name: BRAND + ' — Alex Fialka',
    short_name: 'Fialka ET',
    start_url: '/',
    display: 'browser',
    background_color: '#FAFAF8',
    theme_color: '#052352',
    icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
}, null, 2) + '\n');

console.log(`${count} páginas generadas · css?v=${V.css} · js?v=${V.js}`);
