<script lang="ts" setup>
import type { VueTelInputValidateData } from '~~/types/vue.tel.validate.data';

interface Props {
  modelValue: string;
  class?: string;
  placeholder: string;
  error?: string;
}

interface Emits {
  (event: 'update:modelValue', value: string): void;
  (event: 'valid', value: VueTelInputValidateData): void;
}

defineOptions({
  inheritAttrs: false,
});

const inputWrapperRef = useTemplateRef('input-wrapper');

onMounted(() => {
  const input = inputWrapperRef.value?.querySelector('input');
  input?.setAttribute('inputmode', 'tel');
});

const VueTelInput = defineAsyncComponent(() =>
  Promise.all([import('vue-tel-input'), import('vue-tel-input/vue-tel-input.css')]).then(([{ VueTelInput }]) => VueTelInput),
);

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { selectionChanged } = useVibrate();

const model = computed({
  get: () => props.modelValue,
  set: (value: string) => emits('update:modelValue', value),
});

const parentClasses = computed(() => ['phone-input', props.class ?? '']);

function onPhoneInput(_: string, data: VueTelInputValidateData) {
  if (data?.valid) {
    const input = inputWrapperRef.value?.querySelector('input');
    input?.blur();
  }

  emits('valid', data);
}
</script>

<template>
  <div ref="input-wrapper" :class="parentClasses">
    <VueTelInput
      v-bind="props"
      v-model="model"
      enabled-country-code
      mode="international"
      :input-options="{
        showDialCode: true,
        inputmode: 'tel',
      }"
      :placeholder="placeholder"
      class="phone-input__input"
      @on-input="onPhoneInput"
      @change="onPhoneInput"
      @country-changed="selectionChanged"
    />
    <small v-if="error?.length" class="phone-input__error">{{ error }}</small>
  </div>
</template>

<style lang="scss">
.phone-input {
  width: 100%;
  position: relative;

  .vti__input {
    background-color: transparent;
  }

  &__input {
    width: 100%;
    min-height: 54px;
    margin-top: 4px;
    padding: 14px 10px;
    border-radius: 10px;
    background-color: var(--input-bg);
    font-size: 14px;
    line-height: normal;
    color: var(--input-color);
    outline: none;
    border: none;

    &.vue-tel-input {
      border-radius: 10px !important;
      border: unset !important;
      flex-direction: row-reverse;

      &:focus-within {
        box-shadow: unset !important;
      }

      .vti__dropdown-list {
        max-height: 220px;
        width: calc(100vw - 32px);
        padding: 8px 0;
        background-color: var(--input-bg) !important;
        border-radius: 10px !important;
        border: none !important;
        left: unset;
        right: -10px;

        &.above,
        &.below {
          top: 48px;
          bottom: unset;
        }

        .vti__dropdown-item.highlighted {
          background-color: rgba($color: #815aeb, $alpha: 0.05);
        }
      }

      .vti__dropdown {
        padding: 4px;
      }

      .vti__dropdown-arrow {
        display: none;
      }

      .vti__dropdown-item {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        font-size: 14px;
        color: var(--input-color);

        span:last-of-type {
          margin-left: 8px;
        }

        .vti__flag {
          margin-right: 12px;
          margin-left: 4px;
        }

        strong {
          text-wrap: balance;
          font-weight: 400;
        }
      }

      .vti__dropdown,
      .vti__input.vti__phone {
        background-color: transparent !important;
      }
    }
  }

  &__error {
    position: absolute;
    right: 0;
    bottom: -18px;
    font-size: 10px;
    line-height: 1.2;
    color: #fff;
  }
}
</style>
