// Service Worker for Emergency Checklists
const CACHE_NAME = 'emergency-checklists-v1';
const urlsToCache = [
    '/checklists/pdf-viewer/mobile.html',
    '/checklists/pdf-viewer/viewer.html',
    '/checklists/pdf-viewer/manifest.json',
    '/images/logos/prism-logo-1000.png',
    '/checklists/assets/pdfs/fire-damage-first-48-hours.html',
    '/checklists/assets/pdfs/water-emergency-save-what-matters.html',
    '/checklists/assets/pdfs/lightning-strike-power-surge.html',
    '/checklists/assets/pdfs/smoke-damage-air-quality.html',
    '/checklists/assets/pdfs/storm-damage-structure-assessment.html'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.log('Cache install failed:', err);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }

                // Clone the request because it's a stream
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(response => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response because it's a stream
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }).catch(() => {
                    // If fetch fails, try to serve from cache
                    return caches.match('/checklists/pdf-viewer/mobile.html');
                });
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync-user-data') {
        event.waitUntil(syncUserData());
    }
});

async function syncUserData() {
    try {
        // Get stored user data from IndexedDB or localStorage
        const userData = await getStoredUserData();

        if (userData.length > 0) {
            for (const user of userData) {
                try {
                    await fetch('/api/sync-user-data', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(user)
                    });

                    // Remove from local storage after successful sync
                    await removeUserData(user.id);
                } catch (error) {
                    console.log('Failed to sync user data:', error);
                }
            }
        }
    } catch (error) {
        console.log('Background sync failed:', error);
    }
}

function getStoredUserData() {
    return new Promise((resolve) => {
        const userData = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('mobileUser_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    data.id = key;
                    userData.push(data);
                } catch (error) {
                    console.log('Error parsing user data:', error);
                }
            }
        }
        resolve(userData);
    });
}

function removeUserData(id) {
    return new Promise((resolve) => {
        localStorage.removeItem(id);
        resolve();
    });
}