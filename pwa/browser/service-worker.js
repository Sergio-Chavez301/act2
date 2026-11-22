const CACHE_NAME = "boticaria-browser-v1";
const APP_SHELL = [
    "./",
    "./index.html",
    "./offline.html",
    "./manifest.json",
    "./css/estilos.css",
    "./js/app.js",
    "./img/logo.webp",
    "./img/maomao.webp",
    "./img/maomao2.jpg",
    "./img/Jinshi.webp",
    "./img/Gaoshun.jpg",
    "./img/icons/icon-192.png",
    "./img/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((names) => Promise.all(
                names
                    .filter((name) => name.startsWith("boticaria-browser-") && name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    if (request.method !== "GET") return;

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(async () => (
                    await caches.match(request) ||
                    await caches.match("./index.html") ||
                    await caches.match("./offline.html")
                ))
        );
        return;
    }

    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;

            return fetch(request).then((response) => {
                if (response.ok || response.type === "opaque") {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                }
                return response;
            });
        })
    );
});
