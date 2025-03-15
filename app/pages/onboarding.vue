<script lang="ts" setup>
import { AppRoutes } from '~/constants/app.route';
import { useI18n } from 'vue-i18n';
const { getMainButtonProps } = useShared();

definePageMeta({
  layout: 'empty',
  middleware: 'onboarded',
});

const route = useRoute();

const colorMode = useColorMode();

const { updateUser, user } = useUser();
const { t } = useI18n();

const step = computed(() => {
  const stepNumber = Number(route.query.step);

  return stepNumber >= 2 && stepNumber <= 3 ? stepNumber : 1;
});

const bg = computed(() => `url('${`${AppRoutes.ONBOARDING}/${step.value}_${colorMode.value}.png`}')`);

const buttonText = computed(() => {
  if (step.value === 3) {
    return t('shared.actions.start');
  } else {
    return t('shared.actions.next');
  }
});

onMounted(() => {
  if (user.value?.isOnboarded) {
    navigateTo(AppRoutes.WALLET);
  }
});

async function handleNextPage() {
  if (step.value !== 3) {
    return await navigateTo({
      query: {
        step: step.value + 1,
      },
    });
  }

  const user = await updateUser({ isOnboarded: true });

  if (typeof user !== 'string' && user?.isOnboarded) {
    return await navigateTo(AppRoutes.WALLET);
  }
}

async function handlePrevPage() {
  if (step.value === 1) {
    return;
  }

  return await navigateTo({
    query: {
      step: step.value - 1,
    },
  });
}
</script>

<template>
  <div class="onboarding relative flex px-4 pt-[40px]">
    <UiCustomBackButton v-if="step !== 1" class="absolute top-[40px] z-10" @click="handlePrevPage" />
    <div class="size-full">
      <div class="h-full onboarding-src bg-100% bg-no-repeat" />
    </div>
    <div class="onboarding-info">
      <p>
        {{ $t(`onboarding.${String(step)}.textStart`) }}
        <span class="text-new-primary">{{ $t(`onboarding.${String(step)}.textLink`) }}</span>
        {{ $t(`onboarding.${String(step)}.textEnd`) }}
      </p>

      <UiCustomMainButton v-bind="getMainButtonProps(false)" :progress="false" :text="buttonText" class="onboarding-button" @click="handleNextPage" />
    </div>
  </div>
</template>

<style>
.onboarding {
  height: 100dvh;
  position: relative;
  background-color: var(--bg-body);
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
  bottom: 40px;
  left: 16px;
  right: 16px;
  z-index: 5;
  font-size: 28px;
  font-weight: 500;
  line-height: 1.2;
  text-align: left;
}

.onboarding-button {
  margin-top: 24px;
}
</style>
