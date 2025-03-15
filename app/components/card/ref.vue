<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import CopyIcon from '~/assets/icons/shared/_copy.svg';

const props = defineProps<{ url?: string }>();
const { t } = useI18n();
const toast = useToast();
const { refLink } = useShared();

async function onCopyLink(): Promise<void> {
  try {
    await copyTextToClipboard(props.url ?? refLink.value);
    toast(t('shared.labels.copied'));
  } catch (error) {
    console.error(error);
  }
}

const link = computed(() => (props.url ?? refLink.value)?.replace('https://', ''));
</script>

<template>
  <section class="ref-card">
    <h3 class="ref-card__title">
      {{ $t('cards.ref') }}
    </h3>
    <p class="ref-card__description">
      {{ $t('cards.refDesc') }}
    </p>
    <button class="ref-card__link" @click="onCopyLink">
      <span class="ref-card__link-text">{{ link }}</span>
      <CopyIcon />
    </button>
  </section>
</template>

<style lang="scss">
.ref-card {
  width: 100%;
  margin: 24px 0;
  padding: 16px;
  border-radius: var(--radius);
  background: var(--accent-block);

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-color);
  }

  &__description {
    margin-top: 8px;
    font-size: 13px;
    opacity: 0.7;
    color: var(--primary-color);
  }

  &__link {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    position: relative;
    z-index: 1;
    border-radius: var(--radius);
    margin-top: 24px;
    padding: 12px 8px;
    background: var(--bg-body);

    &-text {
      max-width: calc(100% - 35px);
      display: inline-block;
      font-size: 13px;
      line-height: 1.2;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>