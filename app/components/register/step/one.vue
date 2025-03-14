<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

interface Props {
  modelValue: string;
  error?: string,
}

interface Emits {
  (event: 'update:modelValue', value: string): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { t } = useI18n();


const email = computed({
  get: () => props.modelValue,
  set: (value: string) => emits('update:modelValue', value),
});

function getErrorText() {
  if (!props.error) {
    return '';
  }

  return t(props.error);
}
</script>

<template>
  <UiInput
    v-model.trim="email"
    inputmode="email"
    type="email"
    :title="$t('kyc.steps.2.form.email.title')"
    :placeholder="$t('kyc.steps.2.form.email.placeholder')"
    :error="getErrorText"
  />
</template>

<style lang="scss">

</style>