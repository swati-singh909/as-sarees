import { useEffect, useState } from 'react';

// Tiny hash router. Hash links work on any static host without server rewrites.
//   #/                     Home
//   #/?s=fabrics           Home, scrolled to a section
//   #/fabric/<id>          Shop by fabric (id "all" = every saree)
//   #/fabric/all?q=red     Search results
//   #/saree/<code>         Saree details
function parse(hash) {
  const raw = hash.replace(/^#/, '') || '/';
  const [path, queryString = ''] = raw.split('?');
  const query = new URLSearchParams(queryString);
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'fabric') {
    return { page: 'fabric', id: decodeURIComponent(parts[1] || 'all'), q: query.get('q') || '' };
  }
  if (parts[0] === 'saree' && parts[1]) return { page: 'saree', code: decodeURIComponent(parts[1]) };
  return { page: 'home', section: query.get('s') || '' };
}

const scrollKey = (hash) => `as_scroll_${hash || '#/'}`;

export function useRoute() {
  const [route, setRoute] = useState(() => parse(window.location.hash));

  useEffect(() => {
    const onChange = (event) => {
      // Remember where the visitor was on the page they left.
      try {
        const oldHash = new URL(event.oldURL).hash;
        sessionStorage.setItem(scrollKey(oldHash), String(window.scrollY));
      } catch {
        /* ignore */
      }
      const next = parse(window.location.hash);
      setRoute(next);
      if (next.page === 'home' && next.section) return; // Home scrolls to the section itself
      // Lists go back to where the visitor was; a saree page starts at the top.
      let saved = 0;
      if (next.page !== 'saree') {
        try {
          saved = Number(sessionStorage.getItem(scrollKey(window.location.hash)) || 0);
        } catch {
          saved = 0;
        }
      }
      requestAnimationFrame(() => window.scrollTo(0, saved));
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

export const paths = {
  home: '#/',
  section: (id) => `#/?s=${id}`,
  fabric: (id = 'all', q = '') => `#/fabric/${encodeURIComponent(id)}${q ? `?q=${encodeURIComponent(q)}` : ''}`,
  saree: (code) => `#/saree/${encodeURIComponent(code)}`,
};

// Scrolls to a section on Home. Used by links like "Shop by fabric".
// If the section is on this page, scroll smoothly; otherwise follow the link.
export function goToSection(event, id) {
  const el = document.getElementById(id);
  if (el) {
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
