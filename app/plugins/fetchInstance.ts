import { Keys } from '~/constants/keys';


export default defineNuxtPlugin(() => {
  const { baseUrl } = useRuntimeConfig().public;
  const token = useCookie(Keys.TOKEN);
  const { getXTgInitData } = useShared();

  const X_TG_INIT_DATA = getXTgInitData();

  const headers = {
    ...(X_TG_INIT_DATA.length ? { 'X-TG-INIT-DATA': X_TG_INIT_DATA } : {}),
    ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    ...(!window?.Telegram?.WebApp.initData?.length ? { 'X-WEB-APP': '1' } : {}),
  };

  const fetchInstance = $fetch.create({
    baseURL: baseUrl,
    headers,
    onRequest: onRequest,
    cache: 'no-cache',
  });

  return {
    provide: {
      fetchInstance,
    },
  };
});
