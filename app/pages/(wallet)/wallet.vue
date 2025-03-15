<script lang="ts" setup>
import { AppRoutes } from '~/constants/app.route';

definePageMeta({
  middleware: 'onboard',
});

// const { vapidKey, vapidKeyProd } = useRuntimeConfig().public;
// const CRYPTO_PAY_BOT = 'cryptopaybot.com';
// const isCryptoPayBot = window?.location?.hostname?.includes(CRYPTO_PAY_BOT);
const { balance, user, updateUserDeviceTokens } = useUser();
const { kyc } = useUser();
// const app = useFirebaseApp();

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

// onMounted(() => {
//   window.addEventListener('click', requestNotifyPermission, { once: true });
// });
</script>

<template>
  <div class="wallet pb-[120px]">
    <div class="hero">
      <BalanceTitle :title="$t('wallet.balance')" :balance="balance" />
    </div>
      <div class="px-5">
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
  </div>
</template>

<style lang="scss">
.wallet {
  height: min-content;

  .hero {
    height: 281px;
    padding: 20px 30px;
    overflow: hidden;
    transform: translateY(-1px);
    background-image: url('/main-frame.svg');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    border-bottom-right-radius: var(--radius);
    border-bottom-left-radius: var(--radius);
  }

  &-controls {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &__link {
      flex: 0 0 calc(50% - 5px);
    }
  }
}
</style>