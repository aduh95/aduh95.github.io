var serviceWorker: ServiceWorkerGlobalScope = <any>self;

const version = "0.0.4";
const cacheName = "sw-aduh95";
const cache = cacheName + "-" + version;

serviceWorker.addEventListener("install", function(event: ExtendableEvent) {
  event.waitUntil(serviceWorker.skipWaiting());
});

//Add event listener for fetch
serviceWorker.addEventListener("fetch", function(event: FetchEvent) {
  event.respondWith(
    fetch(event.request).catch(
      () => caches.match(event.request) as Promise<Response>
    )
  );
});

serviceWorker.addEventListener("activate", function(event: ExtendableEvent) {
  event.waitUntil(
    caches
      .keys() //it will return all the keys in the cache as an array
      .then((keyList: Array<string>) =>
        //run everything in parallel using Promise.all()
        Promise.all(
          keyList.map(key =>
            key !== cacheName ? caches.delete(key) : undefined
          )
        )
      )
      .then(() => serviceWorker.clients.claim())
  );
});
