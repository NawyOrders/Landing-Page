const CACHE_VERSION = 'v1';
const STATIC_CACHE = `nawy-static-${CACHE_VERSION}`;
const PAGE_CACHE = `nawy-pages-${CACHE_VERSION}`;
const IMAGE_CACHE = `nawy-images-${CACHE_VERSION}`;
const CACHE_PREFIX = 'nawy-';
const OFFLINE_URL = '/offline.html';

const PRECACHE = [
  '/',
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
];

const KEEP_CACHES = new Set([STATIC_CACHE, PAGE_CACHE, IMAGE_CACHE]);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      Promise.allSettled(
        PRECACHE.map((url) =>
          cache.add(new Request(new URL(url, self.location.origin), { cache: 'reload' })),
        ),
      ),
    ),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && !KEEP_CACHES.has(key))
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

function isCacheable(response) {
  const cacheControl = response.headers.get('Cache-Control') || '';
  return (
    response.ok &&
    response.type === 'basic' &&
    !cacheControl.includes('no-store') &&
    !cacheControl.includes('private')
  );
}

async function handleNavigation(event) {
  const pageCache = await caches.open(PAGE_CACHE);

  try {
    const preloaded = await event.preloadResponse;
    const response = preloaded || (await fetch(event.request));

    if (isCacheable(response) && new URL(event.request.url).pathname === '/') {
      await pageCache.put('/', response.clone());
    }

    return response;
  } catch {
    return (
      (await pageCache.match(event.request)) ||
      (await pageCache.match('/')) ||
      (await caches.match('/')) ||
      (await caches.match(OFFLINE_URL)) ||
      Response.error()
    );
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (isCacheable(response)) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return Response.error();
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (isCacheable(response)) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (await cache.match(request)) || Response.error();
  }
}

async function staleWhileRevalidate(event, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(event.request);
  const network = fetch(event.request)
    .then(async (response) => {
      if (isCacheable(response)) {
        await cache.put(event.request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  event.waitUntil(network);
  return cached || (await network) || Response.error();
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || request.headers.has('range')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/data/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(event));
    return;
  }

  if (url.pathname === '/manifest.webmanifest') {
    event.respondWith(networkFirst(request, STATIC_CACHE));
    return;
  }

  if (url.pathname.startsWith('/images/')) {
    event.respondWith(staleWhileRevalidate(event, IMAGE_CACHE));
    return;
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/icon.svg' ||
    url.pathname === '/offline.html' ||
    url.pathname === '/favicon.ico'
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  }
});
