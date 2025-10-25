// sw.js - Service Worker para ITSaBOT PWA
const CACHE_NAME = 'itsabot-v1.0.0';
const STATIC_CACHE = 'itsabot-static-v1';
const DYNAMIC_CACHE = 'itsabot-dynamic-v1';

// Archivos estáticos para cache
const STATIC_FILES = [
  '/',
  '/login.html',
  '/menu.html',
  '/chat.html',
  '/tramites.html',
  '/calendario.html',
  '/info.html',
  '/perfil.html',
  '/extra/certificado.html',
  '/extra/constancia.html',
  '/extra/inscripcion.html',
  '/extra/reinscripcion.html',
  '/css/estilo.css',
  '/css/tramites-style.css',
  '/css/certificado-style.css',
  '/css/constancia-native-style.css',
  '/css/inscripcion-style.css',
  '/css/reinscripcion-style.css',
  '/js/chatbot.js',
  '/js/animations.js',
  '/js/mobile-menu.js',
  '/js/pwa-install.js',
  '/img/logo.png',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/manifest.json'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Instalando...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Service Worker: Cacheando archivos estáticos');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('✅ Service Worker: Instalación completada');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Service Worker: Error en instalación', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Activando...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Service Worker: Eliminando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activación completada');
        return self.clients.claim();
      })
  );
});

// Interceptación de requests
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo interceptar requests del mismo origen
  if (url.origin !== location.origin) {
    return;
  }

  // Estrategia: Cache First para archivos estáticos, Network First para HTML
  if (request.destination === 'document') {
    // Para páginas HTML: Network First
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(response => {
              if (response) {
                return response;
              }
              // Fallback a la página principal si no hay cache
              return caches.match('/login.html');
            });
        })
    );
  } else {
    // Para otros recursos: Cache First
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then(fetchResponse => {
              if (fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                caches.open(DYNAMIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
              }
              return fetchResponse;
            });
        })
    );
  }
});

// Manejo de mensajes del cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notificaciones push (para futuras implementaciones)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/img/icon-192.png',
      badge: '/img/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Ver detalles',
          icon: '/img/icon-192.png'
        },
        {
          action: 'close',
          title: 'Cerrar',
          icon: '/img/icon-192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/menu.html')
    );
  }
});