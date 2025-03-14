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
  <section class="flex flex-col items-center gap-[10px]">
    <div class="font-primary text-[15px] font-light leading-[1.2] text-white/50">{{title}}</div>
    <div class="font-secondary text-[40px] leading-[1.2] tracking-[1px]">
      <span class="text-white/50">$ </span>
      {{formatPrice(balance)}}
    </div>
    <div v-if="countryBalance" class="text-white/50 text-[15px]">
      {{ countryBalance}}
    </div>
  </section>
</template>
