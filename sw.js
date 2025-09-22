// Service Worker for background audio support
const CACHE_NAME = 'anon-tv-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/favicon.svg'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Background sync for audio
self.addEventListener('sync', event => {
    if (event.tag === 'background-audio') {
        event.waitUntil(
            // Keep audio playing in background
            console.log('Background audio sync triggered')
        );
    }
});

// Push notifications for audio control
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'ANON TV - تشغيل الصوت في الخلفية',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'play',
                title: 'تشغيل',
                icon: '/favicon.svg'
            },
            {
                action: 'pause',
                title: 'إيقاف',
                icon: '/favicon.svg'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('ANON TV', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'play') {
        // Send message to main thread to play audio
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({ action: 'play' });
            });
        });
    } else if (event.action === 'pause') {
        // Send message to main thread to pause audio
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({ action: 'pause' });
            });
        });
    } else {
        // Default action - open the app
        event.waitUntil(
            self.clients.openWindow('/')
        );
    }
});
