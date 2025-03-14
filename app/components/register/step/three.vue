<script lang="ts" setup>
import { useI18n } from 'vue-i18n';



type ErrorMessage = string | undefined
interface Props {
  password: string;
  confirmPassword: string;
  errors: ErrorMessage[];
}

interface Emits {
  (event: 'update:password' | 'update:confirmPassword', value: string): void;
}


const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { t } = useI18n();

const passwordModel = computed({
  get: () => props.password,
  set: (value: string) => emits('update:password', value),
});

const confirmPasswordModel = computed({
  get: () => props.confirmPassword,
  set: (value: string) => emits('update:confirmPassword', value),
});


function getError(index: number) {
  const error = props.errors[index];

  if (!error?.length) {
    return;
  }

  return t(error);
}
</script>

<template>
  <div class="register-step-three">
    <p class="register-step-three__description">{{ $t('registerScreen.steps.3.subtile') }}</p>
    <ul class="register-step-three__rules">
      <li v-for="index in 5" :key="index">
        {{ $t(`registerScreen.steps.3.description.${index - 1}`) }}
      </li>
    </ul>
    <UiInput
      v-model="passwordModel"
      type="password"
      class="register-step-three__input"
      :title="$t('registerScreen.steps.3.password.title')"
      :placeholder="$t('registerScreen.steps.3.password.placeholder')"
      :error="getError(0)"
      no-upper
    />
    <UiInput
      v-model="confirmPasswordModel"
      type="password"
      class="register-step-three__input"
      :title="$t('registerScreen.steps.3.confirmPassword.title')"
      :placeholder="$t('registerScreen.steps.3.confirmPassword.placeholder')"
      :error="getError(1)"
      no-upper
    />
  </div>
</template>

<style lang="scss">
.register-step-three {
  display: flex;
  flex-direction: column;
  gap: 5px;

  &__rules {
    font-size: 14px;
    color: rgba($color: #fff, $alpha: 0.5);
    list-style: initial;
    padding-left: 20px;
  }

  &__input {
    margin-top: 20px;
  }
}
</style>