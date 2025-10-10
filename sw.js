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

// Fetch event with CORS proxy support
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Check if this is a SHLS stream request
    if (url.hostname.includes('shls-live-enc.edgenextcdn.net') || 
        url.hostname.includes('edgenextcdn.net')) {
        
        event.respondWith(
            fetch(event.request.url, {
                method: event.request.method,
                headers: {
                    'Accept': 'application/vnd.apple.mpegurl, application/x-mpegurl, */*',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://www.google.com/',
                    'Origin': 'https://www.google.com'
                },
                mode: 'cors',
                credentials: 'omit',
                redirect: 'follow'
            })
            .then(response => {
                // Clone the response and add CORS headers
                const newHeaders = new Headers(response.headers);
                newHeaders.set('Access-Control-Allow-Origin', '*');
                newHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
                newHeaders.set('Access-Control-Allow-Headers', '*');
                
                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders
                });
            })
            .catch(error => {
                console.error('Service Worker fetch error for SHLS:', error);
                // Return a minimal error response
                return new Response('', { status: 500 });
            })
        );
        return;
    }
    
    // Default caching strategy for other requests
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
        body: event.data ? event.data.text() : 'NOON TV - تشغيل الصوت في الخلفية',
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
        self.registration.showNotification('NOON TV', options)
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
