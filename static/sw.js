const SW_VERSION = '0.0.1';
const STATIC_CACHE_NAME = `static-cache-${SW_VERSION}`;
const DATA_CACHE_NAME = `data-cache-${SW_VERSION}`;

// 可以不同源
const FILES_TO_CACHE = ['/', '/js/bundle.js'];

self.addEventListener('install', e => {
  console.log(`[sw-${SW_VERSION}]: install`);
  e.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );

  // self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  // 获取所有不同于当前版本名称cache下的内容，删除
  e.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheNames => cacheNames !== cacheStorageKey)
            .map(cacheNames => caches.delete(cacheNames))
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', e => {
  console.log('fetch:', e.request.url);
  if (e.request.url.includes('/api/')) {
    e.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(e.request)
          .then(res => {
            if (res.status === 200) {
              cache.put(e.request.url, res.clone());
            }
            return res;
          })
          .catch(() => {
            return cache.match(e.request);
          });
      })
    );
  } else {
    e.respondWith(
      caches.open(STATIC_CACHE_NAME).then(cache => {
        return fetch(e.request)
          .then(res => {
            if (res.status === 200) {
              cache.put(e.request.url, res.clone());
            }
            return res;
          })
          .catch(() => {
            return cache.match(e.request);
          });
      })
    );
  }
});

// 监听push消息
self.addEventListener('push', function(event) {
  const notificationData = event.data.json();
  const title = notificationData.title;
  event.waitUntil(self.registration.showNotification(title, notificationData));
});

// 监听notification事件
self.addEventListener('notificationclick', function(e) {
  const notification = e.notification;
  notification.close();
  e.waitUntil(clients.openWindow(notification.data.url));
});
