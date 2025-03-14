<script lang="ts" setup>
interface Props {
  show: boolean;
}

interface Emits {
  (event: 'close'): void;
}

defineProps<Props>();
defineEmits<Emits>();

// const overlay = ref();

// onMounted(() => {
//   adjustHeight();
//   window.addEventListener('resize', adjustHeight);
// });

// onBeforeUnmount(() => {
//   window.removeEventListener('resize', adjustHeight);
// });

// function adjustHeight() {
//   if (overlay.value) {
//     overlay.value.style.height = `${window.innerHeight - 100}px`;
//   }
// }
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" ref="overlay" class="overlay" @click="$emit('close')">
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.overlay {
  max-width: 100vw;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 10;
}
</style>