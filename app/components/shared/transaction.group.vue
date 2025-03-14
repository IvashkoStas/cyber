<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import ArrowNextIcon from '~/assets/icons/arrows/arrow-next.svg';
import type { AppRoutes } from '~/constants/app.route';
import { getTransactionTime } from '~/utils/transactions';
import type { Transaction, TransactionTime, TransactionWithTime, Tx } from '~~/types/tx';
import { TransactionType } from '~~/types/tx';


type Entity = 'wallet' | 'card' | 'ref';
type TransactionEntityStatus = Record<string, 'in' | 'out'>

interface Props {
  entity?: Entity;
  loadMore?: boolean;
  to?: Nullable<AppRoutes | string>;
  linkTitle?: string;
  showLink?: boolean;
  showGroupTitle?: boolean;
  cardId?: Nullable<number>;
}

const props = withDefaults(defineProps<Props>(), {
  entity: 'wallet',
  loadMore: false,
  to: null,
  linkTitle: '',
  showLink: true,
  showGroupTitle: true,
  cardId: null,
});

const { t } = useI18n();
const { impactOccurred } = useVibrate();
const { getTransactions } = useShared();
const tx = ref<Tx>();
const observer = shallowRef<Nullable<IntersectionObserver>>(null);
const loading = shallowRef(false);
const loadMoreRef = useTemplateRef('load-more');

const transactionStatuses: Record<Entity, TransactionEntityStatus> = {
  wallet: {
    [TransactionType.INPUT]: 'in',
    [TransactionType.OUTPUT]: 'out',
    [TransactionType.TRANSFER_IN]: 'in',
    [TransactionType.TRANSFER_OUT]: 'out',
    [TransactionType.BUY_CARD]: 'out',
    // [TransactionType.FEE]: 'out',
    [TransactionType.TO_WALLET]: 'in',
  },
  card: {
    [TransactionType.REFUND]: 'in',
    [TransactionType.TOP_UP]: 'in',
    [TransactionType.REPAY]: 'out',
    [TransactionType.CHARGE]: 'out',
    [TransactionType.CASHBACK]: 'in',
    [TransactionType.INTEREST]: 'in',
  },
  ref: {
    [TransactionType.REF_BONUS]: 'in',
    [TransactionType.OTHER]: 'out',
  },
};

onMounted(() => {
  observer.value = new IntersectionObserver(loadMoreObserver, {
    threshold: 1.0,
  });

  if (loadMoreRef.value) {
    observer.value.observe(loadMoreRef.value);
  }
});

onBeforeUnmount(() => {
  if (loadMoreRef.value) {
    observer.value?.unobserve(loadMoreRef.value);
  }

  observer.value?.disconnect();
});

tx.value = await getTransactions(txParamsCreator());


const transactions = computed<Transaction[]>(() => tx.value?.transactions ?? []);
const loadMoreCondition = computed(() => (tx.value?.total ?? 0) > transactions.value.length && props.loadMore);

const transactionsEntries = computed<Array<[string, TransactionWithTime[]]> | null>(() => {
  if (!transactions.value?.length) {
    return [];
  }

  const fixDateTransactions = transactions.value?.map((transaction) => {
    const date = new Date(transaction.createdAt);
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);

    const updatedTransaction: TransactionWithTime = {
      ...transaction,
      createdAt: date.toISOString(),
      time: getTransactionTime(transaction.createdAt),
    };

    return updatedTransaction;
  }) ?? [];

  if (!fixDateTransactions?.length) {
    return [] as Array<[string, TransactionWithTime[]]>;
  }

  const groupTransactions = Object.groupBy(fixDateTransactions, (tx) => tx?.createdAt) ?? {};

  const entries = Object.entries(groupTransactions);

  if (!entries.length) {
    return null;
  }

  const groups = entries.map(([key, value]) => {
    return [getDay(key), value];
  });

  return groups as Array<[string, TransactionWithTime[]]>;
});

function txParamsCreator(offset = 0) {
  return {
    types: Object.keys(transactionStatuses[props.entity]),
    limit: props.loadMore ? 25 : 10,
    cardId: props.cardId,
    offset,
  };
}

function getGroupTitle(time: TransactionTime) {
  if (['today', 'yesterday']?.includes(time)) {
    return t(`shared.${time}`);
  }

  return time;
}


function getTransactionProps(transaction: TransactionWithTime) {
  const type = transactionStatuses[props.entity][transaction.type] ?? 'in';
  const price = formatPrice(transaction.amountUSD);

  return {
    type,
    category: transaction.type,
    price: type === 'out' ? `-$${price}` : `$${price}`,
    time: transaction.time,
    status: transaction.status,
    merchant: props.entity === 'card' ? transaction?.merchant : '',
  };
}

function loadMoreObserver(entries: IntersectionObserverEntry[]) {
  if (!loadMoreCondition.value || loading.value) {
    return;
  }

  const entry = entries?.at(0);

  if (entry?.isIntersecting) {
    uploadMoreTx();
  }
}

async function uploadMoreTx() {
  try {
    loading.value = true;
    const newTx = await getTransactions(txParamsCreator(transactions.value.length));

    if (tx.value) {
      tx.value.transactions = [...tx.value.transactions, ...newTx.transactions];
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section v-if="transactionsEntries?.length" class="transaction-group">
    <NuxtLink v-if="showLink && to" :to="to" class="transaction-group__link" @click="impactOccurred('light')">
      {{ linkTitle }}
      <ArrowNextIcon />
    </NuxtLink>
    <slot />
    <div class="transaction-group__filters">
      <!-- <OperationFilters /> -->
      <div v-for="([time, values]) in transactionsEntries" :key="time">
        <h4 v-if="showGroupTitle" class="transaction-group__date">
          {{ getGroupTitle(time) }}
        </h4>
        <SharedOperationList>
          <SharedOperationItem
            v-for="(transaction, index) in values"
            :key="index"
            v-bind="getTransactionProps(transaction)"
          />
        </SharedOperationList>
      </div>
      <div v-if="loadMoreCondition" ref="load-more" />
      <Transition name="fade">
        <div v-if="loading" class="transaction-group__spin" />
      </Transition>
    </div>
  </section>
  <p v-else class="mt-5 text-center">
    {{ $t('shared.actions.noTransactions') }}
  </p>
</template>

<style lang="scss" scoped>
.transaction-group {
  &__link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.2;
    margin-bottom: 20px;
  }

  &__date {
    margin-top: 30px;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.2;
    color: rgba(255, 255, 255, 0.5);
  }

  .transaction-group__spin {
    margin: 10px auto;
    width: 20px;
    aspect-ratio: 1;
    border-radius: 50%;
    background:
      radial-gradient(farthest-side,#815AEB 85%,#0000) top/4px 4px no-repeat,
      conic-gradient(#0000 30%, #815AEB);
    -webkit-mask: radial-gradient(farthest-side,#0000 calc(100% - 4px),#000 0);
    animation: spin 1s infinite linear;
  }
  @keyframes spin {
    100% {
      transform: rotate(1turn);
    }
  }
}
</style>


