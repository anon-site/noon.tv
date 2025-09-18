// ANON TV - Service Worker
// Version: 2.0.1
const CACHE_NAME = 'anon-tv-tv-ar-v2.0.1';
const STATIC_CACHE_NAME = 'anon-tv-tv-ar-static-v2.0.1';
const DYNAMIC_CACHE_NAME = 'anon-tv-tv-ar-dynamic-v2.0.1';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/TV-AR/',
    '/TV-AR/index.html',
    '/TV-AR/style.css',
    '/TV-AR/script.js',
    '/TV-AR/favicon.svg',
    '/TV-AR/site.webmanifest',
    '/TV-AR/channels.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap',
    'https://cdn.jsdelivr.net/npm/hls.js@latest'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('📦 Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('✅ Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Service Worker: Failed to cache static files', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activated successfully');
                return self.clients.claim();
            })
            .catch(error => {
                console.error('❌ Service Worker: Activation failed', error);
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                // Return cached version if available
                if (cachedResponse) {
                    console.log('📦 Service Worker: Serving from cache:', request.url);
                    return cachedResponse;
                }
                
                // Otherwise, fetch from network
                return fetch(request)
                    .then(response => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response
                        const responseToCache = response.clone();
                        
                        // Cache dynamic content
                        caches.open(DYNAMIC_CACHE_NAME)
                            .then(cache => {
                                // Only cache certain types of files
                                if (shouldCacheRequest(request)) {
                                    cache.put(request, responseToCache);
                                    console.log('💾 Service Worker: Cached dynamic content:', request.url);
                                }
                            });
                        
                        return response;
                    })
                    .catch(error => {
                        console.log('🌐 Service Worker: Network request failed:', request.url, error);
                        
                        // Return offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('/TV-AR/index.html');
                        }
                        
                        // Return a custom offline response for other requests
                        return new Response(
                            JSON.stringify({
                                error: 'Offline',
                                message: 'لا يمكن الوصول إلى هذا المحتوى حالياً. تحقق من اتصال الإنترنت.',
                                url: request.url
                            }),
                            {
                                status: 503,
                                statusText: 'Service Unavailable',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }
                        );
                    });
            })
    );
});

// Helper function to determine if request should be cached
function shouldCacheRequest(request) {
    const url = new URL(request.url);
    
    // Cache images, CSS, JS, and JSON files
    if (url.pathname.match(/\.(css|js|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
        return true;
    }
    
    // Cache API responses for channels
    if (url.pathname.includes('channels') || url.pathname.includes('api')) {
        return true;
    }
    
    // Don't cache video streams or external resources
    if (url.pathname.includes('.m3u8') || url.pathname.includes('.ts') || 
        url.hostname !== location.hostname) {
        return false;
    }
    
    return false;
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    console.log('🔄 Service Worker: Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync-channels') {
        event.waitUntil(
            syncChannelsData()
                .then(() => {
                    console.log('✅ Service Worker: Channels synced successfully');
                })
                .catch(error => {
                    console.error('❌ Service Worker: Sync failed', error);
                })
        );
    }
});

// Push notifications
self.addEventListener('push', event => {
    console.log('📱 Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'تحديث جديد متاح!',
        icon: '/TV-AR/icons/icon-192x192.png',
        badge: '/TV-AR/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'استكشاف',
                icon: '/TV-AR/icons/action-explore.png'
            },
            {
                action: 'close',
                title: 'إغلاق',
                icon: '/TV-AR/icons/action-close.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('ANON TV', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    console.log('🔔 Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/TV-AR/')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/TV-AR/')
        );
    }
});

// Helper function to sync channels data
async function syncChannelsData() {
    try {
        const response = await fetch('/TV-AR/channels.json');
        if (response.ok) {
            const data = await response.json();
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            await cache.put('/TV-AR/channels.json', response.clone());
            console.log('📡 Service Worker: Channels data synced');
        }
    } catch (error) {
        console.error('❌ Service Worker: Failed to sync channels data', error);
        throw error;
    }
}

// Message handler for communication with main thread
self.addEventListener('message', event => {
    console.log('💬 Service Worker: Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_NAME
        });
    }
    
    if (event.data && event.data.type === 'CACHE_CHANNELS') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE_NAME)
                .then(cache => {
                    return cache.put('/TV-AR/channels.json', new Response(JSON.stringify(event.data.channels)));
                })
                .then(() => {
                    event.ports[0].postMessage({ success: true });
                })
                .catch(error => {
                    event.ports[0].postMessage({ success: false, error: error.message });
                })
        );
    }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
    console.log('⏰ Service Worker: Periodic sync triggered:', event.tag);
    
    if (event.tag === 'channels-update') {
        event.waitUntil(
            syncChannelsData()
                .then(() => {
                    console.log('✅ Service Worker: Periodic channels sync completed');
                })
                .catch(error => {
                    console.error('❌ Service Worker: Periodic sync failed', error);
                })
        );
    }
});

console.log('🎯 Service Worker: Loaded successfully');
