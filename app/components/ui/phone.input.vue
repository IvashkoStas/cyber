<script lang="ts" setup>
import type { VueTelInputValidateData } from '~~/types/vue.tel.validate.data';

interface Props {
  modelValue: string;
  class?: string;
  placeholder: string;
  error?: string;
}

interface Emits {
  (event: 'update:modelValue', value: string): void
  (event: 'valid', value: VueTelInputValidateData): void
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
  Promise.all([
    import('vue-tel-input'),
    import('vue-tel-input/vue-tel-input.css'),
  ]).then(([{ VueTelInput }]) => VueTelInput),
);

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { selectionChanged } = useVibrate();

const model = computed({
  get: () => props.modelValue,
  set: (value: string) => emits('update:modelValue', value),
});

const parentClasses = computed(() => [
  'phone-input',
  props.class ?? '',
]);


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
        inputmode: 'tel'
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
    margin-top: 7px;
    padding: 14px 10px;
    border-radius: 10px;
    background: rgb(255 255 255 / 5%);
    font-size: 14px;
    line-height: 1.2;
    color: rgb(255 255 255 / 50%);
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
        width: calc(100vw - 40px);
        background-color: #29282a !important;
        border-radius: 10px !important;
        border: 1px solid rgba(255, 255, 255, 0.03) !important;
        left: unset;
        right: -10px;

        &.above,
        &.below {
          top: 48px;
          bottom: unset;
        }

        .vti__dropdown-item.highlighted {
          background-color: rgba($color: #815AEB, $alpha: 0.05);
        }
      }

      .vti__dropdown-arrow {
        display: none;
      }

      .vti__dropdown-item {
        padding: 10px 5px;
        font-size: 14px;
        color: #fff;

        .vti__flag {
          margin-right: 8px;
        }

        strong {
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
