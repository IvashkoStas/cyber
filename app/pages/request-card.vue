<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useWebApp } from 'vue-tg';
import CardWorldIcon from '~/assets/icons/shared/_card-world.svg';
import CryptoIcon from '~/assets/icons/shared/_crypto.svg';
import { AppRoutes } from '~/constants/app.route';

definePageMeta({
  // middleware: ['onboard', 'no-card', 'no-kyc'],
});

const icons = {
  card: CardWorldIcon,
  crypto: CryptoIcon,
};

const iconsNew = {
  new: CryptoIcon,
};

const { t } = useI18n();
const { initData } = useWebApp();
const { getMainButtonProps, theme, cardPrice } = useShared();
const { user } = useUser();
const themeKey = computed(() => theme.colorScheme.value);

const maiButtonText = computed(() => t('requestCard.action.runKyc'));

const isVisible = shallowRef(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  });
});

onBeforeUnmount(() => {
  isVisible.value = false;
});

const requestCardPageClasses = computed(() => [
  'request-card__page',
  'px-4',
  'pt-[30px]',
  'pb-[50px]',
  {
    'request-card__page--pwa': !initData.length,
  },
]);

const cardEmptyWrapperClass = computed(() => ({
  'pt-[20px]': !initData.length,
}));
</script>

<template>
  <div :class="requestCardPageClasses">
    <UiCustomBackButton :visible="isVisible" @click="$router.replace(AppRoutes.WALLET)" />
    <h1 class="card__title">
      <span class="text-new-primary">{{ $t('requestCard.topTitleStart') }}</span>
      {{ $t('requestCard.topTitleEnd') }}
    </h1>
    <div :class="cardEmptyWrapperClass">
      <CardEmpty>
        <div class="card__inner">
          <p class="card__subtitle">{{ $t('requestCard.cardPrice') }}</p>
          <div class="card__price">${{ cardPrice.toFixed(2) }}</div>
        </div>
      </CardEmpty>
    </div>
    <section class="info">
      <p class="info-description">{{ $t('requestCard.description') }}</p>
    </section>
    <SharedInfo v-if="!user?.kyc" :text="$t('requestCard.notification')" class="my-[20px]" />
    <UiCustomMainButton
      v-bind="getMainButtonProps(false)"
      :key="themeKey"
      :visible="isVisible"
      :text="maiButtonText"
      class="request-card__page-action"
      @click="$router.push(AppRoutes.KYC)"
    />
  </div>
</template>

<style lang="scss">
.request-card__page {
  margin-top: 0 !important;
  display: flex;
  flex-direction: column;

  &--pwa {
    height: 100dvh;
  }

  .card {
    &__inner {
      border-radius: 15px;
      padding: 12px;
      width: 100%;
      background-color: var(--accent-block);
    }

    &__title {
      font-weight: 500;
      font-size: 20px;
      text-align: center;
    }

    &__subtitle {
      text-align: center;
      font-weight: 400;
      font-size: 11px;

      margin-bottom: 8px;
    }

    &__price {
      text-align: center;
      font-weight: 600;
      font-size: 32px;
      color: var(--card-price);
      line-height: 1;
    }
  }

  .info {
    margin-top: 24px;

    &-title {
      font-size: 22px;
      font-weight: 500;
      line-height: 1.3;
      text-align: center;
    }

    &-description {
      font-size: 15px;
      font-weight: 400;
      line-height: 1.3;
      text-align: center;
    }

    &-list {
      margin-top: 20px;
      padding: 0 15px;
      border-radius: 15px;
      background: rgb(255 255 255 / 5%);

      .list-item {
        display: grid;
        grid-template-columns: 40px auto;
        gap: 13px;
        padding: 15px 0;

        &:not(&:last-child) {
          border-bottom: 1px solid rgb(255 255 255 / 20%);
        }

        &__title {
          font-size: 15px;
          font-weight: 500;
          line-height: 1.3;
        }

        &__description {
          margin-top: 5px;
          font-size: 12px;
          line-height: 1.23;
          color: rgb(255 255 255 / 50%);
        }

        .icon-wrapper {
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          background: #100f11;
        }
      }
    }
  }

  &-action {
    margin-top: auto;
  }
}
</style>
