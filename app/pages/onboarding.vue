<script lang="ts" setup>
import { AppRoutes } from '~/constants/app.route';

definePageMeta({
  layout: 'empty',
  middleware: 'onboarded',
});

const route = useRoute();

const { updateUser, user } = useUser();

const bg = computed(() => {
  const step = Number(route.query.step) === 2 ? 2 : 1;

  return `url('${`${AppRoutes.ONBOARDING}/${step}.webp`}')`;
});

const step = computed(() => Number(route.query.step) === 2 ? 'two' : 'one');

onMounted(() => {
  if (user.value?.isOnboarded) {
    navigateTo(AppRoutes.WALLET);
  }
});

async function handleNextPage() {
  if (Number(route.query.step) !== 2) {
    return await navigateTo({
      query: {
        step: 2,
      },
    });
  }

  const user = await updateUser({ isOnboarded: true });

  if (typeof user !== 'string' && user?.isOnboarded) {
    return await navigateTo(AppRoutes.WALLET);
  }
}

async function handlePrevPage() {
  if (step.value !== 'two') {
    return;
  }

  return await navigateTo({
    query: {
      step: 1,
    },
  });
}
</script>

<template>
  <div class="onboarding relative flex px-5 pt-[50px]">
    <UiCustomBackButton v-if="step === 'two'" @click="handlePrevPage" />
    <div class="size-full pl-[39px] pr-[36px]">
      <div class="h-full onboarding-src bg-100% bg-no-repeat" />
    </div>
    <div class="onboarding-info">
      <p>
        {{ $t(`onboarding.${step}.textStart`) }}
        <span class="text-new-primary">{{ $t(`onboarding.${step}.textLink`) }}</span>
        {{ $t(`onboarding.${step}.textEnd`) }}
      </p>
      <UiButton class="onboarding-button hover:bg-new-primary/90 bg-new-primary" @click="handleNextPage">
        {{ $t('shared.actions.next') }}
      </UiButton>
    </div>
  </div>
</template>

<style>
.onboarding {
  height: 100dvh;
  position: relative;
  background: linear-gradient(180deg, #000 13.39%, #3D3D3D 100%);

  &::after {
    content: '';
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, rgb(0 0 0 / 0%) 0%, rgb(0 0 0 / 79.5%) 62.4%, #000 85.4%);
  }
}

.onboarding-src {
  background-image: v-bind(bg);
  background-size: 100%;
}

.onboarding-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  bottom: 39px;
  left: 20px;
  right: 20px;
  z-index: 5;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.2;
  text-align: left;
}

.onboarding-button {
  margin-top: 24px;
  padding: 18px;
  border-radius: 15px;
  font-size: 20px;
  font-weight: 500;
  line-height: 24.38px;
}
</style>