/// <reference path="../node_modules/@types/service_worker_api/index.d.ts" />

'use strict';

const version = '0.0.1';
const cacheName = 'sw-aduh95';
const cache = cacheName + '-' + version;

//Add event listener for fetch
self.addEventListener('fetch', function(event: FetchEvent) {
    event.respondWith(
        caches.open(cache).then(cache =>
            cache.match(event.request).then(
                response =>
                    response ||
                    fetch(event.request).then(function(response) {
                        cache.put(event.request, response.clone());
                        return response;
                    })
            )
        )
    );
});

self.addEventListener('activate', function(event: ExtendableEvent) {
    event.waitUntil(
        caches
            .keys() //it will return all the keys in the cache as an array
            .then(keyList =>
                //run everything in parallel using Promise.all()
                Promise.all(
                    keyList.map(
                        key =>
                            key !== cacheName ? caches.delete(key) : undefined
                    )
                )
            )
    );
});
