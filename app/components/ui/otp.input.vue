<script lang="ts" setup>
interface Props {
  modelValue: string;
  digitsLength?: number;
  focus?: boolean;
  placeholder?: string;
}

interface Emits {
  (event: 'update:modelValue' | 'otp-success', value: string): string;
}

const props = withDefaults(defineProps<Props>(), {
  digitsLength: 4,
  focus: false,
  placeholder: '',
});

const emits = defineEmits<Emits>();

const digits = ref<string[]>(Array.from({ length: props.digitsLength }, (_, index) => props.modelValue[index] ?? ''));

watch(
  () => props.modelValue,
  (value) => {
    digits.value = Array.from({ length: props.digitsLength }, (_, index) => value[index] ?? '');
  },
);

const inputRefs = ref<HTMLInputElement[]>([]);

const handleInput = (index: number) => {
  if (!inputRefs.value[index]) {
    return;
  }

  if (String(inputRefs.value[index].value).length === props.digitsLength) {
    digits.value = inputRefs.value[index].value.split('');

    return;
  }

  if (digits.value[index] && index < digits.value.length - 1) {
    inputRefs.value[index + 1]?.focus();
  }
};

const handleBackspace = (index: number) => {
  if (!digits.value[index] && index) {
    inputRefs.value[index - 1]?.focus();
  }
};

const otpPlaceholder = computed<string[]>(() => {
  if (props.placeholder.length >= 6) {
    return props.placeholder.split('');
  }

  return ['0', '0', '0', '0', '0', '0'];
});

digits.value.forEach((_, index) => {
  watch(
    () => digits.value[index],
    (value) => {
      if (!value) {
        return;
      }

      if (!index && value.length === 4) {
        digits.value = value.split('');

        return;
      }
      if (value.length > 1 && digits.value[index]?.length) {
        digits.value[index] = digits.value[index]?.slice(0, 1);
      }
    },
  );
});

const isSuccess = shallowRef(false);

watch(
  () => digits.value,
  (value) => {
    const otp = value.join('');

    emits('update:modelValue', otp);

    if (otp.length === props.digitsLength) {
      isSuccess.value = true;
      emits('otp-success', otp);

      const timeout = setTimeout(() => {
        inputRefs.value.forEach((input) => input.blur());
        clearTimeout(timeout);
      });
    } else {
      isSuccess.value = false;
    }
  },
  { deep: true },
);

const pasteEvent = (event: ClipboardEvent) => {
  const target = event.target as HTMLInputElement;

  if (Number(target.dataset.index)) {
    emits('update:modelValue', '');

    return;
  }

  const value = event.clipboardData?.getData('text');

  if (value?.length) {
    if (inputRefs.value[0]?.value) {
      inputRefs.value[0].value = '';
    }

    inputRefs.value.forEach((input) => input.blur());
    emits('update:modelValue', value);
  }
};


watch(() => props.focus, (focus) => {
  if (!focus || props.modelValue.length) {
    return;
  }

  nextTick(() => inputRefs.value[0]?.focus());
}, { immediate: true });
</script>

<template>
  <div class="otp-container">
    <input
      v-for="(_, index) in digits"
      :key="index"
      ref="inputRefs"
      v-model="digits[index]"
      pattern="^[0-9]*$"
      min="0"
      max="9"
      :data-index="index"
      type="text"
      :autofocus="!index"
      inputmode="numeric"
      class="otp-input"
      :max-length="1"
      :placeholder="otpPlaceholder[index]"
      @paste="pasteEvent"
      @input="handleInput(index)"
      @keydown.backspace="handleBackspace(index)"
    />
  </div>
</template>

<style lang="scss" scoped>
.otp-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .otp-input {
    width: 47px;
    height: 62px;
    font-size: 40px;
    line-height: 56px;
    font-weight: 500;
    padding: 10px;
    border-radius: 10px;
    background: rgb(255 255 255 / 1%);
    outline: none;
    border: none;
    text-align: center;
    border: 1px solid transparent !important;
    transition: all 0.2s ease-out;

    &::placeholder {
      color: rgb(255 255 255 / 5%);
    }

    &:focus {
      border: 1px solid var(--link-color) !important;
      transition: all 0.2s ease-in;
    }
  }
}
</style>
