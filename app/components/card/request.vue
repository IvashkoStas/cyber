<script lang="ts" setup>
import VisaIcon from '~/assets/icons/shared/_visa.svg';
import { AppRoutes } from '~/constants/app.route';
import { CardType } from '~~/types/card.type';
import { KycStatus } from '~~/types/kys.status';

interface Props {
  type?: Nullable<number>;
}
const props = withDefaults(defineProps<Props>(), {
  type: null,
});

const { kyc } = useUser();

const { impactOccurred } = useVibrate();

const isByCard = computed(
  () => [
    KycStatus.ADOPT_PASS,
    KycStatus.IN_AUDIT,
    KycStatus.PREMODERATION,
    KycStatus.READY_FOR_SEND,
  ]?.includes(kyc.value?.status as KycStatus),
);

const link = computed(() =>  isByCard.value ? AppRoutes.BY_CARD : AppRoutes.REQUEST_CARD);
const linkText = computed(() =>  isByCard.value ? 'wallet.buyCard' : 'wallet.request');

const cardClasses = computed(() => [
  'request-card',
  {
    'bg-card-gold': props.type === CardType.AVOCOIN,
    'request-card--invest': props.type === CardType.INVEST_ZONE,
    'request-card--myfin': props.type === CardType.MYFIN,
    'request-card--krm': props.type === CardType.KRM,
  },
]);
</script>

<template>
  <section :class="cardClasses">
    <p class="request-card__info" v-html="$t('wallet.requestInfo')" />
    <div class="request-card__bottom">
      <NuxtLink class="card-trigger" :to="link" @click="impactOccurred('light')">
        {{$t(linkText)}}
      </NuxtLink>
      <VisaIcon class="request-card__icon" />
    </div>
  </section>
</template>

<style lang="scss">
@use '~/assets/css/mixins' as mixins;

.request-card {
  width: 100%;
  aspect-ratio: 1.73;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  margin-top: 20px;

  @include mixins.gradientCard;

  &--krm {
    background: url('/images/krm.jpg');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  &--gold {
    background-size: contain;

    .request-card__icon {
      margin-top: auto;

      path {
        fill: black;
      }
    }
  }

  &--invest {
    @include mixins.investLogo;
  }

  &--myfin {
    @include mixins.myfinLogo;
  }


  &__info {
    line-height: 1.4;
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-trigger {
      height: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      z-index: 2;
      border-radius: 15px;
      padding: 0 15px;
      background-color:  rgb(255 255 255 / 10%);
      font-size: 12px;
      font-weight: 400;
      line-height: 1.2px;
    }
  }

  &__icon {
    min-width: 64px;
    min-height: 35px;
  }
}
</style>