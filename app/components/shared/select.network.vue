<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { BalanceSymbol, type Balance } from '~~/types/balance';
import { Network } from '~~/types/network';
import type { NetworkAddressWithSymbol } from '~~/types/network.address';

interface Props {
  modelValue: number;
  inboxNetworks?: NetworkAddressWithSymbol[] | Balance[];
  isUsdt?: boolean;
}

interface Emits {
  (event: 'update:modelValue', value: number): void;
}

const icons = {
  [Network.TRX]: 'usdt',
  [Network.ETH]: 'eth',
  [Network.BNB]: 'bnb',
  [Network.TON]: 'ton',
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { t } = useI18n();

const wallet = useWallet();
const networks = computed(() => props.inboxNetworks ?? wallet.networks.value);
const selectNetwork = computed(() => networks.value?.[props.modelValue]?.network as string);
const selectedSymbol = computed(() => networks.value?.[props.modelValue]?.symbol ?? undefined);

function getTitle(network: string, symbol?: string) {
  const title = t(`network.${network}`);

  if (props.isUsdt) {
    return `${title} USDT`;
  }

  if (symbol) {
    const fixedSymbol = symbol === BalanceSymbol.USD_REF ? 'USDT' : symbol;

    return `${title} ${fixedSymbol}`;
  }

  return title;
}

function onSelect(index: number) {
  emits('update:modelValue', index);
}

function getIcon(key: keyof typeof icons) {
  return `/icons/currency/${icons[key]}.svg`;
}
</script>

<template>
  <UiDropMenu v-if="networks?.length" :title="getTitle(selectNetwork, selectedSymbol)" big>
    <template #icon>
      <span class="network-flag">
        <img :src="getIcon(selectNetwork as keyof typeof icons)" class="network-flag__image" >
      </span>
    </template>
    <UiDropMenuItem
      v-for="({ network, symbol }, index) in networks"
      :key="network"
      :selected="modelValue === index"
      :title="getTitle(network, symbol)"
      @click="onSelect(index)"
    >
    <span class="network-flag">
      <img :src="getIcon(network as keyof typeof icons)" class="network-flag__image" >
    </span>
    </UiDropMenuItem>
  </UiDropMenu>
</template>

<style lang="scss">
.network {
  &-flag {
    display: inline-flex;
    width: 20px;
    height: 20px;
    overflow: auto;
    border-radius: 50%;
    margin-right: 10px;

    &__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>