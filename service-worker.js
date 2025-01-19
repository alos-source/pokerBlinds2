self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('poker-blind-timer').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/app.js',
                './media/startsignal.mp3',
                './media/warning.mp3'
            ]);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
