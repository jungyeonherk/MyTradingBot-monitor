// JST Mobile Service Worker
const CACHE = "jst-mobile-v1";
const SHELL = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // state.json 은 항상 네트워크 우선 (실시간 데이터)
  if (url.pathname.endsWith("state.json") || url.hostname.includes("raw.githubusercontent.com")) {
    return;  // 기본 fetch 동작
  }
  // 그 외는 캐시 우선
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
