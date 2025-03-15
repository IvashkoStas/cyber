<script lang="ts" setup>
import { formatPrice } from '~/utils/format.price';

interface Props {
  title: string;
  balance: number | string;
}

const props = defineProps<Props>();
const { convertUsdtInCurrentCurrency } = useCurrencyConverter();

const countryBalance = computed(() => convertUsdtInCurrentCurrency(+props.balance));
</script>

<template>
  <section class="balance">
    <div class="balance-title">
      {{ title }}
    </div>
    <div class="balance-value">
      <span>$</span>
      {{ formatPrice(balance) }}
    </div>
    <div v-if="countryBalance" class="balance-country">
      {{ countryBalance }}
    </div>
  </section>
</template>

<style lang="scss" scoped>
.balance {
  $primary: var(--primary-color);

  color: $primary;

  &-title {
    font-size: 14px;
  }

  &-value {
    margin-top: 4px;
    font-weight: 500;
    font-size: 44px;
  }

  &-country {
    margin-top: 16px;
    font-size: 14px;
    opacity: 0.7;
  }

}
</style>
