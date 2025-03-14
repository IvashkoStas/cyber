importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

const APP_VERSION = '0.1.3';
const CRYPTO_PAY_BOT = 'cryptopaybot.com';
const isCryptoPayBot = self?.location?.hostname?.includes(CRYPTO_PAY_BOT);

const config = isCryptoPayBot ? {
  apiKey: "AIzaSyDuPevsbcw66Y2qewjJ5gK3VmDkqnxV_JA",
  authDomain: "cyber-pay-prod.firebaseapp.com",
  projectId: "cyber-pay-prod",
  storageBucket: "cyber-pay-prod.firebasestorage.app",
  messagingSenderId: "1033347062642",
  appId: "1:1033347062642:web:fb06a6e447ef288c71dbeb",
  measurementId: "G-XCE4S9D9SQ"
} : {
  apiKey: "AIzaSyAVDeaMARJSC4smML4xSViZ9j3eWysLfPM",
  authDomain: "cyber-pay-dev.firebaseapp.com",
  projectId: "cyber-pay-dev",
  storageBucket: "cyber-pay-dev.firebasestorage.app",
  messagingSenderId: "891978661856",
  appId: "1:891978661856:web:9d50ecda6af1118ebb3585",
  measurementId: "G-RQJXQJLM9H"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

self.addEventListener('install', (event) => {
  console.log('Installing new service worker version:', APP_VERSION);
  event.waitUntil(handleInstall());
});

self.addEventListener('activate', (event) => {
  console.log('Activating new service worker version:', APP_VERSION);
  event.waitUntil(handleActivate());
});

messaging.onBackgroundMessage((payload) => {
  console.log('[fcm-sw.js] Received background message:', payload);
  // const [notificationTitle, ...notificationBody] = (payload.notification?.body ?? []).split('\n');
  // const notificationTitle = 'CyberPay';
  const notificationOptions = {
    body: payload.notification?.body || 'У вас новое сообщение',
    icon: 'https://publ.life//icons/manifest/icon192.webp',
    badge: 'https://publ.life//icons/manifest/icon64.webp',
    vibrate: [200, 100, 200],
  };

  return self.registration.showNotification('', notificationOptions);
});

self.addEventListener('push', (event) => {
  const payload = event.data.json();
  console.log('[push]:', payload);
});

self.addEventListener('notificationclick', (event) => {
  console.log('[fcm-sw.js] Notification clicked:', event.notification);

  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        const client = clientList[0];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(urlToOpen);
    })
  );
});

async function handleInstall() {
  await self.skipWaiting();
}

async function handleActivate() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));
  await self.clients.claim();
}