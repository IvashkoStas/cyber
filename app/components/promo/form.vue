<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { useI18n } from 'vue-i18n';
import { required } from '~/utils/validators';

const { t } = useI18n();
const toast = useToast();
const { drawers, toggleDrawers } = useShared();
const { promoCodeAC, applyPromoCode } = usePromoCode();

const sending = shallowRef(false);
const data = reactive({
  promocode: '',
});

const rules = {
  promocode: {
    required,
  },
};

const v = useVuelidate(rules, data);

const disabledAction = computed(() => v.value.$invalid || sending.value);
const error = computed(() => {
  if (v.value.$errors.length) {
    const message = v.value.$errors[0]?.$message.toString();

    // return message ? t(message) : undefined;
  }

  return undefined;
});

function handleCancel() {
  promoCodeAC.value?.abort();
  toggleDrawers('promo', false);
}

async function handleApply() {
  if (!data.promocode.length) {
    return;
  }

  try {
    sending.value = true;

    await applyPromoCode(data.promocode);
    toast(t('shared.labels.success'), {
      type: 'success',
    });
    handleCancel();
  } catch(error: FetchCTX) {
    toast(error?.data?.message ?? t('shared.labels.error'), {
      type: 'error',
    });
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <UiDrawer :show="drawers.promo">
    <div class="promo">
      <h2 class="promo-title">
        {{ $t('requestCard.enterCode') }}
      </h2>
      <div class="promo-body">
        <UiInput
          v-model="v.promocode.$model"
          :title="$t('promoCode.title')"
          :placeholder="$t('promoCode.placeholder')"
          :error="error"
        />
      </div>
      <div class="promo-actions">
        <UiButton
          simple
          class="btn"
          @click="handleCancel"
        >
          {{ $t('shared.actions.cancel') }}
        </UiButton>
        <UiButton
          action
          class="btn"
          :disabled="disabledAction"
          @click="handleApply"
        >
          {{ $t('shared.actions.apply') }}
        </UiButton>
      </div>
    </div>
  </UiDrawer>
</template>

<style lang="scss" scoped>
.promo {
  min-height: 50vh;

  &-title {
    font-size: 20px;
    font-weight: 400;
    line-height: 24.38px;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }

  &-body {
    margin-top: 10px;
  }

  &-actions {
    margin-top: 68px;
    display: flex;
    align-items: center;
    gap: 10px;

    .btn {
      flex: 0 0 calc(50% - 5px);
    }
  }
}
</style>