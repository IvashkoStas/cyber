<script lang="ts" setup>
export interface Props {
  isLoading?: boolean;
  action?: boolean;
  theme?: boolean;
  simple?: boolean;
}

const props = defineProps<Props>();

const buttonClasses = computed(() => [
  'ui-button',
  {
    'ui-button--simple': props.simple,
    'ui-button--action': props.action,
    'ui-button--theme': props.theme,
  },
]);
</script>
<template>
  <button :class="buttonClasses">
    <slot />
  </button>
</template>

<style lang="scss">
.ui-button {
  position: relative;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &--action {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    padding: 16px;
    background: rgba(233, 125, 226, 0.2);
    font-size: 15px;
    font-weight: 500;
    line-height: 1.2;
    text-align: center;
    color: hsl(var(--primary));
    transition: all 0.3s ease-out;

    @media (hover: hover) {
      background: rgba(233, 125, 226, 0.3);
      transition: all 0.3s ease-in;
    }
  }

  &--simple {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    padding: 16px;
    background: rgb(255 255 255 / 5%);
    font-size: 15px;
    font-weight: 500;
    line-height: 1.2;
    text-align: center;
    color: rgb(255 255 255 / 80%);
    transition: all 0.3s ease-out;

    @media (hover: hover) {
      background: rgb(255 255 255 / 10%);
      transition: all 0.3s ease-in;
    }
  }

  &--theme {
    font-weight: 500;
    background-color: #fff  !important;
    color: #100F10 !important;
  }
}
</style>