<script lang="ts" setup>
import { type MaskaDetail, type MaskInputOptions, MaskInput } from 'maska';


type MaskProp = string | MaskInputOptions

interface Props {
  modelValue: string;
  error?: string;
  title: string;
  class?: string;
  placeholder: string;
  mask?: string;
  type?: string;
  disabled?: boolean;
  readonly?: boolean;
  inputmode?: 'email' | 'tel' | 'none' | 'search' | 'url' | 'numeric' | 'decimal' | 'latin-name' | undefined;
  noUpper?: boolean;
}

interface Emits {
  (event: 'update:modelValue', value: string): void;
  (event: 'focus' | 'blur'): void;

}

defineOptions({
  inheritAttrs: false,
});


const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const inputEl = useTemplateRef('inputEl');

const model = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    const updateValue = !props.noUpper ? value?.toLocaleUpperCase() : value;
    emits('update:modelValue', updateValue);
  },
});

const parentClasses = computed(() => [
  'new-input',
  props.class ?? '',
]);

const maskInput = ref<MaskInput | undefined>();

watch(
  () => [inputEl.value, props.mask],
  ([input, mask]) => {
    maskInput.value?.destroy();
    maskInput.value = undefined;
    if (!input || !mask) {
      return;
    }

    maskInput.value = new MaskInput(input as HTMLInputElement, maskPropToMaskOptions(mask as MaskProp));
  },
  { immediate: true },
);

function maskPropToMaskOptions(mask: MaskProp): MaskInputOptions {
  if (typeof mask === 'string') {
    return { mask };
  }

  return mask;
}

function handleMaska(event: CustomEvent<MaskaDetail>) {
  const { value } = event.target as HTMLInputElement;
  if (value === props.modelValue) {
    return;
  }
  emits('update:modelValue', value);
}

function onEnterClick(event: Event) {
  const target = event.target as HTMLInputElement;
  target?.blur();
}

function onPaste(event: ClipboardEvent) {
  const paste = event.clipboardData?.getData('text');

  if (paste?.length) {
    const updatePaste = !props.noUpper ? paste?.toLocaleUpperCase() : paste;
    emits('update:modelValue', updatePaste);
  }
}

const fieldType = shallowRef(props.type);


/* function onShowPassword() {
  if (props.type !== 'password') {
    return;
  }

  fieldType.value =  fieldType.value === 'password' ? 'text' : 'password';
} */
</script>

<template>
  <div :class="parentClasses">
    <p class="new-input__title">{{ title }}</p>
    <input
      ref="inputEl"
      v-bind="props"
      v-model="model"
      :inputmode="inputmode"
      :type="fieldType"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      class="new-input__input"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @mask="handleMaska"
      @paste.prevent="onPaste"
      @keydown.enter="onEnterClick"
    >
    <small v-if="error?.length" class="new-input__error">{{ error }}</small>
  </div>
</template>

<style lang="scss" scoped>
.new-input {
  width: 100%;
  position: relative;

  &__title {
    font-size: 14px;
    line-height: 1.2;
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
