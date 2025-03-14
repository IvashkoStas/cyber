<script lang="ts" setup>
const { setting } = useSetting();
const { cardPrice } = useShared();
</script>

<template>
  <div class="info-price">
    {{ $t('requestCard.cardPrice') }}
    <span v-if="setting" class="price">
      {{ cardPrice.toFixed(2) }}$
    </span>
  </div>
</template>

<style lang="scss" scoped>
.info-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 13px 7px 13px 15px;
  margin-top: 20px;
  border-radius: 10px;
  background: rgb(255 255 255 / 5%);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 15px;
    padding: 1px;
    background: linear-gradient(90.97deg, rgb(255 255 255 / 20%) 1.87%, rgb(17 16 17 / 20%) 84.31%);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: xor;
            mask-composite: exclude;
  }

  .price {
    padding: 5px 15px;
    border-radius: 10px;
    background: linear-gradient(103.12deg, #E97DE2 -0.7%, #524C82 99.3%);
    font-size: 15px;
    font-weight: 500;
    line-height: 1.2;
    text-align: center;
    color: rgb(16 15 16);
  }
}
</style>