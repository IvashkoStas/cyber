<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

type ErrorType = string | undefined;

interface Props {
  documentType: string;
  documentNumber: string;
  documentExpireDate: string;
  errors: [ErrorType, ErrorType];
}

interface Emits {
  (event: 'update:documentNumber' | 'update:documentExpireDate' | 'update:documentType', value: string): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const documentType = computed({
  get: () => props.documentType,
  set: (value: string) => emits('update:documentType', value),
});
const documentNumber = computed({
  get: () => props.documentNumber,
  set: (value: string) => emits('update:documentNumber', value),
});

const { t } = useI18n();

function getErrorText(index: number) {
  const error = props.errors[index];

  if (!error?.length) {
    return '';
  }

  return t(error);
}
</script>

<template>
  <div class="kyc-step__four">
    <KycPartDocument v-model="documentType" />
    <div class="step-four__fields">
      <UiInput
        v-model="documentNumber"
        :title="$t('kyc.steps.4.form.document_number.title')"
        :placeholder="$t('kyc.steps.4.form.document_number.placeholder')"
        :error="getErrorText(0)"
      />
      <!-- <UiInput
        v-model="documentExpireDate"
        inputmode="numeric"
        class="second-field"
        :title="$t('kyc.steps.4.form.document_expiry_date.title')"
        :placeholder="$t('kyc.steps.4.form.document_expiry_date.placeholder')"
        :error="getErrorText(1)"
        mask="##.##.####"
      /> -->
      <UiInputDate
        :error="getErrorText(1)"
        :date="documentExpireDate"
        class="second-field"
        @update:date="$emit('update:documentExpireDate', $event)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.kyc-step__four {
  max-width: 100vw;
  padding: 0 0 20px;

  .step-four {
    &__description {
      margin-top: 20px;
      font-size: 14px;
      line-height: 1.2;
      color: rgb(255 255 255 / 50%);
    }

    &__fields {
      margin-top: 20px;

      .second-field {
        margin-top: 20px;
      }
    }
  }
}
</style>
