/* ============================================================
   Digital Luxe — Service Worker  (cache-first app shell)
   Part of the ToolSmart suite by smartscott-LLC
   ============================================================ */

const CACHE = 'digital-luxe-v1';

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/app.css',
  '/js/app.js',
  '/js/catalog.js',
  '/js/canvas.js',
  '/js/nudge.js',
  '/js/smartbar.js',
  '/js/vault.js',
  '/js/utils.js',
  '/js/components.js',
  '/icons/icon.svg'
];

// ── Install: pre-cache app shell ──────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// ── Activate: clear stale caches ─────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: cache-first, network fallback ─────────────────────
self.addEventListener('fetch', e => {
  // Pass-through for non-GET and cross-origin
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) {
    // Network-first for external resources (Google Fonts, etc.)
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
      return cached || network;
    })
  );
});
