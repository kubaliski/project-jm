import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import {
    NetworkFirst,
    CacheFirst,
    StaleWhileRevalidate,
    NetworkOnly
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Precaching de archivos estáticos
precacheAndRoute(self.__WB_MANIFEST);

// Cachear imágenes optimizadas y storage
registerRoute(
    ({ request, url }) => {
        return request.destination === 'image' ||
               url.pathname.startsWith('/storage/');
    },
    new CacheFirst({
        cacheName: 'images-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200]
            }),
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 días
            })
        ]
    })
);

// Rutas de API públicas
registerRoute(
    ({ url }) => {
        const publicPaths = [
            '/api/public/app-info',
            '/api/public/banner/active',
            '/api/public/posts',
            '/api/public/contacts'
        ];
        return publicPaths.some(path => url.pathname.startsWith(path));
    },
    new StaleWhileRevalidate({
        cacheName: 'public-api-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200]
            }),
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1 hora
            })
        ]
    })
);

// Rutas de API autenticadas
registerRoute(
    ({ url }) => {
        return url.pathname.startsWith('/api/') &&
               !url.pathname.startsWith('/api/public/');
    },
    new NetworkFirst({
        cacheName: 'auth-api-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200]
            }),
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutos
            })
        ]
    })
);

// Rutas de autenticación (siempre red)
registerRoute(
    ({ url }) => {
        const authPaths = [
            '/api/login',
            '/api/logout',
            '/api/user',
            '/api/forgot-password',
            '/api/reset-password'
        ];
        return authPaths.some(path => url.pathname === path);
    },
    new NetworkOnly()
);

// Assets estáticos
registerRoute(
    ({ request }) =>
        request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'font',
    new StaleWhileRevalidate({
        cacheName: 'static-resources',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200]
            }),
            new ExpirationPlugin({
                maxEntries: 60,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 días
            })
        ]
    })
);

// Estado offline
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('offline-fallbacks').then((cache) => {
            return cache.add('/offline.html');
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate' && !navigator.onLine) {
        event.respondWith(
            caches.match('/offline.html')
                .then((response) => {
                    return response || new Response(
                        '<html><body><h1>Offline</h1><p>No hay conexión a internet.</p></body></html>',
                        {
                            headers: { 'Content-Type': 'text/html' }
                        }
                    );
                })
        );
    }
});