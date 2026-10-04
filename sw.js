const CACHE_NAME = 'pwa-offline-v1';
// Liste aqui todos os arquivos essenciais para sua página funcionar offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './favicon.png',
  './manifest.json',
  './beer.min.css',
  './beer.min.js',
  './material-dynamic-colors.min.js',
  './material-symbols-outlined.woff2',
];

// Instalação: armazena os arquivos no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação: limpa caches antigos se houver atualizações
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação: serve os arquivos do cache primeiro, recorrendo à rede se necessário
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Fallback opcional para páginas HTML caso esteja offline e o recurso exato não esteja no cache
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
