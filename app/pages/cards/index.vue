<script lang="ts" setup>
import { AppRoutes } from '~/constants/app.route';
import { CardStatus } from '~~/types/card.status';

definePageMeta({
  middleware: ['card'],
});

const { user, firstCard } = useUser();

const cardNumber = computed(() => {
  if (!firstCard.value?.last4CardNumber?.length) {
    return '';
  }

  return firstCard.value?.last4CardNumber?.padStart(16, '*');
});


onMounted(() => {
  if (!firstCard.value?.status) {
    navigateTo(AppRoutes.HEALTH_ERROR);
  }
});


const showBalanceLock = computed(() => (firstCard.value?.balance ?? 0) < 0);
</script>

<template>
<div :key="firstCard?.id">
  <UiLoader class="z-0" :show="!user" />
  <div
    v-if="![CardStatus.ACTIVE, CardStatus.LOCK].includes(firstCard?.status) || !firstCard"
    class="cards h-full px-4 pb-[120px] pt-[30px]"
  >
    <p class="cards__process">{{ $t(`cards.process.${firstCard?.status ?? 'LOCK'}`) }}</p>
  </div>
  <div v-else class="cards h-full px-4 pb-[120px] pt-[50px]">
    <BalanceTitle
      :balance="firstCard?.balance ?? 0"
      :title="$t('cards.balance')"
    />
    <CardPayment
      class="mt-12"
      :number="cardNumber"
      :expiration="firstCard?.expireAt"
      :card-network="firstCard.network"
      :status="firstCard?.status"
      :type="user?.partner?.design ?? firstCard?.partner?.design"
    />
    <template v-if="firstCard.status === CardStatus.LOCK">
      <p v-if="showBalanceLock" class="cards__process">{{ $t(`cards.process.BALANCE_LOCK`) }}</p>
      <p v-else class="cards__process">{{ $t(`cards.process.${firstCard?.status}`) }}</p>
    </template>
    <section class="cards__actions">
      <SharedLinkWithIcon
        class="card-actions__link"
        icon="card"
        :text="$t('card.data')"
        :to="`${AppRoutes.CARDS}/${firstCard.id}`"
      />
      <SharedLinkWithIcon
        class="card-actions__link"
        :text="$t('card.deposit')"
        :to="`${AppRoutes.CARDS_UP}/${firstCard.id}`"
      />
    </section>
    <SharedTransactionGroup
      class="mt-[30px]"
      entity="card"
      :link-title="$t('card.operations')"
      :card-id="firstCard.id"
      :to="`${AppRoutes. CARDS_OPERATION}/${firstCard.id}`"
    />
  </div>
</div>
</template>

<style lang="scss">
.cards {
  height: min-content;

  &__process {
    margin-top: 30px;
    padding: 10px 20px;
    border-radius: 15px;
    background: rgb(255 255 255 / 5%);
    font-size: 15px;
    font-weight: 500;
    line-height: 1.2;
    text-align: center;
  }

  &__actions {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 10px;

    .card-actions__link {
      flex: 0 0 calc(50% - 5px);
    }
  }
}
</style>