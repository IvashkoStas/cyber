<script lang="ts" setup>
const { bonusBalance } = useReferral();
</script>

<template>
  <div v-if="bonusBalance" class="cashback">
    <div class="cashback-header">
      <span class="cashback-header-text">{{ $t('wallet.cashback') }}</span>
      <div class="cashback-header-icon">
          <svg width="11" height="3" viewBox="0 0 11 3" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.62508 2.91671C5.04978 2.91671 4.58341 2.45034 4.58341 1.87504C4.58341 1.29974 5.04978 0.833374 5.62508 0.833374C6.20038 0.833374 6.66675 1.29974 6.66675 1.87504C6.66675 2.45034 6.20038 2.91671 5.62508 2.91671Z" fill="#09E5E5"/>
          <path opacity="0.4" d="M9.37508 2.91671C8.79978 2.91671 8.33341 2.45034 8.33341 1.87504C8.33341 1.29974 8.79978 0.833374 9.37508 0.833374C9.95038 0.833374 10.4167 1.29974 10.4167 1.87504C10.4167 2.45034 9.95038 2.91671 9.37508 2.91671Z" fill="#09E5E5"/>
          <path opacity="0.4" d="M1.45833 2.91671C0.883037 2.91671 0.416666 2.45034 0.416666 1.87504C0.416666 1.29974 0.883037 0.833374 1.45833 0.833374C2.03363 0.833374 2.5 1.29974 2.5 1.87504C2.5 2.45034 2.03363 2.91671 1.45833 2.91671Z" fill="#09E5E5"/>
        </svg>
      </div>
    </div>
    {{ bonusBalance }} USDT
  </div>
</template>

<style lang="scss" scoped>
.dark .cashback {
  color: var(--main);
}

.cashback {
  max-width: 140px;
  width: max-content;
  padding: 10px 12px;
  border-radius: var(--radius);
  background: var(--accent-block);
  color: var(--primary-color);
  font-size: 15px;
  font-weight: 600;;

  &-header {
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    &-text {
      opacity: 0.5;
      font-size: 14px;
      font-weight: 400;
      color: var(--primary-color);
    }
  }
}
</style>
