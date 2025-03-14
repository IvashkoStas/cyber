async function registerNewServiceWorker() {
  if ('serviceWorker' in navigator) {
    const register = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
  } else {
    console.log('Сервис-воркеры не поддерживаются в этом браузере.');
  }
}

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(async (registration) => {
        const success = await registration.unregister();
        console.log(success ? 'Старый сервис-воркер отключен.' :  'Не удалось отключить старый сервис-воркер.');
      }));
      // registerNewServiceWorker();
    } catch (error) {
      console.error('Ошибка при удалении сервис-воркеров:', error);
    }
  } else {
    console.log('Сервис-воркеры не поддерживаются в этом браузере.');
  }
}