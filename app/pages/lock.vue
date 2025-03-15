<template>
  <div class="lock h-full px-4 pb-[120px] pt-[30px]">
    <UiCustomBackButton @click="$router.back" />
    <p class="lock-title">{{$t('lock.title')}}</p>
  </div>
</template>

<style lang="scss">
.lock-title {
  padding: 12px 20px;
  border-radius: var(--radius);
  background-color: var(--bg-block);
  color: var(--primary-color);
  font-size: 14px;
  text-align: center;
}
</style>