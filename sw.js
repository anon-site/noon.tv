// Service Worker for ANON TV
const CACHE_NAME = 'anon-tv-v2.0.1';
const STATIC_CACHE_NAME = 'anon-tv-static-v2.0.1';

// Files to cache
const STATIC_FILES = [
    '/TV-AR/',
    '/TV-AR/index.html',
    '/TV-AR/style.css',
    '/TV-AR/script.js',
    '/TV-AR/favicon.svg',
    '/TV-AR/site.webmanifest',
    '/TV-AR/iptv-checker.html'
];

// Dynamic cache patterns
const CACHE_PATTERNS = [
    /^https:\/\/cdnjs\.cloudflare\.com\//,
    /^https:\/\/fonts\.googleapis\.com\//,
    /^https:\/\/fonts\.gstatic\.com\//,
    /^https:\/\/cdn\.jsdelivr\.net\//
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activated successfully');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip Chrome extension requests
    if (url.protocol === 'chrome-extension:') {
        return;
    }
    
    // Handle different types of requests
    if (STATIC_FILES.some(file => request.url.includes(file))) {
        // Static files - cache first
        event.respondWith(handleStaticFiles(request));
    } else if (CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
        // External resources - cache with fallback
        event.respondWith(handleExternalResources(request));
    } else if (request.url.includes('channels.json')) {
        // Dynamic content - network first
        event.respondWith(handleDynamicContent(request));
    } else {
        // Default - network first with cache fallback
        event.respondWith(handleDefault(request));
    }
});

// Handle static files (cache first)
async function handleStaticFiles(request) {
    try {
        const cache = await caches.open(STATIC_CACHE_NAME);
        const cached = await cache.match(request);
        
        if (cached) {
            console.log('Service Worker: Serving from static cache:', request.url);
            return cached;
        }
        
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('Service Worker: Error handling static file:', error);
        return new Response('Service Unavailable', { status: 503 });
    }
}

// Handle external resources (cache with fallback)
async function handleExternalResources(request) {
    try {
        const cache = await caches.open(CACHE_NAME);
        
        // Try network first for fresh content
        try {
            const response = await fetch(request, { 
                mode: 'cors',
                credentials: 'omit'
            });
            
            if (response.ok) {
                cache.put(request, response.clone());
                return response;
            }
        } catch (networkError) {
            console.log('Service Worker: Network failed, trying cache:', request.url);
        }
        
        // Fallback to cache
        const cached = await cache.match(request);
        if (cached) {
            console.log('Service Worker: Serving from cache:', request.url);
            return cached;
        }
        
        throw new Error('No cache available');
    } catch (error) {
        console.error('Service Worker: Error handling external resource:', error);
        return new Response('Resource Unavailable', { status: 503 });
    }
}

// Handle dynamic content (network first)
async function handleDynamicContent(request) {
    try {
        // Always try network first for dynamic content
        const response = await fetch(request);
        
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
            console.log('Service Worker: Updated cache for dynamic content:', request.url);
        }
        
        return response;
    } catch (error) {
        console.log('Service Worker: Network failed for dynamic content, trying cache:', request.url);
        
        // Fallback to cache
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        
        if (cached) {
            console.log('Service Worker: Serving dynamic content from cache:', request.url);
            return cached;
        }
        
        console.error('Service Worker: No cache available for dynamic content:', error);
        return new Response('Content Unavailable', { status: 503 });
    }
}

// Handle default requests (network first with cache fallback)
async function handleDefault(request) {
    try {
        const response = await fetch(request);
        
        if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        
        return response;
    } catch (error) {
        console.log('Service Worker: Network failed, trying cache:', request.url);
        
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        
        if (cached) {
            console.log('Service Worker: Serving from cache:', request.url);
            return cached;
        }
        
        console.error('Service Worker: No cache available:', error);
        return new Response('Service Unavailable', { status: 503 });
    }
}

// Handle background sync
self.addEventListener('sync', event => {
    console.log('Service Worker: Background sync triggered:', event.tag);
    
    if (event.tag === 'sync-channels') {
        event.waitUntil(syncChannels());
    }
});

// Sync channels in background
async function syncChannels() {
    try {
        console.log('Service Worker: Syncing channels in background...');
        
        // Get the main client
        const clients = await self.clients.matchAll();
        if (clients.length > 0) {
            // Send message to main app to sync
            clients[0].postMessage({
                type: 'SYNC_CHANNELS',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Service Worker: Error syncing channels:', error);
    }
}

// Handle messages from main app
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
        case 'CLEAR_CACHE':
            clearAllCaches();
            break;
        case 'UPDATE_CACHE':
            updateCache(data);
            break;
        default:
            console.log('Service Worker: Unknown message type:', type);
    }
});

// Clear all caches
async function clearAllCaches() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log('Service Worker: All caches cleared');
    } catch (error) {
        console.error('Service Worker: Error clearing caches:', error);
    }
}

// Update specific cache
async function updateCache(data) {
    try {
        const cache = await caches.open(CACHE_NAME);
        if (data.url && data.response) {
            await cache.put(data.url, new Response(data.response));
            console.log('Service Worker: Cache updated for:', data.url);
        }
    } catch (error) {
        console.error('Service Worker: Error updating cache:', error);
    }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
    console.log('Service Worker: Periodic sync triggered:', event.tag);
    
    if (event.tag === 'channels-sync') {
        event.waitUntil(syncChannels());
    }
});

console.log('Service Worker: Loaded successfully - Version 2.0.1');
