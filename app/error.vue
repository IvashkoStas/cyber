<script lang="ts" setup>
import type { NuxtError } from '#app';
import { AppRoutes } from './constants/app.route';

const props = defineProps<{
  error: NuxtError;
}>();


onMounted(() => {
  if (props.error?.message?.includes('_nuxt') && props.error?.message?.includes('.json')) {
    goHome();
  }
});

function goHome() {
  clearError({ redirect: AppRoutes.WALLET });
  window?.location?.reload();
}
</script>

<template>
  <div class="flex flex-col items-center gap-5">
    <UiLoader show />
    <!-- <h1>{{ error?.statusCode }}</h1>
    <p>{{ error?.message }}</p>
    <UiButton @click="goHome">
      go wallet
    </UiButton> -->
  </div>
</template>

