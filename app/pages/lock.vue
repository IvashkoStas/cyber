<template>
  <div class="lock h-full px-5 pb-[120px] pt-[30px]">
    <UiCustomBackButton @click="$router.back" />
    <p class="lock-title">{{$t('lock.title')}}</p>
  </div>
</template>

<style lang="scss">
.lock-title {
  padding: 10px 21px;
  border-radius: 15px;
  background: rgb(255 255 255 / 5%);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  text-align: center;
}
</style>