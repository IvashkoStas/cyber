<script setup lang="ts">
import { MainButton, useWebApp } from 'vue-tg';

interface Props {
  color: string;
  textColor: string;
  disabled?: boolean;
  text: string;
  visible?: boolean;
  progress?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  visible: true,
});

const { initData } = useWebApp();
const isPwa = computed(() => !initData.length);

const uiButtonProps = computed(() => ({
  disabled: props.disabled || props.progress,
  action: true,
  theme: true,
  isLoading: props.progress,
  style: {
    backgroundColor: props.color,
    color: props.textColor,
  },
}));
</script>
<template>
<UiButton v-if="isPwa && visible" v-bind="uiButtonProps" >
  {{ text }}
</UiButton>
<MainButton v-else-if="!isPwa" v-bind="$props" />
</template>