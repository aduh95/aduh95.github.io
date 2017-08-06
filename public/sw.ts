/// <reference path="../node_modules/@types/service_worker_api/index.d.ts" />

'use strict';

const version = '0.0.3';
const cacheName = 'sw-aduh95';
const cache = cacheName + '-' + version;

self.addEventListener('install', function(event: ExtendableEvent) {
    event.waitUntil(self.skipWaiting());
});

//Add event listener for fetch
self.addEventListener('fetch', function(event: FetchEvent) {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
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
            .then(() => self.clients.claim())
    );
});
