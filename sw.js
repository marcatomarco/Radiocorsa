/* Radio Corsa — service worker
   Obiettivo: la app si apre e funziona anche senza rete.
   - i file della app vengono messi in cache all'installazione
   - font e pdf.js dal CDN vengono messi in cache al primo caricamento online
   - le chiamate a Deepgram non passano mai di qui (sono WebSocket) */

const VERSION = 'radiocorsa-v3';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => Promise.allSettled(CORE.map(u => c.add(new Request(u, {cache:'reload'})))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // navigazione: prima la rete, se non c'è si apre la copia salvata
  if (req.mode === 'navigate'){
    e.respondWith(
      fetch(req)
        .then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put('./index.html', c)); return r; })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // tutto il resto (app, font, pdf.js): prima la cache, poi la rete che riempie la cache
  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(r => {
        if (r && (r.ok || r.type === 'opaque')){
          const c = r.clone();
          caches.open(VERSION).then(x => x.put(req, c)).catch(()=>{});
        }
        return r;
      }).catch(() => hit);
    })
  );
});
