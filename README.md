# Enterprise Thinking — fialka.es

Sitio de Alex Fialka y su libro *Enterprise Thinking*, en inglés, español y neerlandés.
HTML estático generado con Node (sin dependencias) y publicado en Vercel desde `main`.

## Editar contenido

1. Textos: `_src/i18n/en.json`, `es.json`, `nl.json` (mismas claves en los tres).
2. Páginas legales: `_src/legal/<idioma>/{legal,privacy,cookies}.html`.
3. Estilos y JS: `assets/css/site.css`, `assets/js/site.js`.
4. Regenerar: `node _src/build.js` (crea `/en/`, `/es/`, `/nl/`, `index.html`, `404.html`, `sitemap.xml`…).

No edites a mano las páginas generadas en `/en/`, `/es/` y `/nl/`: se sobrescriben en cada build.

## Pendiente

- NIF/NIE y dirección en las páginas legales (`[PENDIENTE]`).
- `SITE.formEndpoint` en `_src/build.js` (p. ej. Formspree) para enviar el formulario sin abrir el correo.
