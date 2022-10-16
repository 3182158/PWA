const pwaDev = "pwa-v1.1";
const assets = ["/",
"bundle.js",
"img/cross.png",
"img/delete.png",
"img/icon.png",
"img/logo.svg",
"img/tick.png",
"util.js",
"index.html",
];


self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(pwaDev).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});
