<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useWebApp } from 'vue-tg';
import { AppRoutes, AppRoutesNames } from '~/constants/app.route';
import { Keys } from '~/constants/keys';

const { initData } = useWebApp();
const { locale } = useI18n();
const route = useRoute();
const { user, getUser } = useUser();
const { getSetting } = useSetting();
const { getPromoCode } = usePromoCode();
const { getReferral } = useReferral();
const { initConverter } = useCurrencyConverter();
const { checkHealth } = useShared();
const loading = shallowRef(false);
const token = useCookie(Keys.TOKEN);
const xTgToken = useCookie<string>(Keys.X_TG_TOKEN);

await useAsyncData('init', async () => {
  try {
/*     if (!window?.Telegram?.WebApp.initData?.length) {
      return await navigateTo(AppRoutes.AUTH);
    } */

    document.body.classList.add('stop-scroll');
    await checkHealth();
    initConverter();

    if (!initData.length && !token.value?.length && !xTgToken.value?.length) {
      if (route.name === AppRoutesNames.REGISTER) {
        return;
      }

      return await navigateTo(AppRoutes.AUTH);
    }

    const data = await Promise.all([
      getUser(),
      getSetting(),
      getReferral(),
      getPromoCode(),
    ]);

    return data;
  } finally {
    const timeout = setTimeout(() => {
      loading.value = true;
      document.body.classList.remove('stop-scroll');
      clearTimeout(timeout);
    }, 1000);
  }
});

onMounted(async () => {
  // window?.Telegram?.WebApp.requestFullscreen?.();

  console.table({
    initData: initData,
    token: token.value,
    xTgToken: xTgToken.value,
  });

  if (!initData.length) {
    await registerServiceWorker();
    document.documentElement.style.setProperty('--tg-viewport-height', '100dvh');
    document.documentElement.style.setProperty('--tg-viewport-stable-height', '100dvh');
  }

  window?.Telegram?.WebApp.expand?.();
  window?.Telegram?.WebApp?.setBackgroundColor?.('#100F10');
  // window?.Telegram?.WebApp.enableClosingConfirmation?.();
  window?.Telegram?.WebApp.lockOrientation?.();

  fullscreenChangedHandler();
  window.Telegram?.WebApp.onEvent('fullscreenChanged', fullscreenChangedHandler);
});


onBeforeUnmount(() => {
  window?.Telegram?.WebApp.offEvent('fullscreenChanged', fullscreenChangedHandler);
});

watch(() => user.value?.languageCode, (code) => {
  if (code) {
    locale.value = code;
  }
}, { immediate: true });

watch(() => route.name, (name) => {
  if ([AppRoutesNames.WALLET, AppRoutesNames.LOGOUT, AppRoutesNames.AUTH, AppRoutesNames.REGISTER]?.includes(name as AppRoutesNames)) {
    return;
  }

  checkHealth().then(getUser);
});

watch(token, (t) => {
  const localStorageToken = localStorage.getItem(Keys.TOKEN);
  if (!t?.length && localStorageToken?.length) {
    token.value = localStorageToken;
  }
}, { immediate: true });


watch(xTgToken, (t) => {
  const localStorageXtgToken = localStorage.getItem(Keys.X_TG_TOKEN);
  if (!t?.length && localStorageXtgToken?.length) {
    xTgToken.value = localStorageXtgToken;
  }
}, { immediate: true });


function fullscreenChangedHandler() {
  if (!window?.Telegram?.WebApp) {
    return;
  }

  const { isFullscreen } = window?.Telegram?.WebApp ?? { isFullscreen: false };
  window.Telegram.WebApp.contentSafeAreaInset.top = isFullscreen ? 400 : 0;
}
</script>
<template>
  <NuxtLoadingIndicator v-if="!initData.length" color="#4562ed" />
  <NuxtLayout>
    <UiLoader :show="!loading" />
    <NuxtPage v-if="loading" />
  </NuxtLayout>
</template>
