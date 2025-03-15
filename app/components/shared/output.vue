<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { useI18n } from 'vue-i18n';
import { AppRoutes } from '~/constants/app.route';
import { maxAmount, required } from '~/utils/validators';
import { BalanceSymbol, type Balance } from '~~/types/balance';
import { From } from '~~/types/from';
import { Network } from '~~/types/network';
import type { WithdrawDto } from '~~/types/withdraw.dto';
import CustomUiCustomBackButton from '../ui/custom.back.button.vue';
;

const props = defineProps<{ from: From }>();

definePageMeta({
  middleware: 'onboard',
});

const ethBnbRegex = /^0x[a-fA-F0-9]{40}$/;
const trxRegex = /^T[a-zA-Z0-9]{33}$/;

const { t } = useI18n();

const { showAlert } = usePopup();
const { user, balance, getUser } = useUser();
const { sendWalletWidthdraw, sendWalletWidthdrawEstimate } = useWallet();
const { allowNetworks, getMainButtonProps } = useShared();
const { bonusBalance, getReferral } = useReferral();
const { setting } = useSetting();

const selectedNetworkIndex = shallowRef(0);
const selectedNetwork = computed(() => selectedBalance.value?.network);

const balances = computed(() => user.value?.wallet.balances.filter(balancesFilter));
const selectedBalance = computed(() => balances.value?.at(selectedNetworkIndex.value));

function balancesFilter(b: Balance) {
  if (!setting.value?.WITHDRAW_NETWORKS?.includes(b.network)) {
    return false;
  }
  if (b.network !== Network.INTERNAL) {
    if (props.from === From.REF) {
      return b.symbol === BalanceSymbol.USD_REF;
    }

    if (props.from === From.WALLET) {
      return b.symbol === BalanceSymbol.USDT;
    }
  }

  return false;
}

const data = reactive({
  amount: '',
  toAddress: '',
  network: computed(() => selectedNetwork.value),
  symbol: computed(() => selectedBalance.value?.symbol),
});

const memo = ref('');

const title = computed(() => props.from === From.WALLET ? 'walletOutput.title' : 'walletOutput.titleRef');
const balanceByFrom = computed(() => props.from === From.WALLET ? balance.value : bonusBalance.value);
const nameByFrom = computed(() => selectedBalance.value?.network ? `${t('toFrom.from')} ${selectedBalance.value?.network?.toLocaleUpperCase()}` : t('toFrom.fromWallet'));

const widthdrawAmount = shallowRef<Nullable<string>>(null);

const sending = shallowRef(false);
const numberAmount = computed(() => Number(data.amount ?? 0));
const body = computed(() => ({
  ...data,
  network: selectedNetwork.value,
  amount: numberAmount.value,
  balanceId: selectedBalance.value?.id,
} as WithdrawDto));

const max = computed(() => selectedBalance.value?.amount ?? 0);

const rules = reactive({
  amount: {
    required,
    maxAmount: computed(() => maxAmount(max.value)),
  },
  toAddress: {
    required,
  },
});

const $externalResults = reactive({
  amount: '',
  toAddress: '',
});

const v = useVuelidate(rules, data, { $externalResults });

const hideInfo = computed(() => widthdrawAmount.value === null || Number(balanceByFrom.value) < numberAmount.value);

const sendEstimateDisabled = computed(() => v.value.$invalid || Number(balanceByFrom.value) < numberAmount.value);
const sendDisable = computed(() => sending.value || sendEstimateDisabled.value);

watch(selectedNetworkIndex, networkWatcher);
watch(() => data.amount, amountWatcher);
watch(
  () => [data.toAddress, selectedNetworkIndex.value],
  toAddressWatcher,
);

async function onUpdate() {
  const action = props.from === From.WALLET ? getUser : getReferral;
  await action();
  await getUser();
}

function networkWatcher() {
  if (!v?.value?.toAddress.$model.length) {
    return;
  }

  v.value.toAddress.$validate();
}

function toAddressWatcher([address, networkIndex]: (string | number | undefined)[]) {
  if (!String(address)?.length) {
    $externalResults.toAddress = '';

    return;
  }

  const network = balances.value?.[Number(networkIndex)]?.network;

  if (network === Network.TRX && !trxRegex.test(String(address))) {
    $externalResults.toAddress = 'shared.labels.networkAddress';

    return;
  }

  if ([Network.BNB, Network.ETH]?.includes(network as Network) && !ethBnbRegex.test(String(address))) {
    $externalResults.toAddress = 'shared.labels.networkAddress';

    return;
  }

  $externalResults.toAddress = '';
}

function amountWatcher() {
  $externalResults.amount = '';

  if (sendEstimateDisabled.value) {
    widthdrawAmount.value = null;

    return;
  }

  sendWalletWidthdrawEstimate(body.value)
    .then((w) => widthdrawAmount.value = w)
    .catch((error: FetchCTX) => $externalResults.amount = error.data.message);
}

function getError(key: keyof typeof rules) {
  const error = v.value[key].$errors[0]?.$message?.toString();

  if (!error) {
    return;
  }

  return t(error, { balance: max.value });
}

async function onSendWalletWidthdraw() {
  try {
    sending.value = true;
    const newBody = {
      ...body.value,
    ...(selectedNetwork.value === Network.TON && memo.value.length ? { memo: memo.value } : {}),
    };
    await sendWalletWidthdraw(newBody);
    await onUpdate();

    data.amount = '';
    data.toAddress = '';
    memo.value = '';
    widthdrawAmount.value = null;

    v.value.$reset();

    showAlert(t('walletOutput.message'));
  } catch(error: FetchCTX) {
    if (error?.data?.message?.length) {
      showAlert(error?.data?.message);
    }
  } finally {
    sending.value = false;
  }
}

function changeFrom() {
  data.symbol = props.from === From.WALLET ? BalanceSymbol.USDT : BalanceSymbol.USD_REF;
}
</script>

<template>
  <div class="wallet-output h-full px-5 pb-[50px] pt-[30px]">
    <CustomUiCustomBackButton @click="$router.replace(AppRoutes.WALLET)" />
    <div class="wallet-output__header">
      <h2 class="wallet-output__title">
        {{ $t(title) }}
      </h2>
    </div>
    <div class="place palace-wallet place--first" @click="changeFrom">
      <div class="place-header">
        {{ $t(nameByFrom) }}
      </div>
      <div class="place-footer">
        <div class="place-footer__price">{{ formatPrice(selectedBalance?.amountUSD ?? 0) }}</div>
        <div class="place-footer__currency">USDT</div>
      </div>
    </div>
    <div class="wallet-output__form">
      <div v-if="allowNetworks?.length" class="form-network">
        <p class="form-network__title">
          {{ $t('walletOutput.fields.network') }}
        </p>
        <SharedSelectNetwork
          v-model="selectedNetworkIndex"
          :inbox-networks="balances"
        />
      </div>
      <UiInput
        v-model.trim="v.toAddress.$model"
        :title="$t('walletOutput.fields.walletNumber')"
        :placeholder="$t('walletOutput.fields.walletNumberPlaceholder')"
        :error="getError('toAddress')"
        class="form-field"
        no-upper
      />
      <UiInput
        v-if="props.from === From.WALLET && selectedNetwork === Network.TON"
        v-model.trim="memo"
        title="MEMO/TAG"
        placeholder="MEMO/TAG"
        class="form-field"
        no-upper
      />
      <UiInput
        v-model.trim="v.amount.$model"
        :title="$t('walletOutput.fields.equal')"
        :placeholder="$t('walletOutput.fields.equalPlaceholder')"
        :error="getError('amount')"
        class="form-field"
        inputmode="numeric"
      />
    </div>
    <div class="wallet-output__footer">
      <div class="footer-info">
        <Transition name="fade">
          <div
            v-if="!hideInfo"
            class="wallet-output__receive"
          >
            <span>{{ $t('walletOutput.receive') }}</span>
            <span>{{ formatPrice(widthdrawAmount ?? 0) }}{{ selectedBalance?.symbol ?? '$' }}</span>
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="!hideInfo" class="wallet-output__commission">
            <span>{{ $t('walletOutput.commission') }}</span>
            <span>{{ formatPrice(numberAmount - Number(widthdrawAmount ?? 0)) }}{{ selectedBalance?.symbol ?? '$' }}</span>
          </div>
        </Transition>
      </div>
      <UiCustomMainButton
        v-bind="getMainButtonProps(sendDisable)"
        :text="$t('shared.actions.out')"
        :progress="sending"
        @click="onSendWalletWidthdraw"
      />
    </div>
  </div>
</template>

<style lang="scss">
.wallet-output {
  height: min-content;

&__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  &__title {
    flex: 0 0 75%;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.2;
  }

  .place {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px;
    border-radius: var(--radius);
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

  &__form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;

    .form-network {
      &__title {
        margin-bottom: 7px;
        font-size: 14px;
        line-height: 1.2;
        color: #fff;
      }
    }
  }

  &__footer {
    margin-top: 15px;

    .footer-info {
      height: 50px;
    }
  }

  &__receive {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.2;
    color: #fff;
  }

  &__commission {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    color: rgba($color: #fff, $alpha: 0.5);
  }
}
</style>