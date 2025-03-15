<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { AppRoutes } from '~/constants/app.route';
import { BalanceSymbol } from '~~/types/balance';

enum From {
  REF = 'ref',
  WALLET = 'wallet',
}


definePageMeta({
  middleware: ['card'],
});


const options = [
  {
    title: 'toFrom.fromWallet',
    value: From.WALLET,
  },
  {
    title: 'toFrom.fromRef',
    value: From.REF,
  },
];

const dropMenuTitle = ref<string>(options[0]?.title ?? '');

const { t } = useI18n();
const route = useRoute();
const toast = useToast();
const { balance, getUser } = useUser();
const { bonusBalance, getReferral } = useReferral();
const {
  card,
  getCardById,
  onTopUpCard,
  sendCardReplenishEstimate,
} = useCards();

const { user } = useUser();
const { minAmountReplenishment, cardReplenishPercent, cardReplenishMinTax } = useSetting();
const { getMainButtonProps } = useShared();

const percent = computed(() => user.value?.partner?.taxPercentTopUp ?? cardReplenishPercent.value);

const from = shallowRef<From>(From.WALLET);
const balanceByFrom = computed(() => from.value === From.WALLET ? balance.value : bonusBalance.value);
const nameByFrom = computed(() => from.value === From.WALLET ? 'toFrom.fromWallet' : 'toFrom.fromRef');


await getCardById(Number(route.params.id));

const error = shallowRef('');
const amount = ref('');
const selectedBalance = computed(() => dropMenuTitle.value === options[0]?.title ? balance.value : bonusBalance.value);
const numberAmount = computed(() => Number(amount.value ?? 0));
const isHaveMoney = computed(() => selectedBalance.value >= numberAmount.value);
const isDepositCardLoading = shallowRef(false);
const estimate = shallowRef<Nullable<string>>(null);

watch(numberAmount, (a) => {
  if (a < minAmountReplenishment.value) {
    error.value = t('shared.labels.minAmountWithAmount', { amount: minAmountReplenishment. value });
  }
});

const topUpAmount = computed(() => {
  if (numberAmount.value <= 0 || Number.isNaN(numberAmount.value)) {
    return 'XX XXX$';
  }

  // if (!isHaveMoney.value) {
  //   return 'XX XXX$';
  // }

  if (numberAmount.value < minAmountReplenishment.value) {
    return 'XX XXX$';
  }

  if (estimate.value !== null) {
    return `${formatPrice((estimate.value ?? ''))}$`;
  }

  return 'XX XXX$';
});

const buttonText = computed(() => {
  if (isHaveMoney.value && balanceByFrom.value >= minAmountReplenishment.value) {
    return t('requestCard.pay');
  }

  if (dropMenuTitle.value === options[1]?.title) {
    return t('requestCard.pay');
  }

  return t('requestCard.addBalance');
});

const disabledButton = computed(() => {
  if (from.value === From.REF && balanceByFrom.value < numberAmount.value) {
    return true;
  }

  if (isDepositCardLoading.value) {
    return true;
  }

  if (Number.isNaN(numberAmount.value)) {
    return true;
  }


  if (numberAmount.value < minAmountReplenishment.value) {
    return true;
  }

  return false;
});

watch(() => [amount.value, from.value], amountWatcher);

async function onUpdate() {
  const action = from.value === From.WALLET ? getUser : getReferral;
  await action();
}

async function handleTopUpCard() {
  if (!isHaveMoney.value) {
    return navigateTo(AppRoutes.ADD_USDT);
  }

  isDepositCardLoading.value = true;

  try {
    await onTopUpCard(Number(route.params.id), {
      amount: numberAmount.value,
      symbol: from.value === From.WALLET ? BalanceSymbol.USDT : BalanceSymbol.USD_REF,
    });

    amount.value = '';
    await onUpdate();
    navigateTo(`${AppRoutes.CARDS}`);
  } catch(error: FetchCTX) {
    toast(error ?? t('shared.labels.error'));
  } finally {
    isDepositCardLoading.value = false;
  }
}

function amountWatcher() {
  if (numberAmount.value <= 0 || Number.isNaN(numberAmount.value)) {
    estimate.value = null;

    return;
  }

  // if (!isHaveMoney.value) {
  //   estimate.value = null;

  //   return;
  // }

  sendCardReplenishEstimate(
    Number(route.params.id),
    {
      amount: numberAmount.value,
      symbol: from.value === From.WALLET ? BalanceSymbol.USDT : BalanceSymbol.USD_REF,
    })
    .then((w) => {
      estimate.value = w;
      if (numberAmount.value >= minAmountReplenishment.value) {
        error.value = '';
      }
    })
    .catch(({ data }: FetchCTX) => error.value = data.message);
}

function onSelectFrom(value: From) {
  from.value = value;
  dropMenuTitle.value = options.find((o) => o.value === value)?.title ?? '';
}
</script>

<template>
  <div class="px-5 pb-[120px] pt-[30px]">
    <UiCustomBackButton @click="$router.back" />
    <div class="up-card">
      <div class="up-card__places">
      <UiDropMenu :title="$t(dropMenuTitle)" big>
        <UiDropMenuItem
          v-for="({ title, value }) in options"
          :key="value"
          :selected="value === from"
          :title="$t(title)"
          @click="onSelectFrom(value)"
        />
      </UiDropMenu>
      <div class="place palace-wallet place--first">
        <div class="place-header">
          {{ $t(nameByFrom) }}
        </div>
        <div class="place-footer">
          <div class="place-footer__price">{{ formatPrice(balanceByFrom) }}</div>
          <div class="place-footer__currency">USDT</div>
        </div>
      </div>
      <div class="place palace-card">
        <div class="place-header">
          {{ $t('toFrom.toCard') }}
        </div>
        <div class="place-footer">
          <div class="place-footer__price">
            {{ formatPrice(card?.balance ?? 0) }}
          </div>
          <div class="place-footer__currency">USDT</div>
        </div>
      </div>
    </div>
    <div class="input-wrapper">
      <input
        v-model="amount"
        class="up-card__input"
        inputmode="numeric"
        :readonly="isDepositCardLoading"
        :placeholder="$t('card.enterAmount')"
      >
      <small v-if="error?.length" class="input-error">{{ error }}</small>
    </div>
    <div class="up-card__info">
      <h2 class="info-title">
        {{ $t('drawers.depositCard.info.title', { amount: topUpAmount }) }}
      </h2>
      <p class="info-description">
        {{ $t('drawers.depositCard.info.description', { min: cardReplenishMinTax, percent }) }}
      </p>
    </div>
    <section class="up-card__action">
      <UiCustomMainButton
        v-bind="getMainButtonProps(disabledButton)"
        :progress="isDepositCardLoading"
        :text="buttonText"
        @click="handleTopUpCard"
      />
    </section>
    </div>
  </div>
</template>

<style lang="scss">
.up-card {
  min-height: 100dvh;
  height: min-content;
  // display: flex;
  // flex-direction: column;

  &__places {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .place {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 15px;
      border-radius: 15px;
      background: var(--bg-block);

      &--first {
        background: var(--accent-block);
      }

      &-header {
        font-size: 14px;
      }

      &-footer {
        display: flex;
        align-items: baseline;
        gap: 8px;

        &__price {
          font-size: 34px;
          font-weight: 500;
        }

        &__currency {
          font-size: 18px;
          font-weight: 200;
        }
      }
    }
  }

  .input-wrapper {
    position: relative;
  }

  .input-error {
    position: absolute;
    left: 0;
    bottom: -18px;
    font-size: 10px;
    line-height: 1.2;
    color: #BB2D2D;
  }

  &__input {
    display: block;
    width: 100%;
    padding: 0 0 15px;
    margin-top: 40px;
    border-radius: 0;
    background: transparent;
    outline: none;
    border-bottom: 1px solid #fff;
    font-size: 15px;
    line-height: 1.2;
    text-align: left;
  }

  &__info {
    margin-top: 25px;

    .info-title {
      font-size: 13px;
      font-weight: 500;
      line-height: 1.2;
      color: rgb(255 255 255 / 60%);
    }

    .info-description {
      margin-top: 7px;
      font-size: 13px;
      line-height: 1.2;
      text-align: left;
      color: rgb(255 255 255 / 50%);
    }
  }

  &__action {
    margin-top: 50px;
  }
}
</style>