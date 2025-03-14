<script lang="ts" setup>
import ArrowOperationIcon from '~/assets/icons/arrows/arrow-operation.svg';
import { TransactionStatus } from '~~/types/tx';

interface PropsItem {
  type: 'in' | 'out';
  category: string;
  price: string;
  time: string;
  status: TransactionStatus;
  merchant?: Nullable<string>;
}

const props = defineProps<PropsItem>();

const iconClasses = computed(() => ['icon', {
  'icon--rotate': props.type === 'out',
}]);

const priceClasses = computed(() => ['price', {
  'price--green': props.type === 'in' && props.status !== TransactionStatus.FAIL,
  'price--red': props.status === TransactionStatus.FAIL,
}]);

const title = computed(() => props.status === TransactionStatus.FAIL ? TransactionStatus.FAIL : props.category);
</script>

<template>
  <li class="operation-list__item">
    <div class="icon-wrapper">
      <ArrowOperationIcon :class="iconClasses" />
    </div>
    <div class="info">
      <div class="info-header">
        <h4 class="info-title">{{ $t(`transactionType.${title}`) }}</h4>
        <div :class="priceClasses">{{ price }}</div>
      </div>
      <div class="info-footer">
        <p class="info-category">{{ merchant }}</p>
        <p class="info-time">{{ time }}</p>
      </div>
    </div>
  </li>
</template>

<style lang="scss" scoped>
.operation-list__item {
  display: flex;
  align-items: center;
  gap: 10px;

  .icon-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: rgb(255 255 255 / 10%);

    .icon {
      width: 22px;
      height: 22px;

      &--rotate {
        transform: rotate(180deg);
      }
    }
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;

    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 5px;
    }

    &-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 5px;
    }


    &-time {
      margin-left: auto;
      display: block;
      font-size: 10px;
      font-weight: 300;
      line-height: 1.2;
      color: rgb(255 255 255 / 50%);
    }

    &-title {
      font-size: 13px;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      width: 150px;
      text-overflow: ellipsis;
    }

    &-category {
      font-size: 10px;
      font-weight: 300;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      width: 200px;
      text-overflow: ellipsis;
      color: rgb(255, 255, 255, 0.5);
    }
  }

  .price {
    margin-left: auto;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.4;

    &--green {
      color: #4EC68D;
    }

    &--red {
      color: #BB2D2D;
    }
  }
}
</style>
