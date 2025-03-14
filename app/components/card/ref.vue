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
</script>

<template>
  <section class="ref-card">
    <h3 class="ref-card__title" v-html="$t('cards.ref')" />
    <button class="ref-card__link" @click="onCopyLink">
      <span class="ref-card__link-text">{{ url ?? refLink }}</span>
      <CopyIcon />
    </button>
  </section>
</template>

<style lang="scss">
@use '~/assets/css/mixins' as mixins;

.ref-card {
  margin-top: 20px;
  padding: 15px;

  @include mixins.gradientCard;

  &__title {
    line-height: 1.4;

    .primary {
      color: hsl(var(--primary));
    }
  }

  &__link {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    position: relative;
    z-index: 1;
    border-radius: 15px;
    margin-top: 25px;
    padding: 12px 10px;
    background: rgb(255 255 255 / 5%);

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