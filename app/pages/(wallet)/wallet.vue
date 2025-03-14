<script lang="ts" setup>
import { getMessaging, getToken } from 'firebase/messaging';
import { AppRoutes } from '~/constants/app.route';

definePageMeta({
  middleware: 'onboard',
});

// const { vapidKey, vapidKeyProd } = useRuntimeConfig().public;
// const CRYPTO_PAY_BOT = 'cryptopaybot.com';
// const isCryptoPayBot = window?.location?.hostname?.includes(CRYPTO_PAY_BOT);
const { balance, user, updateUserDeviceTokens } = useUser();
const { kyc } = useUser();
const app = useFirebaseApp();

const showRequestCard = computed(() => {
  if (!kyc.value || !user.value?.cards?.length) {
    return true;
  }

  return false;
});


// async function requestNotifyPermission() {
//   const permission = await window?.Notification?.requestPermission();
//     if (permission === 'granted') {
//       const serviceWorkerRegistration = await navigator.serviceWorker.register('/fcm-sw.js');

//       const messaging = getMessaging(app);
//       const messageToken = await getToken(messaging, {
//         vapidKey: isCryptoPayBot ? vapidKeyProd : vapidKey,
//         serviceWorkerRegistration,
//       });

//       await updateUserDeviceTokens(messageToken);
//     }
// }

onMounted(() => {
  window.addEventListener('click', requestNotifyPermission, { once: true });
});
</script>

<template>
  <div class="wallet px-5 pb-[120px] pt-[50px]">
    <BalanceTitle :title="$t('wallet.balance')" :balance="balance" />
    <section class="wallet-controls">
      <SharedLinkWithIcon :to="AppRoutes.ADD_USDT" class="wallet-controls__link" />
      <SharedLinkWithIcon
        :to="AppRoutes.WALLET_OUTPUT"
        direction="out"
        class="wallet-controls__link"
      />
    </section>
    <SharedReplenishment />
    <CardRequest v-if="showRequestCard" :type="user?.partner?.design" />
    <CardRef v-else />
    <SharedTransactionGroup
      class="mt-10"
      entity="wallet"
      :to="AppRoutes.WALLET_OPERATION"
      :link-title="$t('wallet.operations')"
    />
  </div>
</template>

<style lang="scss">
.wallet {
  height: min-content;

  &-controls {
    margin-top: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    &__link {
      flex: 0 0 calc(50% - 5px);
    }
  }
}
</style>