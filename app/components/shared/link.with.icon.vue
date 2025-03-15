<script lang="ts" setup>
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';
import ArrowCircleIcon from '~/assets/icons/arrows/arrow-circle.svg';
import CardIcon from '~/assets/icons/navigate/card.svg';

interface Props {
  to: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric | undefined;
  direction?: 'out' | 'in';
  icon?: keyof typeof icons;
  text?: string;
}

const icons = {
  arrow: ArrowCircleIcon,
  card: CardIcon,
};


const props = withDefaults(defineProps<Props>(), {
  direction: 'in',
  icon: 'arrow',
  text: '',
});

const { impactOccurred } = useVibrate();

const linkWithIconClasses = computed(() => [
  'link-with-icon',
  {
    'link-with-icon--main': props.direction === 'in',
  },
]);


const iconClasses = computed(() => [
  'icon',
  {
    'icon-rotate': props.direction === 'out',
    'icon--card': props.icon === 'card',
  },
]);
</script>

<template>
  <NuxtLink :to="to" :class="linkWithIconClasses" @click="impactOccurred('light')">
    <Component :is="icons[icon]" v-if="icon" :class="iconClasses" />
    {{text?.length ? text : $t(`shared.actions.${direction}`)}}
 </NuxtLink>
</template>

<style lang="scss">
.link-with-icon {
  color: var(--primary);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 16px;
  padding: 16px 38px;
  background-color: var(--bg-block);
  font-size: 14px;
  text-align: center;

  &--main {
    background-color: var(--main);
    color: var(--main-color);

    .nuxt-icon--fill * {
      fill: var(--main-color);
    }
  }

  .icon {
    height: 24px;
    min-width: 24px;


    &--card {
      &.nuxt-icon--fill * {
        fill: #fff !important;
      }
    }


    &-rotate {
      transform: rotate(180deg);
    }
  }
}
</style>