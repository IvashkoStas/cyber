<script lang="ts" setup>
import MasterCardIcon from '~/assets/icons/shared/_mastercard.svg';
import VisaIcon from '~/assets/icons/shared/_visa.svg';
import { fixCardExpiration } from '~/utils/fix.card.expiration';
import { CardNetwork } from '~~/types/card.network';
import { CardStatus } from '~~/types/card.status';
import type { CardType } from '~~/types/card.type';


interface Props {
  type?: Nullable<CardType>;
  number?:  Nullable<string>;
  expiration?: Nullable<string>;
  cardNetwork?: Nullable<CardNetwork>
  status?: CardStatus;
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
  status: CardStatus.LOCK,
});

const segments = computed(() => props.number?.replace(/(.{4})/g, '$1 ')?.split(' ') ?? []);
</script>

<template>
    <section class="payment-card">
      <div v-if="status !== CardStatus.ACTIVE" class="payment-card__status">
        <p class="payment-card__process">{{ $t(`cards.process.${status}`) }}</p>
      </div>
      <div class="payment-card__top">
        <div class="payment-card__number">
          <span v-for="(segment, index) in segments" :key="index" class="number-segment">
            {{ segment }}
          </span>
        </div>
        <div class="payment-card__expiration">
          {{ fixCardExpiration(expiration) }}
        </div>
      </div>
      <Component :is="icons[cardNetwork]" v-if="cardNetwork" class="payment-card__icon" />
    </section>
</template>

<style lang="scss">
.payment-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: var(--radius);
  padding: 16px;
  position: relative;
  width: 100%;
  aspect-ratio: 1.83;
  background-image: url('/main.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;

  &__status {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
  }

  &__process {
    font-size: 18px;
    font-weight: 600;
    color: #fff;
  }

  &__top {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }


  &__number {
    padding: 8px;
    border-radius: 8px;
    background: var(--accent-block);
    display: flex;
    align-items: flex-start;
    gap: 4px;
    font-size: 14px;
    width: max-content;
  }

  &__expiration {
    font-size: 10px;
    font-size: 13px;
    opacity: 0.7;
  }

  &__icon {
    position: absolute;
    bottom: 16px;
    right: 16px;
    width: 65px;
  }
}
</style>