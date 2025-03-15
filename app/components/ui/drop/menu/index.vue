<script lang="ts" setup>
import ChevronDownIcon from '~/assets/icons/chevrons/chevron-down.svg';

interface Props {
  title: string;
  big?: boolean;
}

const props = defineProps<Props>();

const open = shallowRef(false);
const trigger = useTemplateRef<HTMLButtonElement>('trigger');

const dropMenuClasses = computed(() => [
  'drop-menu',
  {
  'drop-menu--open': open.value,
  'drop-menu--big': props.big,
  },
]);

const dropMenuHeaderClasses = computed(() => [
  'drop-menu__header',
  {
  'drop-menu__header--open': open.value,
  'drop-menu__header--big': props.big,
  },
]);

const dropMenuBodyClasses = computed(() => [
  'drop-menu__body',
  {
  'drop-menu__body--open': open.value,
  'drop-menu__body--big': props.big,
  },
]);

const chevronClasses = computed(() => [
  'chevron',
  {
    'chevron--rotate': open.value,
  },
]);

onMounted(() => {
  window.addEventListener('click', triggerClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', triggerClickOutside);
});

function toggleOpen(): void {
  open.value = !open.value;
}

function triggerClickOutside(event: Event): void {
  if (trigger.value && !trigger.value?.contains(event.target as Node)) {
    open.value = false;
  }
}
</script>

<template>
  <div :class="dropMenuClasses">
    <button
      ref="trigger"
      :class="dropMenuHeaderClasses"
      @click="toggleOpen"
    >
      <div class="drop-menu__title">
        <slot name="icon" />
        {{title}}
      </div>
      <ChevronDownIcon :class="chevronClasses" />
    </button>

    <div :class="dropMenuBodyClasses">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.drop-menu {
  width: 100%;
  position: relative;
  z-index: 6;

  &--big {
    width: 100%;
  }

  &__title {
    display: inline-flex;
    align-items: center;
    max-width: 80%;
    font-size: 14px;
    line-height: 1.2;
    color: var(--primary-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 7px;
    border-radius: var(--radius);
    padding: 12px 16px;
    position: relative;
    z-index: 2;
    background: var(--bg-block);


    // &--open {
    //   background-color: #29272a;
    // }

    &--big {
      width: 100%;
      justify-content: space-between;
      padding: 12px 15px;
    }

    .chevron {
      transition: all 0.2s ease-out;

      &--rotate {
        transform: rotate(180deg);
        transition: all 0.2s ease-in;
      }
    }
  }

  &__body {
    min-width: 100%;
    width: min-content;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    padding: 44px 12px 0;
    border-radius: var(--radius);
    background: var(--bg-block);
    opacity: 0;
    overflow: hidden;
    visibility: hidden;
    transition: all 0.2s ease-out;

    &--big {
      padding-top: 40px;
    }

    &--open {
      opacity: 1;
      visibility: visible;
      overflow: visible;
      transition: all 0.2s ease-in;
      background: var(--bg-block);
    }
  }
}
</style>