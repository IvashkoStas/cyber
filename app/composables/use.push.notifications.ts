const API_URL = 'http://localhost:3002/api';

export const usePushNotifications = () => {
  const isPushSupported = computed(() => 'serviceWorker' in navigator && 'PushManager' in window);

  async function getVapidPublicKey() {
    try {
      const { publicKey } = await $fetch<{ publicKey: string }>('/valid-key', {
        headers: {
          'Content-Type': 'application/json',
        },
        baseURL: API_URL,
      });

      return publicKey;
    } catch(error) {
      console.error('Error getting VAPID public key:', error);

      return null;
    }
  }

  const registerServiceWorker = async () => {
    try {
      console.log('before register');
      const registration = await navigator.serviceWorker.register('/pwa/sw.js', {
        type: 'module',
      });

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);

      return null;
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();

      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);

      return false;
    }
  };

  async function unsubscribeFromPush(registration: ServiceWorkerRegistration) {
    const subscription = await registration.pushManager.getSubscription();
  
    if (subscription) {
      await subscription.unsubscribe();
      console.log('Старая подписка удалена.');
    }
  }

  const subscribeToPush = async () => {
    try {
      const registration = await registerServiceWorker();
      console.log('registration: ', registration);
      if (!registration) {
        return null;
      }

      await unsubscribeFromPush(registration);

      const vapidPublicKey = await getVapidPublicKey();
      console.log('vapidPublicKey: ', vapidPublicKey);
      if (!vapidPublicKey) {
        return null;
      }
      console.log('before subscribe: ', registration.pushManager);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      });

      console.log('subscription: ', subscription);

      // Отправляем подписку на сервер
      await $fetch('/subscribe', {
        method: 'POST',
        baseURL: API_URL,
        body: subscription,
      });

      return subscription;
    } catch (error) {
      console.error('Error subscribing to push:', error);

      return null;
    }
  };

  return {
    isPushSupported,
    requestNotificationPermission,
    subscribeToPush,
  };
};