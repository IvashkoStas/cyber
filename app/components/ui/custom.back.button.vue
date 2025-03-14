<script setup lang="ts">
import { BackButton, useWebApp } from 'vue-tg';
import ChevronLeftIcon from '~/assets/icons/chevrons/chevron-left.svg';

const { initData } = useWebApp();
const isPwa = computed(() => !initData.length);
</script>

<template>
  <button v-if="isPwa" class="custom-back">
    <ChevronLeftIcon /> {{ $t('shared.actions.back') }}
  </button>
  <BackButton v-else  />
</template>

<style scoped>
.custom-back {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 2px;
  color: var(--link-color);
}
</style>