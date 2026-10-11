/* ============================================================
   Enterprise Thinking — interacciones
   Los textos de cada idioma llegan en <script id="i18n"> (los pone
   el build desde _src/i18n/*.json); aquí no hay texto fijo.
============================================================ */
(() => {
    'use strict';

    const root = document.documentElement;
    const lang = root.lang || 'en';
    let T = {};
    try { T = JSON.parse(document.getElementById('i18n').textContent); } catch (e) {}

    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
    };
    store.set('af_lang', lang);

    /* ---------- Header: borde al hacer scroll + menú móvil ---------- */
    const header = document.querySelector('.site-header');
    if (header) {
        let queued = false;
        const update = () => { queued = false; header.classList.toggle('is-scrolled', window.scrollY > 8); };
        window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, { passive: true });
        requestAnimationFrame(update);
    }

    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('site-nav');
    if (toggle && nav) {
        const setOpen = open => {
            nav.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.querySelector('.sr-only').textContent = open ? T.close : T.menu;
        };
        toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
        nav.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
        });
    }

    /* ---------- Cambio de idioma: misma página y misma sección ---------- */
    document.querySelectorAll('.langs a[hreflang]').forEach(a => {
        a.addEventListener('click', () => {
            if (location.hash && !a.href.includes('#')) a.href = a.href + location.hash;
        });
    });

    /* ---------- Revelados al entrar en pantalla ---------- */
    const targets = document.querySelectorAll('.reveal, .diagram, .strike-list');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            });
        }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
        targets.forEach(el => io.observe(el));
    } else {
        targets.forEach(el => el.classList.add('is-visible'));
    }

    /* ---------- Formularios de contacto ---------- */
    document.querySelectorAll('form.form').forEach(form => {
        const status = form.querySelector('.form-status');
        const button = form.querySelector('button[type="submit"]');
        const say = (msg, type) => {
            status.textContent = msg;
            status.className = 'form-status ' + (type === 'error' ? 'is-error' : 'is-success');
        };

        form.addEventListener('submit', async e => {
            e.preventDefault();
            const f = form.elements;
            const val = name => (f[name] ? f[name].value.trim() : '');
            const name = val('name'), email = val('email'), message = val('message');

            ['name', 'email', 'message'].forEach(n => f[n] && f[n].removeAttribute('aria-invalid'));

            // Honeypot: los bots rellenan el campo oculto; se ignora en silencio.
            if (val('website')) { say(T.successSent, 'success'); form.reset(); return; }

            const missing = ['name', 'email', 'message'].filter(n => !val(n));
            if (missing.length) {
                missing.forEach(n => f[n].setAttribute('aria-invalid', 'true'));
                f[missing[0]].focus();
                return say(T.errRequired, 'error');
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
                f.email.setAttribute('aria-invalid', 'true');
                f.email.focus();
                return say(T.errEmail, 'error');
            }
            if (!f.consent.checked) { f.consent.focus(); return say(T.errConsent, 'error'); }

            const lines = [
                `${T.name}: ${name}`,
                val('company') && `${T.company}: ${val('company')}`,
                val('role') && `${T.role}: ${val('role')}`,
                `${T.email}: ${email}`,
                '',
                message
            ].filter(l => l !== '' && l !== false).join('\n');

            const track = () => {
                if (typeof window.gtag === 'function') {
                    window.gtag('event', 'contact_form_submit', { language: lang, form: form.id });
                }
            };

            const endpoint = form.dataset.endpoint;
            if (endpoint) {
                // Envío directo (p. ej. Formspree), sin abrir el correo.
                button.disabled = true;
                const label = button.textContent;
                button.textContent = T.sending;
                try {
                    const res = await fetch(endpoint, {
                        method: 'POST',
                        headers: { Accept: 'application/json' },
                        body: new FormData(form)
                    });
                    if (!res.ok) throw new Error(res.status);
                    track();
                    say(T.successSent, 'success');
                    form.reset();
                } catch (err) {
                    say(T.errSend, 'error');
                } finally {
                    button.disabled = false;
                    button.textContent = label;
                }
                return;
            }

            // Sin servicio configurado: abre el correo con el mensaje preparado.
            window.location.href = 'mailto:alex@fialka.es?subject=' +
                encodeURIComponent(T.mailSubject) + '&body=' + encodeURIComponent(lines);
            track();
            say(T.successMail, 'success');
            form.reset();
        });
    });

    /* ---------- Cookies + Google Consent Mode v2 ---------- */
    const KEY = 'af_cookie_consent';
    const banner = document.getElementById('cookie-banner');

    const showBanner = () => {
        if (!banner) return;
        banner.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add('is-shown')));
    };
    const hideBanner = () => {
        if (!banner) return;
        banner.classList.remove('is-shown');
        setTimeout(() => { banner.hidden = true; }, 400);
    };
    const setConsent = granted => {
        store.set(KEY, granted ? '1' : '0');
        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', { analytics_storage: granted ? 'granted' : 'denied' });
        }
        hideBanner();
    };

    if (banner) {
        const stored = store.get(KEY);
        if (stored !== '1' && stored !== '0') showBanner();
        banner.querySelector('[data-consent="accept"]').addEventListener('click', () => setConsent(true));
        banner.querySelector('[data-consent="reject"]').addEventListener('click', () => setConsent(false));
    }
    document.querySelectorAll('[data-cookie-settings]').forEach(btn => btn.addEventListener('click', showBanner));
})();
