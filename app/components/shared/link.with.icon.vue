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

const iconClasses = computed(() => [
  'icon',
  {
    'icon-rotate': props.direction === 'in',
    'icon--card': props.icon === 'card',
  },
]);
</script>

<template>
  <NuxtLink :to="to" class="link-with-icon" @click="impactOccurred('light')">
    <Component :is="icons[icon]" v-if="icon" :class="iconClasses" />
    {{text?.length ? text : $t(`shared.actions.${direction}`)}}
 </NuxtLink>
</template>

<style lang="scss">
.link-with-icon {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 15px;
  padding: 10px 30px;
  background: rgb(255 255 255 / 5%);
  font-size: 12px;
  font-weight: 300;
  line-height: 1.2;
  text-align: center;

  .icon {
    height: 30px;
    min-width: 30px;

    path {
      color: #000;
    }

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