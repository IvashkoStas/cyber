<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useWebApp } from 'vue-tg';

type ErrorType = string | undefined;

interface Props {
  lastName: string;
  firstName: string;
  bdate: string;
  errors: [ErrorType, ErrorType, ErrorType];
}

interface Emits {
  (event: 'update:lastName' | 'update:firstName' | 'update:bdate', value: string): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const lastName = computed({
  get: () => props.lastName,
  set: (value: string) => emits('update:lastName', value),
});

const firstName = computed({
  get: () => props.firstName,
  set: (value: string) => emits('update:firstName', value),
});

const { t } = useI18n();

const { initData } = useWebApp();
const stepTwoClasses = computed(() => [
  'kyc-step__two',
  {
    'kyc-step__two--pwa': !initData.length,
  },
]);

function getErrorText(index: number) {
  const error = props.errors[index];

  if (!error?.length) {
    return '';
  }

  return t(error);
}
</script>

<template>
  <div :class="stepTwoClasses">
    <p class="step-two__description">{{ $t('kyc.steps.2.description') }}</p>
    <div class="step-two__fields">
      <UiInput
        v-model.trim="lastName"
        :title="$t('kyc.steps.2.form.lastName.title')"
        :placeholder="$t('kyc.steps.2.form.lastName.placeholder')"
        :error="getErrorText(0)"
        inputmode="latin-name"
      />
      <UiInput
        v-model.trim="firstName"
        :title="$t('kyc.steps.2.form.firstName.title')"
        :placeholder="$t('kyc.steps.2.form.firstName.placeholder')"
        :error="getErrorText(1)"
        inputmode="latin-name"
      />
      <UiInputDate :error="getErrorText(2)" :date="bdate" @update:date="$emit('update:bdate', $event)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.kyc-step__two {
  max-width: 100vw;
  padding: 0 0 20px;
  height: min-content;

  &--pwa {
    height: 100%;
    min-height: 100%;
  }

  .step-two {
    &__description {
      margin-top: 8px;
      font-size: 14px;
      line-height: 1.2;
      color: var(--input-placeholder);
    }

    &__fields {
      padding-top: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  }
}
</style>
