<script lang="ts" setup>
import SymbolIcon from '~/assets/icons/shared/_symbol.svg';
import { Status } from '~~/types/status';

interface Props {
  text: string;
  status?: Status;
}

const { status = Status.WARNING } = defineProps<Props>();

const infoClasses = computed(() => ['shared-info', `shared-info--${status}`]);
</script>

<template>
  <section :class="infoClasses">
    <div class="shared-info__circle">
      <SymbolIcon />
    </div>
    {{ text }}
  </section>
</template>

<style lang="scss" scoped>
.shared-info {
  --color: #cf8e3f;
  --bg: #cf8e3f33;

  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 20px;
  background-color: var(--bg);
  font-size: 11px;
  line-height: 1.2;
  color: var(--color);

  &--warning {
    --color: #cf8e3f;
    --bg: #cf8e3f33;
  }

  &--success {
    --color: #4ec68d;
    --bg: #4ec68d33;
  }

  // &--error {}
  // &--info {}

  &__circle {
    flex: 0 0 30px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: var(--bg);
  }
}
</style>
