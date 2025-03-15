<script lang="ts" setup>
import { AppRoutes } from '~/constants/app.route';
</script>

<template>
  <div class="card-operation h-full px-4 pb-[120px] pt-[30px]">
    <UiCustomBackButton @click="$router.replace(AppRoutes.CARDS)" />
    <h2 class="card-operation__title">{{ $t('card.operations') }}</h2>
    <SharedTransactionGroup
      class="mt-5"
      :show-link="false"
      entity="card"
      :card-id="Number($route.params.id)"
      load-more
    />
  </div>
</template>

<style lang="scss" scoped>
.card-operation {
  &__title {
    font-weight: 500;
    font-size: 20px;
  }
}
</style>