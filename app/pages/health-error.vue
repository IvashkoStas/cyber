<script lang="ts" setup>
import { SUPPORT_LINK } from '~/constants/links';

definePageMeta({
  layout: 'empty',
  middleware: 'no-health',
});

function goToSupport() {
  navigateTo(SUPPORT_LINK);
}
</script>

<template>
  <div class="health-error h-full px-5 pb-[120px] pt-[30px]">
    <div class="health-error__info">
      <h2 class="health-error__info-title">{{ $t('healthCheck.title') }}</h2>
      <p class="health-error__info-description">{{ $t('healthCheck.description') }}</p>
    </div>
    <UiButton
      action
      theme
      class="health-error__button"
      @click="goToSupport"
    >
      {{ $t('healthCheck.button') }}
    </UiButton>
  </div>
</template>

<style lang="scss">
.health-error {
  &__info {
    padding: 10px 21px;
    border-radius: 15px;
    background: rgb(255 255 255 / 5%);
    font-size: 15px;
    font-weight: 500;
    line-height: 1.2;
    text-align: center;

    &-description {
      margin-top: 15px;
      font-size: 12px;
      color: rgb(255 255 255 / 50%);
    }
  }

  &__button {
    margin: 20px auto 0;
  }
}
</style>