<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useWebApp } from 'vue-tg';
import CryptoIcon from '~/assets/icons/shared/_crypto.svg';
import { AppRoutes } from '~/constants/app.route';


definePageMeta({
  middleware: ['onboard', 'no-card', 'no-kyc'],
});

const iconsNew = {
  new: CryptoIcon,
};



const { t } = useI18n();
const { initData } = useWebApp();
const { getMainButtonProps, theme } = useShared();
const { user } = useUser();
const themeKey = computed(() => theme.colorScheme.value);

const maiButtonText = computed(() =>  t('requestCard.action.runKyc'));

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
    <div :class="cardEmptyWrapperClass">
      <CardEmpty />
    </div>
    <section class="info">
      <h2 class="info-title">{{ $t('requestCard.title') }}</h2>
      <p class="info-description">{{ $t('requestCard.description') }}</p>
      <SharedInfoPrice />
      <ul class="info-list">
        <li v-for="([key, icon]) in Object.entries(iconsNew)" :key="key" class="list-item">
          <div class="icon-wrapper">
            <Component :is="icon" />
          </div>
          <div>
            <h4 class="list-item__title">
              {{ $t(`requestCard.info.${key}.title`) }}
            </h4>
            <p class="list-item__description">
              {{ $t(`requestCard.info.${key}.text`) }}
            </p>
          </div>
        </li>
      </ul>
    </section>
    <SharedInfo
      v-if="!user?.kyc"
      :text="$t('requestCard.notification')"
      class="my-[20px]"
    />
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

  .info {
    margin-top: 25px;

    &-title {
      font-size: 22px;
      font-weight: 500;
      line-height: 1.3;
      text-align: center;
    }

    &-description {
      margin-top: 10px;
      font-size: 15px;
      font-weight: 400;
      line-height: 18.29px;
      text-align: center;
      color: rgb(255 255 255 / 80%);
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
          background: #100F11;
        }
      }
    }
  }

  &-action {
    margin-top: auto;
  }
}
</style>