<script lang="ts" setup>
interface Props {
  title: string;
  selected?: boolean;
}

const props = defineProps<Props>();

const dropItemClasses = computed(() => [
  'drop-menu__item',
  {
    'drop-menu__item--selected': props.selected,
  },
]);
</script>

<template>
  <button :class="dropItemClasses">
    <slot />
    {{title}}
  </button>
</template>

<style lang="scss" scoped>
.drop-menu__item {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 0;
  outline: none;
  border: none;
  background: transparent;
  font-size: 14px;
  line-height: 1.2;
  text-align: left;

  &:not(:last-child) {
    border-bottom: 1px solid rgb(255 255 255 / 5%);
  }

  &--selected {
    color: var(--main);
  }
}
</style>
