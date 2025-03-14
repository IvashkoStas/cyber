<script lang="ts" setup>
import CheckKyc from '~/assets/icons/shared/_check-kyc.svg';
import TimeKyc from '~/assets/icons/shared/_time-kyc.svg';
import { KycStatus } from '~~/types/kys.status';
import { AppRoutes } from '~/constants/app.route';

const { kyc } = useUser();
const status = computed(() => {
  switch(kyc.value?.status) {
    case KycStatus.ADOPT_PASS:
      return 'success';
    case KycStatus.REFUSE:
      return 'fail';
    default:
      return 'pending';
  }
});

const icon = computed(() => {
  const status = kyc.value?.status ?? KycStatus.WAIT_AUDIT;
  switch(status) {
    case KycStatus.ADOPT_PASS:
      return CheckKyc;
    // case KycStatus.REFUSE:
    case KycStatus.WAIT_AUDIT:
      return TimeKyc;
    //   return CrossKyc;
    default:
      return TimeKyc;
  }
});

const iconClasses = computed(() => [
  'kyc-info__icon',
    {
      'kyc-info__icon--audit': kyc.value?.status !== KycStatus.ADOPT_PASS,
      'kyc-info__icon--pass': kyc.value?.status === KycStatus.ADOPT_PASS,
    },
]);
</script>

<template>
  <section class="kyc-info">
    <Component :is="icon" :class="iconClasses" />
    <div>
      <div class="kyc-info__title" v-html="$t(`requestCard.kycInfo.${status}.title`)" />
      <p class="kyc-info__description">
        {{ $t(`requestCard.kycInfo.${status}.description`) }}
        <NuxtLink
          v-if="kyc?.status === KycStatus.REFUSE"
          :to="AppRoutes.FAQ"
          class="kyc-info__description-link"
        >
          FAQ
        </NuxtLink>
      </p>
    </div>
  </section>
</template>

<style lang="scss">
.kyc-info {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin: 120px 0 0;
  padding: 12px calc(1.25rem + 10px);

  &__icon {
    width: 100px;
    height: 100px;

    &--audit {
      & * {
        fill: transparent !important;
      }
    }
  }

  &__title {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.2;
    text-align: center;
  }

  &__description {
    margin-top: 12px;
    font-size: 13px;
    line-height: 1.2;
    text-align: center;
    color: rgba($color: #fff, $alpha: 0.5);

    &-link {
      color: #E97DE2;
      font-weight: 400;
    }
  }
}
</style>