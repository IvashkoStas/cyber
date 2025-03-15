<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { useI18n } from 'vue-i18n';
import { AppRoutes } from '~/constants/app.route';
import { KycStatus } from '~~/types/kys.status';

const UPDATE_USER_TIMER = 15000;

definePageMeta({
  middleware: ['kyc'],
});

const { t } = useI18n();
const { showPromoToggle, promoCode, promoCodeAC, applyPromoCode } = usePromoCode();
const { isHaveMoneyWithRef, cardPrice, toggleDrawers, drawers, theme, getMainButtonProps } = useShared();
const { user, getUser } = useUser();
const { onRequestCard } = useCards();
const { showAlert } = usePopup();

const themeKey = computed(() => theme.colorScheme.value);
const sending = shallowRef(false);
const data = reactive({
  promocode: !showPromoToggle.value ? (promoCode.value?.code ?? '') : '',
});

const rules = {
  promocode: {
    required,
  },
};

const v = useVuelidate(rules, data);

const messageData = reactive({
  state: !showPromoToggle.value ? 'success' : 'error',
  message: !showPromoToggle.value ? t('shared.successPromo') : '',
});

const isCardRequest = shallowRef(false);
const disabledAction = computed(() => v.value.$invalid || sending.value);
const disabledRequestCard = computed(() => isCardRequest.value || user.value?.kyc?.status !== KycStatus.ADOPT_PASS);
const input = useTemplateRef('input');

async function handleKycAction() {
  if (!isHaveMoneyWithRef.value) {
    return await navigateTo(AppRoutes.ADD_USDT);
  }

  try {
    isCardRequest.value = true;
    await onRequestCard();
    await getUser();
    navigateTo(AppRoutes.CARDS);
  } catch (error: FetchCTX) {
    showAlert(error ?? t('shared.labels.error'));
  } finally {
    isCardRequest.value = false;
  }
}

async function handlePromoCodeAction() {
  if (showPromoToggle.value) {
    toggleDrawers('promo', true);
    setTimeout(() => {
      input.value?.focus();
    }, 200);

    return;
  }
}

async function handleApply() {
  if (!data.promocode.length) {
    return;
  }

  try {
    sending.value = true;

    await applyPromoCode(data.promocode);

    messageData.state = 'success';
    messageData.message = t('shared.successPromo');
  } catch (error: FetchCTX) {
    messageData.state = 'error';
    messageData.message = error.data.message;
  } finally {
    sending.value = false;
    toggleDrawers('promo');
  }
}

function onCancel() {
  promoCodeAC.value?.abort();
  toggleDrawers('promo');
}

async function goWallet() {
  return await navigateTo(AppRoutes.WALLET);
}

const updateUserInterval = shallowRef<Nullable<NodeJS.Timeout>>(null);
const isVisible = shallowRef(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  });
  updateUserInterval.value = setInterval(() => {
    clearUpdateUserInterval();
    getUser();
  }, UPDATE_USER_TIMER);
});

onBeforeUnmount(() => {
  isVisible.value = false;
  clearUpdateUserInterval();
});

function clearUpdateUserInterval() {
  if (user.value?.kyc?.status === KycStatus.ADOPT_PASS && updateUserInterval.value) {
    clearInterval(updateUserInterval.value);
    updateUserInterval.value = null;
  }
}

const mainButtonText = computed(() => {
  if (!cardPrice.value) {
    return t('shared.cardFree');
  }
  if (!isHaveMoneyWithRef.value) {
    return t('requestCard.addBalance');
  }

  return t('requestCard.pay', { price: `${cardPrice.value.toFixed(2)}$` });
});

watch(
  () => v.value.promocode.$model,
  (value) => {
    v.value.promocode.$model = value.toLocaleUpperCase();
  },
);

function pastePromo(event: ClipboardEvent) {
  const paste = event.clipboardData?.getData('text');

  if (paste?.length) {
    v.value.promocode.$model = paste.toLocaleUpperCase();
  }
}
</script>

<template>
  <div class="buy-card__page px-4 pb-[20px] pt-[30px]">
    <UiCustomBackButton :visible="isVisible" @click="goWallet" />
    <!-- <SharedInfo
      v-if="showSharedInfoForKyc"
      class="mt-[30px]"
      :text="$t('requestCard.kycCheck')"
      :status="Status.SUCCESS"
    /> -->

    <SharedKycInfo />

    <Transition name="fade">
      <section v-if="user?.kyc?.status === KycStatus.ADOPT_PASS" class="promo-section">
        <div class="promo" @click="handlePromoCodeAction">
          <input :value="v.promocode.$model" class="promo-input" readonly :placeholder="$t('requestCard.enterCode')" />
          <div class="promo-info" :class="messageData.state">
            {{ messageData.message }}
          </div>
        </div>
        <div class="card-price">
          {{ $t('requestCard.cardPrice') }}
          <span>
            {{ `${cardPrice.toFixed(2)}$` }}
          </span>
        </div>
      </section>
    </Transition>
    <UiOverlay :show="drawers.promo" @close="onCancel">
      <div v-if="drawers.promo" class="promo-overlay">
        <div class="promo-wrapper">
          <div class="promo" @click.stop="handlePromoCodeAction">
            <input
              ref="input"
              v-model="v.promocode.$model"
              class="promo-input"
              :placeholder="$t('requestCard.enterCode')"
              @paste.prevent="pastePromo"
              @keydown.enter="handleApply"
            />
          </div>
          <UiButton :disabled="disabledAction" theme action @click.stop="handleApply">
            {{ $t('requestCard.enterCode') }}
          </UiButton>
        </div>
      </div>
    </UiOverlay>
    <!-- <button @click="handleKycAction">t</button> -->
    <UiCustomMainButton
      v-bind="getMainButtonProps(disabledRequestCard || drawers.promo)"
      :key="themeKey"
      :visible="isVisible && user?.kyc?.status === KycStatus.ADOPT_PASS"
      :text="mainButtonText"
      @click="handleKycAction"
    />
  </div>
</template>

<style lang="scss" scoped>
.buy-card__page {
  margin-top: 0 !important;
  display: flex;
  flex-direction: column;
}

.promo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 0 15px;
  margin-top: 40px;
  border-radius: 0;
  border-bottom: 1px solid #fff;
  font-size: 14px;
  line-height: 1.2;

  &-section {
    max-width: 360px;
    width: 100%;
    margin: 0 auto;
  }

  &-input {
    background: transparent;
    border: none;
    outline: none;
    width: calc(100% - 110px);
    font-size: 15px;
    line-height: 1.2;
    color: #fff;
  }

  &-info {
    width: 100px;
    font-size: 10px;
    font-weight: 400;
    line-height: 1.2;
    text-align: right;

    &.error {
      color: #ff2e2e;
    }

    &.success {
      color: #4ec68d;
    }
  }
}

.card-price {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);

  span {
    position: relative;
    top: -12px;
    font-size: 42px;
    font-weight: 600;
    color: #fff;
  }
}

.promo-overlay {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.promo-wrapper {
  padding: 30px 20px 20px;
  background-color: #080808;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
