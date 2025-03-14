<script setup lang="ts" generic="T = string">
interface Props {
  modelValue: T;
  value: T;
  name: string;
}
interface Emits {
  (event: 'update:modelValue', value: T): void
}
defineProps<Props>();

defineEmits<Emits>();
</script>

<template>
  <label class="tg-radio">
    <input
      type="radio"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      class="tg-radio__input"
      @change="$emit('update:modelValue', value)"
    >
    <div class="tg-radio__custom"></div>
    <span class="tg-radio__label">
      <slot></slot>
    </span>
  </label>
</template>

<style lang="scss" scoped>
.tg-radio {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;

  &__input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  &__custom {
    position: relative;
    height: 20px;
    width: 20px;
    border: 2px solid #fff;
    border-radius: 50%;

    &::after {
      content: '';
      position: absolute;
      display: none;
      top: 50%;
      left: 50%;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #fff;
      transform: translate(-50%, -50%);
    }
  }

  &__label {
    color: var(--tg-theme-text-color, #000);
    font-size: 16px;
  }

  &__input:checked ~ &__custom::after {
    display: block;
  }

  // Анимация при нажатии
  &:active &__custom {
    transform: scale(0.9);
  }
}
</style>