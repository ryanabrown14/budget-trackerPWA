const APP_PREFIX = "budgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/idb.js",
    "./js/index.js"
  ];

self.addEventListener("install", function(event){
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            console.log('installing cache:' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE);
        })
    )
});

self.addEventListener("activate", function(event){
    event.waitUntil(
        caches.keys().then(function(keylist){
            let cacheKeep = keylist.filter(function(key){
                return key.indexOf(APP_PREFIX)
            });
            cacheKeep.push(CACHE_NAME);

            return Promise.all(
                keylist.map(function(key, i){
                    if (cacheKeep.indexOf(key)=== -1){
                        console.log('deleting cache: ' + keylist[i]);
                        return caches.delete(keylist[i]);
                    }

                })
            )
        })
    )
});

self.addEventListener("fetch", function (event) {
    console.log(`Fetch request: ${event.request.url}`);
    event.respondWith(
      caches
        .match(event.request)
        .then(function (request) {
          return request || fetch(event.request);
        })
        .catch(function () {
          return caches.match("index.html");
        })
    );
});