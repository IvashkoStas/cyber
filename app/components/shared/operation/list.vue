<template>
  <div class="operation-list">
    <slot />
  </div>
</template>

<style lang="scss">
.operation-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}
</style>