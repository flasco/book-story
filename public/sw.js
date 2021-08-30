const SW_VERSION = '0.1.0';
const STATIC_CACHE_NAME = `static-cache-${SW_VERSION}`;
const DATA_CACHE_NAME = `data-cache-${SW_VERSION}`;

// 可以不同源
const FILES_TO_CACHE = ['./'];

self.addEventListener('install', e => {
  console.log(`[sw-${SW_VERSION}]: install`);
  e.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', () => {
  caches.keys().then(keys => {
    return Promise.all(
      keys.map(key => {
        if (![STATIC_CACHE_NAME, DATA_CACHE_NAME].includes(key)) {
          return caches.delete(key);
        }
      })
    );
  });
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('/v2/')) {
    e.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(e.request)
          .then(async res => {
            if (res.status === 200) {
              // keys的顺序按照insert的顺序排列，按顺序删即可
              // 控制缓存数量，保证静态资源的缓存可以长时间的保留
              const keys = await cache.keys();
              if (keys.length < 50) {
                cache.put(e.request.url, res.clone());
              } else {
                const deletedKeys = keys.slice(0, keys.length - 30);
                const workers = deletedKeys.map(k => cache.delete(k));
                // 确保删除操作完成，避免并发请求时的重复删除
                await Promise.all(workers);
              }
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
self.addEventListener('push', function (event) {
  const notificationData = event.data.json();
  const title = notificationData.title;
  event.waitUntil(self.registration.showNotification(title, notificationData));
});

// 监听notification事件
self.addEventListener('notificationclick', function (e) {
  const notification = e.notification;
  notification.close();
  e.waitUntil(clients.openWindow(notification.data.url));
});
