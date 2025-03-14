<script lang="ts" setup>
import MasterCardIcon from '~/assets/icons/shared/_mastercard.svg';
import VisaIcon from '~/assets/icons/shared/_visa.svg';
// import AvocoinIcon from '~/assets/icons/shared/_avocoin.svg';
import { fixCardExpiration } from '~/utils/fix.card.expiration';
import { CardNetwork } from '~~/types/card.network';
import { CardType } from '~~/types/card.type';


interface Props {
  type?: Nullable<CardType>;
  number?:  Nullable<string>;
  expiration?: Nullable<string>;
  cardNetwork?: Nullable<CardNetwork>
}

const icons = {
  [CardNetwork.VISA]: VisaIcon,
  [CardNetwork.MASTERCARD]: MasterCardIcon,
};



const props = withDefaults(defineProps<Props>(), {
  type: null,
  expiration: '',
  number: '',
  cardNetwork: CardNetwork.VISA,
});

const { isPremium } = useUser();

const segments = computed(() => props.number?.replace(/(.{4})/g, '$1 ')?.split(' ') ?? []);

const cardClasses = computed(() => [
  'payment-card',
  {
    'payment-card--gold': props.type === CardType.AVOCOIN,
    'bg-card-gold': props.type === CardType.AVOCOIN,
    'payment-card--invest': props.type === CardType.INVEST_ZONE,
    'payment-card--myfin': props.type === CardType.MYFIN,
    'payment-card--krm': props.type === CardType.KRM,
  },
]);

const cardClassesBottom = computed(() => ['payment-card__bottom', {
  'payment-card__bottom--invest': props.type === CardType.INVEST_ZONE,
  'payment-card__bottom--premium': isPremium.value,
}]);


</script>

<template>
    <section :class="cardClasses">
      <div class="payment-card__top">
        <h3 class="payment-card__title">{{ $t('cards.wallet') }}</h3>
        <div class="payment-card__number">
          <span v-for="(segment, index) in segments" :key="index" class="number-segment">
            {{ segment }}
          </span>
        </div>
        <div class="payment-card__expiration">
          {{ fixCardExpiration(expiration) }}
        </div>
      </div>
      <div :class="cardClassesBottom">
        <!-- <AvocoinIcon v-if="type === CardType.AVOCOIN" class="payment-card__avocoin" /> -->
        <p v-if="isPremium" class="empty-card__zone">Premium</p>
        <p v-if="type === CardType.INVEST_ZONE" class="payment-card__zone">Invest zone</p>
        <Component :is="icons[cardNetwork]" v-if="cardNetwork" class="payment-card__icon" />
      </div>
    </section>
</template>

<style lang="scss">
@use '~/assets/css/mixins' as mixins;

.payment-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px;
  aspect-ratio: 1.73;

  @include mixins.gradientCard;

  &--krm {
    background: url('/images/krm.jpg');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  &--gold {
    background-size: contain;

    .payment-card__icon {
      margin-top: auto;

      path {
        fill: black;
      }
    }

    .payment-card__avocoin {
      transform: translateX(-25%);
    }
  }

  &--invest {
    @include mixins.investLogo;
  }

  &--myfin {
    @include mixins.myfinLogo;
  }


  &__zone {
    font-size: 15px;
    font-weight: 400;
    line-height: 1.4;
    letter-spacing: 1px;
    text-align: left;
    text-transform: uppercase;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }

  &__top {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__title {
    font-size: 15px;
    line-height: 1.2;
  }

  &__number {
    padding-top: 5px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: 3px;
  }

  &__expiration {
    font-size: 10px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: 3px;
    color: rgb(255 255 255 / 60%);
  }

  &__bottom {
    display: flex;
    justify-content: flex-end;
    margin-top: auto;

    &--premium,
    &--invest {
      justify-content: space-between;
    }
  }

  &__icon {
    min-width: 64px;
    min-height: 35px;
  }
}
</style>