<script lang="ts" setup>
interface Props {
  currentStep: number;
  stepCount: number;
  title: string;
}

const props = defineProps<Props>();

function getActiveStep(step: number) {
  return [
    'step',
    {
      'step--active': step === props.currentStep,
    },
  ];
}
</script>

<template>
  <div :key="currentStep" class="step-header">
    <div class="step-header__left">
      <div class="step-header__title">
        {{ title }}
      </div>
    </div>
    <div class="step-header__steps">
      <span
        v-for="s in stepCount"
        :key="s"
        :class="getActiveStep(s)"
      />
    </div>
  </div>
</template>

<style lang="scss">
.step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 0 -1.25rem;
  padding: 20px;
  background-color: #1E1C1F;

  &__left {
    max-width: 80%;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
    text-align: left;
  }

  &__subtitle {
    margin-top: 5px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    color: rgba($color: #fff, $alpha: 0.5);
  }

  &__steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;

    .step {
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 3px;
      background: #FFF3;
      transition: all 0.2s ease-out;

      &--active {
        width: 12px;
        background-color: #fff;
        transition: all 0.2s ease-in;
      }
    }
  }
}
</style>