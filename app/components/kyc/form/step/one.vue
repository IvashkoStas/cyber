<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { disableCountries } from '~/constants/disabled.countries';
import type { VueTelInputValidateData } from '~~/types/vue.tel.validate.data';

type ErrorType = string | undefined;

interface Props {
  email: string;
  disabledEmail: boolean;
  phoneData: Partial<VueTelInputValidateData>;
  errors: [ErrorType, ErrorType];
}

interface Emits {
  (event: 'update', data: VueTelInputValidateData): void;
  (event: 'update:email' | 'update:bdate', value: string): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const { t } = useI18n();
const { kyc } = useUser();

const phone = ref(kyc.value?.phone ?? '');

const email = computed({
  get: () => props.email,
  set: (value: string) => emits('update:email', value),
});

const showInfo = computed(() => disableCountries?.includes(props.phoneData?.country ?? ''));

function onPhoneValidate(data: VueTelInputValidateData) {
  emits('update', data);
}

function getErrorText(index: number) {
  const error = props.errors[index];

  if (!error?.length) {
    return '';
  }

  return t(error);
}
</script>

<template>
  <div class="kyc-step__one">
    <div class="step-one__fields">
      <UiInput
        v-model.trim="email"
        inputmode="email"
        type="email"
        :disabled="disabledEmail"
        :readonly="disabledEmail"
        :title="$t('kyc.steps.2.form.email.title')"
        :placeholder="$t('kyc.steps.2.form.email.placeholder')"
        :error="getErrorText(0)"
      />
      <div>
        <h2 class="step-one__title">
          {{ $t('kyc.steps.1.form.phone') }}
        </h2>
        <UiPhoneInput v-model="phone" title="title" :error="getErrorText(1)" :placeholder="$t('kyc.steps.1.form.phone')" @valid="onPhoneValidate" />
        <template v-if="showInfo">
          <h4 class="step-one__info-title">
            {{ $t('kyc.steps.1.info.title') }}
          </h4>
          <div class="step-one__info-description" v-html="$t('kyc.steps.1.info.description')" />
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.kyc-step__one {
  padding: 20px 0;

  .step-one {
    &__title {
      margin-bottom: 4px;
      font-size: 14px;
      line-height: 1.2;
    }

    &__fields {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    &__info {
      &-title {
        margin-top: 24px;
        font-size: 14px;
        line-height: 1.2;
        color: var(--input-color);
      }

      &-description {
        margin-top: 12px;
        font-size: 12px;
        line-height: 1.2;
        color: var(--input-placeholder);

        p {
          margin-top: 8px;
        }
      }
    }
  }
}
</style>
