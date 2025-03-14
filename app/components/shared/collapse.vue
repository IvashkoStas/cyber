<script lang="ts" setup>
import ChevronDownIcon from '~/assets/icons/chevrons/chevron-down.svg';

interface Props {
  title: string;
  description: string;
}

defineProps<Props>();

const collapse = shallowRef(false);

const arrowClasses = computed(() => [
  'collapse-header__arrow',
  {
    'collapse-header__arrow--rotate': collapse.value,
  },
]);

const bodyClasses = computed(() => [
  'collapse-body',
  {
    'collapse-body--collapse': collapse.value,
  },
]);

function toggleCollapse() {
  collapse.value = !collapse.value;
}
</script>

<template>
  <div class="collapse">
    <div class="collapse-header" @click="toggleCollapse">
      <h4 class="collapse-header__title">
        {{ title }}
      </h4>
      <div :class="arrowClasses">
        <ChevronDownIcon  />
      </div>
    </div>
    <div :class="bodyClasses">
      <div style="min-height: 0" v-html="description"/>
  </div>
</div>
</template>

<style lang="scss">
.collapse {
  width: 100%;
  visibility: visible;
  padding: 15px;
  border-radius: 20px;
  background: #1E1C1F;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    &__title {
      flex: 0 0 85%;
      font-size: 15px;
      font-weight: 500;
      line-height: 1.2;
      color: rgba($color: #fff, $alpha: 0.8);
    }

    &__arrow {
      transition: all 0.3s ease-out;

      &--rotate {
        transform: rotate(180deg);
        transition: all 0.3s ease-in;
      }
    }
  }

  &-body {
    display: grid;
    grid-template-rows: 0fr;
    transition: all 0.3s ease-out;
    overflow: hidden;
    font-size: 12px;
    line-height: 1.2;
    color: rgba($color: #fff, $alpha: 0.5);

    &--collapse {
      padding-top: 15px;
      grid-template-rows: 1fr;
      transition: all 0.3s ease-in;
    }

    p {
      margin-bottom: 5px;
    }

    ul {
      margin: 10px 0;
      list-style: initial;
      padding-left: 15px;
    }
  }
}
</style>