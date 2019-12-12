const cacheVersion = 21;

const expectedCaches = [
    `vanilla-sw-static-${cacheVersion}`,
    `vanilla-sw-cats-data`,
    `vanilla-sw-cats-images`,
];

const scope = '/';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(`vanilla-sw-static-${cacheVersion}`).then(cache => {
            cache.addAll([
                `${scope}`,
                `${scope}main.js`,
                `${scope}manifest.json`,
                `${scope}icons/icon_24.png`,
                `${scope}icons/icon_32.png`,
                `${scope}icons/icon_64.png`,
                `${scope}icons/icon_128.png`,
                `${scope}icons/icon_256.png`,
                `${scope}icons/icon_512.png`,
            ]);
        })
    )
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!/^vanilla-sw/.test(cacheName)) return;

                    if (expectedCaches.indexOf(cacheName) == -1) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (url.hostname === 'api.thecatapi.com') {
        event.respondWith(handleCatsData(event.request));
    } else if( url.hostname === 'cdn2.thecatapi.com') {
        event.respondWith(handleCatsImages(event.request));
    } else {
        event.respondWith(
            caches.match(event.request)
        )
    }
});

function handleCatsData(request) {
    return fetch(request.clone()).then(response => {
        return caches.open('vanilla-sw-cats-data').then(cache => {
            Promise.all([
                response.clone().json(),
                caches.open('vanilla-sw-cats-images'),
            ]).then(results => {
                const data = results[0];
                const catsImageCache = results[1];

                const imageUrls = data.map(d => d.url);

                catsImageCache.keys().then(requests => {
                    requests.forEach(request => {
                        if (imageUrls.indexOf(request.url) == -1) {
                            catsImageCache.delete(request);
                        }
                    })
                })
            })

            cache.put(request, response.clone()).then(d => {
                console.log('cats data cached');
            }).catch(error => {
                console.log(`error caching cats data ${error}`);
            });

            return response;
        });
    }).catch(() => {
        return caches.match(request.clone()).then(response => {
            return response;
        });
    })
}

function handleCatsImages(request) {
    return caches.match(request).then(response => {
        if (response) {
            return response;
        }

        return fetch(request.clone()).then(response => {
            caches.open('vanilla-sw-cats-images').then(cache => {
                cache.put(request, response).then(() => {
                    console.log('cats image added to cache');
                }).catch(error => {
                    console.log(`cats image cache error ${error}`);
                })
            })

            return response.clone();
        })
    })
}
