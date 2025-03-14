<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { Keys } from '~/constants/keys';

interface Props {
  modelValue: string;
  focus: boolean;
  email: string;
}

interface Emits {
  (event: 'update:modelValue' | 'otp-success', value: string): string;
  (event: 'resend-code'): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { t } = useI18n();

const timer = shallowRef('');
const endTime = useCookie(Keys.REGISTER_EMAIL_END_TIME);
const showResend = shallowRef(false);


const resendButtonText = computed(
  () => timer.value.length ? t('registerScreen.steps.2.resendWithTime', { time: timer.value }) : t('registerScreen.steps.2.resend'),
);

const code = computed({
  get: () => props.modelValue,
  set: (value: string) => emits('update:modelValue', value),
});

const interval = shallowRef<Nullable<NodeJS.Timer>>(null);

onMounted(() => {
  setTimeout(() => {
    showResend.value = true;
  }, 1000);
});

watch(
  () => Number(endTime.value),
  (endTimeValue) => {
    if (endTimeValue === null) {
      return;
    }
    interval.value = setInterval(() => {
    const time = endTimeValue - Date.now();
    if (time >= 0) {
      const seconds = String(Math.floor(time / 1000)).padStart(2, '0');
      timer.value = `00:${seconds}`;
    } else {
      clearInterval(interval.value as unknown as number);
      interval.value = null;
      timer.value = '';
      endTime.value = null;
    }
  }, 1000);
  },
  { immediate: true },
);

function resendCode() {
  emits('resend-code');
}

function otpSuccess(value: string) {
  emits('otp-success', value);
}
</script>

<template>
  <div class="register-step-two">
    <p class="register-step-two__description">{{ $t('registerScreen.steps.2.email') }}</p>
    <p class="register-step-two__email">{{ email }}</p>
    <UiOtpInput
      v-model="code"
      :focus="focus"
      :digits-length="6"
      class="register-step-two__input"
      @otp-success="otpSuccess"
    />
    <Transition name="fade" mode="out-in">
      <button
        v-if="showResend"
        :disabled="!!timer.length"
        class="register-step-two__resend"
        @click="resendCode"
      >
        {{ resendButtonText }}
      </button>
    </Transition>
  </div>
</template>

<style lang="scss">
.register-step-two {
  &__description {
    font-size: 14px;
    line-height: 1.2;
    text-align: center;
    color: rgba($color: #fff, $alpha: 0.5);
  }

  &__email {
    margin: 5px 0 20px;
    text-align: center;
  }

  &__input {
    justify-content: center;
  }

  &__resend {
    display: block;
    margin: 20px auto 0;
    outline: none;
    background: transparent;
    border: none;
    font-size: 14px;
    line-height: 1.2;
    text-align: center;
    color: var(--link-color);
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
