<script lang="ts" setup>
interface Props {
  show: boolean;
  top?: string,
}

withDefaults(defineProps<Props>(), {
  top: 'unset',
});
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="drawer-overlay" />
    <Transition name="slide-fade">
      <div v-if="show" class="drawer" :style="{ top }">
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.drawer-overlay {
  max-width: 100vw;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 10;
}
.drawer  {
  width: 100vw;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  background-color: #1E1C1F;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px 20px 27px;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
