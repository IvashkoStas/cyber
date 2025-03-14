import { Keys } from '~/constants/keys';

export default function ({ options }: FetchCTX) {
  const { user } = useUser();
  const token = useCookie(Keys.TOKEN);
  const { getXTgInitData } = useShared();

  const X_TG_INIT_DATA = getXTgInitData();

  const locale = user.value?.languageCode ?? navigator.language.split('-')?.at(0) ?? 'en';

  options.headers.set(Keys.LOCALE,  locale);

  if (token.value) {
    options.headers.set('Authorization', `Bearer ${token.value}`);
  }

  if (!window?.Telegram?.WebApp.initData?.length) {
    options.headers.set('X-WEB-APP', '1');
  }

  if (X_TG_INIT_DATA.length) {
    options.headers.set('X-TG-INIT-DATA', X_TG_INIT_DATA);
  }
}