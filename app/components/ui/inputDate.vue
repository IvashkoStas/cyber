<script lang="ts" setup>
type ErrorType = string | undefined;

interface Props {
  date: string;
  error: ErrorType;
}

interface Emits {
  (event: 'update:date', value: string): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const day = ref('');
const month = ref('');
const year = ref('');

if (props.date) {
  const [d, m, y] = props.date.split('.');
  day.value = d || '';
  month.value = m || '';
  year.value = y || '';
}

const autofocus = ref({
  month: false,
  year: false,
});

watch([day, month, year], ([d, m, y]) => {
  autofocus.value.month = d.length === 2 && m.length !== 2;
  autofocus.value.year = m.length === 2 && y.length !== 4;

  emits('update:date', `${d}.${m}.${y}`);
});
</script>

<template>
  <div class="inputs">
    <UiInput
      v-model="day"
      :title="$t('kyc.steps.2.form.date_of_birth.title')"
      inputmode="numeric"
      :maxlength="2"
      :placeholder="$t('kyc.steps.2.form.date_of_birth.1.placeholder')"
    />
    <UiInput
      v-model="month"
      :autofocus="autofocus.month"
      :title="''"
      inputmode="numeric"
      :maxlength="2"
      :placeholder="$t('kyc.steps.2.form.date_of_birth.2.placeholder')"
    />
    <UiInput
      v-model="year"
      :autofocus="autofocus.year"
      :title="''"
      inputmode="numeric"
      :maxlength="4"
      :error="$t(error || '')"
      :placeholder="$t('kyc.steps.2.form.date_of_birth.3.placeholder')"
    />
  </div>
</template>

<style lang="scss" scoped>
.inputs {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 4px;

  .new-input {
    :deep(input) {
      text-align: center;
    }

    &:last-of-type {
      min-width: 40%;
      position: static;
    }
  }
}
</style>
