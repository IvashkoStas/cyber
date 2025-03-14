<script lang="ts" setup>
// import AvocoinIcon from '~/assets/icons/shared/_avocoin.svg';
import VisaIcon from '~/assets/icons/shared/_visa.svg';
import { CardType } from '~~/types/card.type';

interface Props {
  type?: Nullable<CardType>;
}

const props = withDefaults(defineProps<Props>(), {
  type: null,
});

const { isPremium } = useUser();

const cardClasses = computed(() => [
  'empty-card',
  {
    'bg-card-gold': props.type === CardType.AVOCOIN,
    'empty-card--invest': props.type === CardType.INVEST_ZONE,
    'empty-card--myfin': props.type === CardType.MYFIN,
  },
]);

const cardClassesBottom = computed(() => ['empty-card__bottom', {
  'empty-card__bottom--invest': props.type === CardType.INVEST_ZONE,
  'empty-card__bottom--premium': isPremium.value,
}]);
</script>

<template>
  <section :class="cardClasses">
      <div class="empty-card__top">{{ $t('cards.wallet') }}</div>
      <div :class="cardClassesBottom">
        <!-- <AvocoinIcon v-if="type === CardType.AVOCOIN" class="empty-card__avocoin" /> -->
        <p v-if="isPremium" class="empty-card__zone">Premium</p>
        <p v-if="type === CardType.INVEST_ZONE" class="empty-card__zone">Invest zone</p>
        <VisaIcon class="empty-card__icon" />
      </div>
    </section>
</template>

<style lang="scss">
@use '~/assets/css/mixins' as mixins;

.empty-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  width: 100%;
  aspect-ratio: 1.83;

  @include mixins.gradientCard;

  &--gold {
    background-size: contain;

    .empty-card__icon {
      margin-top: auto;

      path {
        fill: black;
      }
    }

    .empty-card__avocoin {
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
    line-height: 1.4;
  }

  &__bottom {
    display: flex;
    justify-content: flex-end;
    align-items: center;
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