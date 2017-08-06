'use strict';

const log = console.log.bind(console); //bind our console to a variable
const version = '0.0.1';
const cacheName = 'sw-aduh95';
const cache = cacheName + '-' + version;

//Add event listener for fetch
self.addEventListener('fetch', function(event) {
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

self.addEventListener('activate', function(event) {
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
            .then(() => log('Old cache removed'))
    );
});
