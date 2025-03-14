<script lang="ts" setup>
import { AppRoutes } from '~/constants/app.route';
</script>

<template>
  <div class="wallet-operation h-full px-5 pb-[120px] pt-[30px]">
    <UiCustomBackButton @click="$router.replace(AppRoutes.WALLET)" />
    <h2 class="wallet-operation__title">
      {{ $t('walletOperation.title') }}
    </h2>
    <SharedTransactionGroup class="mt-5" :show-link="false" entity="wallet" load-more />
  </div>
</template>

<style lang="scss" scoped>
.wallet-operation {
  height: min-content;

  &__title {
    font-size: 20px;
    font-weight: 500;
    line-height: 1.2;
  }
}
</style>