<script setup lang="ts">
interface Props {
  modelValue: boolean;
  disabled?: boolean;
}
interface Emits {
  (event: 'update:modelValue', value: boolean): void
}
defineProps<Props>();

defineEmits<Emits>();
</script>

<template>
  <label class="tg-switch" :class="{ 'tg-switch--disabled': disabled }">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="tg-switch__input"
      @change="$emit('update:modelValue', !modelValue)"
    >
    <span class="tg-switch__slider" />
  </label>
</template>

<style lang="scss" scoped>
.tg-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;

    .tg-switch__slider {
      cursor: not-allowed;
      background-color: #E1E3E6;
    }

    &:active .tg-switch__slider:before {
      width: 28px;
    }
  }

  &__input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .tg-switch__slider {
      background-color: var(--main);

      &:before {
        transform: translateX(22px);
      }
    }

    &:disabled + .tg-switch__slider {
      background-color: #E1E3E6;
      cursor: not-allowed;
    }
  }

  &__slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #E1E3E6;
    transition: .2s;
    border-radius: 34px;

    &:before {
      position: absolute;
      content: "";
      height: 22px;
      width: 22px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .2s;
      border-radius: 50%;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
  }

  &:not(.tg-switch--disabled):active &__slider:before {
    width: 32px;
  }
}
</style>