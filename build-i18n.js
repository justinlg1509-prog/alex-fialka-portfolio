/* ============================================================
   build-i18n.js — Genera las páginas estáticas /en/ y /nl/
   a partir de index.html (ES) + el diccionario I18N de script.js.

   EJECUTAR cada vez que se cambie contenido del index o las
   traducciones, para que las versiones por idioma no se
   desincronicen:   node build-i18n.js "."
============================================================ */
const fs = require('fs');
const path = require('path');
const ROOT = process.argv[2] || '.';

const html0 = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(ROOT, 'script.js'), 'utf8');

// --- extract I18N object ---
const s = js.indexOf('const I18N = {');
const o = js.indexOf('{', s);
let d = 0, i = o, end = -1;
for (; i < js.length; i++) { if (js[i] === '{') d++; else if (js[i] === '}') { d--; if (d === 0) { end = i; break; } } }
const I18N = eval('(' + js.slice(o, end + 1) + ')');

const LOCALES = { en: 'en_GB', nl: 'nl_NL' };
const URLS = { en: 'https://fialka.es/en/', nl: 'https://fialka.es/nl/' };
const YEAR = 2026;

const escText = v => String(v).replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = v => String(v).replace(/"/g, '&quot;');

function findClose(html, tag, from) {
  const re = new RegExp('<' + tag + '(?:\\s|>|/)|</' + tag + '>', 'g');
  re.lastIndex = from;
  let depth = 1, m;
  while ((m = re.exec(html))) {
    if (m[0].charAt(1) === '/') { depth--; if (depth === 0) return m.index; }
    else depth++;
  }
  return html.length;
}

function replaceInner(html, attr, dict, htmlMode) {
  const re = new RegExp('<([a-zA-Z0-9]+)([^>]*\\b' + attr + '="([^"]+)"[^>]*)>', 'g');
  let out = '', last = 0, m;
  while ((m = re.exec(html))) {
    const tag = m[1], key = m[3], openEnd = re.lastIndex;
    if (dict[key] == null) continue;
    const closeIdx = findClose(html, tag, openEnd);
    out += html.slice(last, openEnd);
    out += htmlMode ? dict[key] : escText(dict[key]);
    last = closeIdx;
    re.lastIndex = closeIdx;
  }
  out += html.slice(last);
  return out;
}

function setAttrPass(html, dataAttr, targetAttr, dict) {
  const re = new RegExp('<[a-zA-Z0-9]+[^>]*\\b' + dataAttr + '="([^"]+)"[^>]*>', 'g');
  return html.replace(re, (full, key) => {
    if (dict[key] == null) return full;
    const val = escAttr(dict[key]);
    // Match the real attribute (preceded by whitespace) so we don't hit the
    // "alt=" substring inside data-i18n-alt / similar data-* attributes.
    const attrRe = new RegExp('(\\s)' + targetAttr + '="[^"]*"');
    if (attrRe.test(full))
      return full.replace(attrRe, '$1' + targetAttr + '="' + val + '"');
    return full.replace(/>$/, ' ' + targetAttr + '="' + val + '">');
  });
}

['en', 'nl'].forEach(lang => {
  const dict = I18N[lang];
  let h = html0;

  // translate
  h = replaceInner(h, 'data-i18n-html', dict, true);
  h = replaceInner(h, 'data-i18n', dict, false);
  h = setAttrPass(h, 'data-i18n-ph', 'placeholder', dict);
  h = setAttrPass(h, 'data-i18n-alt', 'alt', dict);

  // year + html lang
  h = h.split('__YEAR__').join(YEAR);
  h = h.replace('<html lang="es" data-lang="es">', '<html lang="' + lang + '" data-lang="' + lang + '">');

  // title + metas
  h = h.replace(/<title>[\s\S]*?<\/title>/, '<title>' + escText(dict['docTitle']) + '</title>');
  h = h.replace(/(<meta name="description" content=")[^"]*(")/, '$1' + escAttr(dict['metaDesc']) + '$2');
  h = h.replace(/(<meta property="og:description" content=")[^"]*(")/, '$1' + escAttr(dict['metaDesc']) + '$2');
  h = h.replace(/(<meta name="twitter:description" content=")[^"]*(")/, '$1' + escAttr(dict['metaDesc']) + '$2');
  h = h.replace(/(<meta property="og:title" content=")[^"]*(")/, '$1' + escAttr(dict['docTitle']) + '$2');
  h = h.replace(/(<meta name="twitter:title" content=")[^"]*(")/, '$1' + escAttr(dict['docTitle']) + '$2');
  h = h.replace('content="es_ES"', 'content="' + LOCALES[lang] + '"');

  // canonical
  h = h.replace('<link rel="canonical" href="https://fialka.es/" />', '<link rel="canonical" href="' + URLS[lang] + '" />');

  // active lang button
  h = h.replace('class="lang-btn active" type="button" data-lang="es" aria-label="Cambiar idioma a Español" aria-pressed="true"',
                'class="lang-btn" type="button" data-lang="es" aria-label="Cambiar idioma a Español" aria-pressed="false"');
  h = h.replace('class="lang-btn" type="button" data-lang="' + lang + '"', 'class="lang-btn active" type="button" data-lang="' + lang + '"');
  h = h.replace(new RegExp('(data-lang="' + lang + '"[^>]*?)aria-pressed="false"'), '$1aria-pressed="true"');

  // absolutize asset/links (page lives in a subfolder)
  h = h.replace(/href="styles\.css"/g, 'href="/styles.css"');
  h = h.replace(/src="script\.js"/g, 'src="/script.js"');
  h = h.replace(/(href|src)="images\//g, '$1="/images/');
  h = h.replace(/(href)="(aviso-legal|privacidad|cookies)\.html"/g, '$1="/$2.html"');

  const dir = path.join(ROOT, lang);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), h);
  console.log(lang + '/index.html generado (' + h.length + ' bytes)');
});
