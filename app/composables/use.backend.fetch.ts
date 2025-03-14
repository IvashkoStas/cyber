import { Keys } from '~/constants/keys';

export default function <T> (...args: Parameters<typeof useFetch<T>>) {
  const { baseUrl } = useRuntimeConfig().public;
  const token = useCookie(Keys.TOKEN);
  const { getXTgInitData } = useShared();

  const X_TG_INIT_DATA = getXTgInitData();

  const [url, options] = args;

  const headers = {
    ...options?.headers,
    ...(X_TG_INIT_DATA.length ? { 'X-TG-INIT-DATA': X_TG_INIT_DATA } : {}),
    ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    ...(!window?.Telegram?.WebApp.initData?.length ? { 'X-WEB-APP': '1' } : {}),
  };


  const defaultOPtions = {
    ...options,
    baseURL: options?.baseURL ?? baseUrl,
    server: false,
    cache: options?.cache ?? 'no-cache',
    headers,
    onRequest: onRequest,
  };

  return useFetch<T>(url, defaultOPtions);
}