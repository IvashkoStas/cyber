<script lang="ts" setup>
interface Props {
  show: boolean;
}
defineProps<Props>();
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="loader">
        <div class="spin" />
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.loader {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #100F10;
  position: fixed;
  inset: 0;
  z-index: 100;
}
.spin {
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(farthest-side,#fff 94%,#0000) top/8px 8px no-repeat,
    conic-gradient(#0000 30%, #fff);
  -webkit-mask: radial-gradient(farthest-side,#0000 calc(100% - 8px),#000 0);
  animation: spin 1s infinite linear;
}
@keyframes spin {
  100% {
    transform: rotate(1turn);
  }
}
</style>