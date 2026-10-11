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
const PAGES = ['home', 'book', 'about', 'contact', 'legal', 'privacy', 'cookies'];
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

// Hero: nodos dispersos que se ordenan y conectan dentro del círculo abierto
function heroArt(label) {
    const N = [
        [260, 112, 1], [170, 160, 0], [352, 156, 0], [112, 250, 0], [214, 228, 0], [306, 232, 0],
        [404, 258, 0], [260, 290, 1], [160, 336, 0], [252, 372, 0], [350, 340, 1], [206, 430, 0], [318, 428, 0]
    ];
    const E = [[0, 1], [0, 2], [0, 7], [1, 3], [1, 4], [2, 5], [2, 6], [3, 8], [4, 7], [5, 7], [5, 6], [7, 9], [8, 9], [8, 11],
               [9, 10], [6, 10], [10, 12], [11, 12], [4, 8], [9, 12]];
    let seed = 7;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const nodes = N.map(([x, y, key], i) => {
        const dx = Math.round((rnd() - 0.5) * 220), dy = Math.round((rnd() - 0.5) * 220);
        return `<circle class="art-node${key ? ' is-key' : ''}" cx="${x}" cy="${y}" r="${key ? 7 : 4.5}" style="--i:${i};--dx:${dx}px;--dy:${dy}px"/>`;
    }).join('');
    const edges = E.map(([a, b], i) =>
        `<line class="art-edge" x1="${N[a][0]}" y1="${N[a][1]}" x2="${N[b][0]}" y2="${N[b][1]}" pathLength="1" style="--i:${i}"/>`).join('');
    return `<svg class="hero-art" viewBox="0 0 520 520" role="img" aria-label="${esc(label)}">
        <defs>${gradient('hg')}<mask id="hm"><path class="ring-draw" d="${arcPath(260, 260, 236, 22)}" fill="none" stroke="#fff" stroke-width="30" pathLength="1"/></mask></defs>
        <path d="${crescent(260, 260, 240, 11, 22)}" fill="url(#hg)" mask="url(#hm)"/>
        <g>${edges}</g><g>${nodes}</g>
        <g class="art-pi" transform="translate(482 256)" aria-hidden="true"><path d="M1 7C2.5 4.5 5 3.6 8 3.6H32M11.5 3.6C11.5 14 10.5 23 7 30M23 3.6V25C23 29 25 30.5 28.5 29"/></g>
    </svg>`;
}

// Diagrama de los 6 elementos sobre el círculo abierto (escritorio)
function diagramCircle(els, label) {
    const cx = 360, cy = 280, R = 190;
    const pts = els.map((_, k) => P(cx, cy, R, -90 + k * 60));
    let chords = '', i = 0;
    for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++) {
        if (b - a === 1 || (a === 0 && b === 5)) continue;
        chords += `<line class="chord" x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}" pathLength="1" style="--i:${i++}"/>`;
    }
    const labels = els.map((name, k) => {
        const ang = -90 + k * 60;
        const [lx, ly] = P(cx, cy, R + 26, ang);
        const anchor = Math.abs(Math.cos(ang * Math.PI / 180)) < 0.2 ? 'middle' : (Math.cos(ang * Math.PI / 180) > 0 ? 'start' : 'end');
        const dy = ang === -90 ? -4 : ang === 90 ? 20 : 7;
        return `<circle class="dot" cx="${pts[k][0]}" cy="${pts[k][1]}" r="9" style="--i:${k}"/>` +
               `<text x="${lx}" y="${r1(ly + dy)}" text-anchor="${anchor}" style="--i:${k}">${esc(name)}</text>`;
    }).join('');
    return `<svg class="diagram diagram-circle" viewBox="0 0 720 560" role="img" aria-label="${esc(label)}">
        <defs>${gradient('dg')}</defs>
        <path class="rim" d="${arcPath(cx, cy, R, 14)}" stroke="url(#dg)" stroke-width="2.4" pathLength="1" style="--i:0"/>
        ${chords}${labels}
    </svg>`;
}

// Versión vertical para móvil: diagrama de arcos (todos conectados con todos)
function diagramArcs(els, label) {
    const x = 176, top = 40, step = 64;
    const ys = els.map((_, k) => top + k * step);
    let arcs = '', i = 0;
    for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++) {
        const r = (ys[b] - ys[a]) / 2;
        arcs += `<path class="chord${b - a === 1 ? ' rim' : ''}" d="M${x} ${ys[a]}A${r} ${r} 0 0 0 ${x} ${ys[b]}" pathLength="1" style="--i:${i++}"/>`;
    }
    const dots = els.map((name, k) =>
        `<circle class="dot" cx="${x}" cy="${ys[k]}" r="8" style="--i:${k}"/><text x="${x + 22}" y="${ys[k] + 6}" style="--i:${k}">${esc(name)}</text>`).join('');
    return `<svg class="diagram diagram-arcs" viewBox="0 0 360 ${top * 2 + step * 5}" role="img" aria-label="${esc(label)}">${arcs}${dots}</svg>`;
}

const ICONS = [
    '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/><circle cx="8.5" cy="9.5" r="1.2"/><circle cx="12.5" cy="12" r="1.2"/><path d="M9.5 10.3l2 1"/>',
    '<path d="M3 5h4.5l4.5 7H21"/><path d="M3 12h9"/><path d="M3 19h4.5l4.5-7"/>',
    '<circle cx="4.5" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19.5" cy="12" r="2"/><circle cx="12" cy="19" r="2"/><path d="M6 10.5l4.5-4M13.5 6.5l4.5 4M18 13.5l-4.5 4M10.5 17.5l-4.5-4"/>',
    '<rect x="3" y="4" width="8" height="8" rx="1"/><rect x="13" y="12" width="8" height="8" rx="1"/><path d="M11 8h5v4"/><path d="M14.5 10.5 16 12l1.5-1.5"/>',
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
        '@type': 'Person', '@id': SITE.url + '/#alex-fialka', name: 'Alex Fialka', jobTitle: 'Executive',
        url: abs(lang, 'about'), image: SITE.url + '/assets/img/alex-fialka-760.webp',
        email: 'mailto:' + SITE.email, sameAs: [SITE.linkedin], nationality: 'NL',
        knowsLanguage: ['nl', 'en', 'fr', 'de'],
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
        '@type': 'ProfessionalService', '@id': SITE.url + '/#enterprise-thinking', name: 'Enterprise Thinking',
        description: t.meta.home.desc, url: abs(lang, 'home'), logo: SITE.url + '/assets/img/et-logo.png',
        image: SITE.url + `/assets/img/og-${lang}.jpg`, founder: { '@id': person['@id'] },
        email: SITE.email, telephone: SITE.phone, areaServed: ['Europe', 'International'],
        availableLanguage: ['English', 'Spanish', 'Dutch'],
        address: person.address
    };
    const website = {
        '@type': 'WebSite', '@id': SITE.url + '/#website', url: SITE.url + '/', name: 'Enterprise Thinking',
        inLanguage: LANGS, publisher: { '@id': person['@id'] }
    };
    const crumbs = (key) => ({
        '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Enterprise Thinking', item: abs(lang, 'home') },
            { '@type': 'ListItem', position: 2, name: t.nav[key] || t.meta[key].title, item: abs(lang, key) }
        ]
    });
    const byPage = {
        home: [website, person, service, book],
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
    <meta property="og:site_name" content="Enterprise Thinking">
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

function header(lang, page) {
    const t = T[lang];
    const home = url(lang, 'home');
    const items = [
        ['et', home + '#enterprise-thinking', null],
        ['approach', home + '#approach', null],
        ['book', url(lang, 'book'), 'book'],
        ['about', url(lang, 'about'), 'about'],
        ['contact', url(lang, 'contact'), 'contact']
    ];
    return `<a class="skip" href="#main">${esc(t.ui.skip)}</a>
<header class="site-header">
    <div class="wrap header-inner">
        <a class="brand" href="${home}">
            <img src="/assets/img/et-logo-96.webp" width="93" height="96" alt="">
            <span class="brand-text"><span class="brand-name">Enterprise Thinking</span><span class="brand-by">Alex Fialka</span></span>
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
                    <span class="brand-text"><span class="brand-name">Enterprise Thinking</span><span class="brand-by">Alex Fialka</span></span>
                </a>
                <p class="footer-tagline">${esc(f.tagline)}</p>
            </div>
            <div class="footer-col">
                <h2>${esc(f.explore)}</h2>
                <ul>
                    <li><a href="${home}#enterprise-thinking">${esc(t.nav.et)}</a></li>
                    <li><a href="${home}#approach">${esc(t.nav.approach)}</a></li>
                    <li><a href="${url(lang, 'book')}">${esc(t.nav.book)}</a></li>
                    <li><a href="${url(lang, 'about')}">${esc(t.nav.about)}</a></li>
                    <li><a href="${url(lang, 'contact')}">${esc(t.nav.contact)}</a></li>
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
            <h1>${esc(t.hero.title)}</h1>
            <p class="hero-sub">${esc(t.hero.subtitle)}</p>
            <div class="btn-row">
                <a class="btn btn-primary" href="#contact">${esc(t.hero.cta)}</a>
                <a class="btn btn-secondary" href="${url(lang, 'book')}">${esc(t.hero.book)}</a>
            </div>
        </div>
        ${heroArt(t.hero.visualLabel)}
    </div>
</section>

<section class="section problem" aria-label="${esc(t.problem.result)}">
    <div class="wrap">
        <div class="prose">
            <p class="reveal">${esc(t.problem.p1)}</p>
            <p class="reveal">${esc(t.problem.p2)}</p>
            <p class="reveal">${esc(t.problem.p3)}</p>
            <p class="statement reveal">${esc(t.problem.result)}</p>
        </div>
    </div>
</section>

${sep()}

<section class="section" id="enterprise-thinking">
    <div class="wrap et-grid">
        <div class="reveal">
            <h2>${esc(t.et.heading)}</h2>
            <p class="lead">${esc(t.et.body)}</p>
        </div>
        ${diagramCircle(t.et.elements, t.et.diagramLabel)}
        ${diagramArcs(t.et.elements, t.et.diagramLabel)}
    </div>
</section>

<section class="section" id="how-i-help">
    <div class="wrap">
        <div class="prose">
            <h2 class="section-title reveal">${esc(t.help.heading)}</h2>
            <p class="lead reveal">${esc(t.help.p1)}</p>
            <p class="reveal">${esc(t.help.p2)}</p>
            <p class="help-lead reveal">${esc(t.help.lead)}</p>
        </div>
        <ul class="questions">${t.help.questions.map(q => `<li class="reveal">${esc(q)}</li>`).join('')}</ul>
        <p class="prose lead reveal">${esc(t.help.closing)}</p>
    </div>
</section>

<section class="section" id="symptoms-to-causes">
    <div class="wrap">
        <div class="prose">
            <h2 class="section-title reveal">${esc(t.symptoms.heading)}</h2>
            <p class="lead reveal">${esc(t.symptoms.intro)}</p>
        </div>
        <table class="symptoms-table reveal">
            <thead><tr><th scope="col">${esc(t.symptoms.colSymptom)}</th><th scope="col">${esc(t.symptoms.colReaction)}</th></tr></thead>
            <tbody>${t.symptoms.rows.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}</tbody>
        </table>
        <div class="prose">
            <p class="reveal">${esc(t.symptoms.after)}</p>
            <p class="help-lead reveal" style="margin-top:1.6em">${esc(t.symptoms.askLead)}</p>
        </div>
        <p class="big-question reveal">${esc(t.symptoms.question)}</p>
        <p class="prose reveal">${esc(t.symptoms.closing)}</p>
    </div>
</section>

${sep()}

<section class="section" id="services">
    <div class="wrap">
        <h2 class="section-title reveal">${esc(t.services.heading)}</h2>
        <ul class="services-grid">${t.services.items.map((s, i) =>
            `<li class="service reveal" style="--i:${i % 3}">${icon(i)}<h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}</ul>
    </div>
</section>

<section class="section" id="approach">
    <div class="wrap split">
        <h2 class="section-title reveal">${esc(t.approach.heading)}</h2>
        <div class="prose">
            ${t.approach.paras.map(p => `<p class="reveal">${esc(p)}</p>`).join('\n            ')}
            <div class="highlights reveal">
                <p>${esc(t.approach.highlight1)}</p>
                <p>${esc(t.approach.highlight2)}</p>
            </div>
            <p class="lead reveal">${esc(t.approach.closing)}</p>
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
            <h2 class="section-title reveal">${esc(t.aboutShort.heading)}</h2>
            <p class="reveal">${esc(t.aboutShort.lead)}</p>
            <p class="about-quote reveal">${esc(t.aboutShort.quote)}</p>
            <p class="reveal">${esc(t.aboutShort.text)}</p>
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
            <div class="signature reveal"><p>${esc(t.cta.sign1)}</p><p>${esc(t.cta.sign2)}</p></div>
        </div>
        <div class="reveal">${form(lang, 'short')}</div>
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
            <p class="reveal" style="margin-top:24px"><a class="text-link" href="${url(lang, 'home')}#enterprise-thinking">${esc(b.foundationLink)}</a></p>
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
            <p class="lead" style="margin-top:28px">${esc(a.lead)}</p>
            <p class="about-quote">${esc(a.quote)}</p>
            ${a.paras.map(p => `<p>${esc(p)}</p>`).join('\n            ')}
            <p class="connections">${esc(a.connections)}</p>
            ${a.paras2.map(p => `<p>${esc(p)}</p>`).join('\n            ')}
            <div class="btn-row" style="margin-top:36px">
                <a class="btn btn-primary" href="${url(lang, 'contact')}">${esc(a.contactLink)}</a>
                <a class="btn btn-secondary" href="${url(lang, 'book')}">${esc(a.bookLink)}</a>
            </div>
        </div>
    </div>
    <div class="wrap">
        <div class="background prose">
            <h2 class="reveal">${esc(a.backgroundHeading)}</h2>
            ${a.background.map(p => `<p class="reveal">${esc(p)}</p>`).join('\n            ')}
            <!-- TODO: si Alex tiene software propio, añadir una línea aquí (en los 3 idiomas, _src/i18n/*.json → aboutPage.background) -->
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
            <div class="signature"><p>${esc(t.cta.sign1)}</p><p>${esc(t.cta.sign2)}</p></div>
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
const RENDER = { home: homePage, book: bookPage, about: aboutPage, contact: contactPage };
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
    <title>Enterprise Thinking — Alex Fialka</title>
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
        <p>Enterprise Thinking — Alex Fialka</p>
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
    <title>404 — Enterprise Thinking</title>
    <meta name="robots" content="noindex">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/assets/css/site.css?v=${V.css}">
</head>
<body>
<main class="legal"><div class="wrap">
    <img src="/assets/img/et-logo-192.webp" width="186" height="192" alt="Enterprise Thinking" style="width:96px">
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
    sitemap.push(`    <priority>${page === 'home' ? '1.0' : ['book', 'about', 'contact'].includes(page) ? '0.8' : '0.3'}</priority>`, '  </url>');
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
    name: 'Enterprise Thinking — Alex Fialka',
    short_name: 'Enterprise Thinking',
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
