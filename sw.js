// Service Worker for background audio support and performance optimization
const CACHE_NAME = 'anon-tv-v2.0';
const STATIC_CACHE = 'static-v2.0';
const DYNAMIC_CACHE = 'dynamic-v2.0';
const FONTS_CACHE = 'fonts-v2.0';

const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/performance-optimizer.js',
    '/favicon.svg'
];

// تحديد الموارد التي يجب تخزينها مؤقتاً
const CACHEABLE_EXTENSIONS = ['.css', '.js', '.svg', '.woff2', '.woff'];
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Install event - تحسين التخزين المؤقت
self.addEventListener('install', event => {
    console.log('[SW] Installing Service Worker v2.0');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - تنظيف الكاش القديم
self.addEventListener('activate', event => {
    console.log('[SW] Activating Service Worker v2.0');
    const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, FONTS_CACHE];
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!currentCaches.includes(cacheName)) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
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
    
    // استراتيجية التخزين المؤقت المحسّنة
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // إذا كان موجوداً في الكاش، أرجعه
                if (cachedResponse) {
                    // تحقق من عمر الكاش
                    const cacheDate = new Date(cachedResponse.headers.get('date'));
                    const now = new Date();
                    const age = now - cacheDate;
                    
                    if (age < MAX_CACHE_AGE) {
                        return cachedResponse;
                    }
                }
                
                // جلب من الشبكة
                return fetch(event.request)
                    .then(networkResponse => {
                        // تخزين الاستجابة الجديدة
                        if (shouldCache(event.request)) {
                            const responseToCache = networkResponse.clone();
                            caches.open(getDynamicCacheName(event.request))
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // إذا فشل، أرجع من الكاش حتى لو قديم
                        return cachedResponse || new Response('Offline', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});

// دالة لتحديد ما إذا كان يجب تخزين الطلب
function shouldCache(request) {
    const url = new URL(request.url);
    return CACHEABLE_EXTENSIONS.some(ext => url.pathname.endsWith(ext));
}

// دالة لتحديد اسم الكاش الديناميكي
function getDynamicCacheName(request) {
    const url = new URL(request.url);
    
    // الخطوط في كاش منفصل
    if (url.pathname.includes('fonts') || url.pathname.endsWith('.woff2') || url.pathname.endsWith('.woff')) {
        return FONTS_CACHE;
    }
    
    return DYNAMIC_CACHE;
}

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
