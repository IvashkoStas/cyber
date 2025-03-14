<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import CopyBigIcon from '~/assets/icons/shared/_copy-big.svg';
import ShareIcon from '~/assets/icons/shared/_share.svg';
import { AppRoutes } from '~/constants/app.route';

definePageMeta({
  middleware: 'onboard',
});

const { t } = useI18n();
const { user } = useUser();
const toast = useToast();

const selectedNetworkIndex = shallowRef(0);


const qrCodeProps = computed(() => {
  const selectNetwork = user.value?.wallet.assets[selectedNetworkIndex.value];

  return {
    link: selectNetwork?.address ?? '',
    network: selectNetwork?.network ?? '',
  };
});


async function onCopyLink(): Promise<void> {
  if (!qrCodeProps.value.link) {
    return;
  }

  try {
    await copyTextToClipboard(qrCodeProps.value.link);
    toast(t('shared.labels.copied'));
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
<div class="add-usdt h-full px-5 pb-[120px] pt-[30px]">
  <UiCustomBackButton @click="$router.replace(AppRoutes.WALLET)" />
  <h2 class="add-usdt__title">{{ $t('addUsdt.title') }}</h2>
  <SharedSelectNetwork v-model="selectedNetworkIndex" is-usdt />
  <section class="add-usdt__qr">
    <div class="qr-img">
      <Transition name="fade" mode="out-in">
        <SharedQrCode v-bind="qrCodeProps" :key="qrCodeProps.network" />
      </Transition>
    </div>
    <p class="qr-link">{{ qrCodeProps.link }}</p>
  </section>
  <section v-if="qrCodeProps.network" class="add-usdt__actions">
    <a :href="`https://t.me/share/url?url=${qrCodeProps.link}`" class="action">
      <ShareIcon class="action-icon" />
      {{ $t('shared.actions.share') }}
    </a>
    <button class="action action--copy" @click="onCopyLink">
      <CopyBigIcon  class="action-icon" />
      {{ $t('shared.actions.copy') }}
    </button>
  </section>
  <CardRef  />
</div>
</template>

<style lang="scss">
.add-usdt {
  height: min-content;

  &__title {
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.2;
  }

  &__qr {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-top: 10px;
    padding: 40px 60px;
    border-radius: 15px;
    background: rgb(255 255 255 / 5%);

    .qr-link {
      font-size: 14px;
      line-height: 1.2;
      text-align: center;
      word-break: break-all;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: auto;
    padding-top: 10px;

    .action {
      flex: 0 0 calc(50% - 5px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px;
      border-radius: 15px;
      background: rgb(255 255 255 / 5%);
      font-size: 12px;
      font-weight: 300;
      line-height: 1.2;
      text-align: center;

      &--copy {
        color: hsl(var(--primary));
        background: rgba(233, 125, 226, 0.2);
      }

      &-icon {
        width: 30px;
        height: 30px;
      }
    }
  }
}
</style>