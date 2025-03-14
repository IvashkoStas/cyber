<script lang="ts" setup>
import type { ReferralLine } from '~~/types/referral';

type Icons = 'turnover' | 'card' | 'referral';

interface Props {
  line: ReferralLine;
}
const props = defineProps<Props>();

const { getLineDescription } = useSetting();

const lineStatistic = computed(() => [
  {
    icon: 'referral' as Icons,
    amount: props.line.referrals,
  },
  {
    icon: 'card' as Icons,
    amount: props.line.cards,
  },
  {
    icon: 'turnover' as Icons,
    amount: props.line.turnover,
  },
]);

const lineCardClasses = computed(() => [
  'line-card',
  {
    'line-card--hide': !props.line.active,
  },
]);
</script>

<template>
  <div :class="lineCardClasses">
    <div class="line-card__header">
      <h2 class="line-card__header-title">
        {{ $t('referralDepth.levelNumber', { level: line.depth }) }}
      </h2>
      <div v-if="line.active" class="line-card__header-info dollars">
        ${{ line.profit?.toFixed(2) }}
      </div>
      <div v-else class="line-card__header-info">
        <span class="highlight">{{ line.referrals }}</span>/{{ line.referralsNeed }}
      </div>
    </div>
    <div class="line-card__description">
      {{ $t('referralDepth.description', getLineDescription(line.depth)) }}
    </div>
    <div class="line-card__info">
      <ReferralInfoCard
        v-for="stat in lineStatistic"
        :key="stat.icon"
        v-bind="stat"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.line-card {
  background-color: #101011;
  border-radius: 15px;
  padding: 15px;
  margin-top: 20px;

  &--hide {
    opacity: 0.5;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-title {
      font-size: 18px;
      font-weight: 500;
      line-height: 1.2;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      color: #fff;
    }

    &-info {
      font-size: 15px;
      font-weight: 400;
      line-height: 1.4;
      text-align: center;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      color: rgba($color: #fff, $alpha: 0.5);

      &.dollars {
        font-weight: 500;
        color: #4EC68D;
      }

      .highlight {
        color: #4EC68D;
      }
    }
  }

  &__description {
    margin-top: 2px;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.2;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: rgba($color: #fff, $alpha: 0.5);
  }

  &__info {
    display: grid;
    align-items: center;
    justify-content: space-between;
    grid-template-columns: repeat(3, calc(33% - 6px));
    gap: 9px;
    margin-top: 15px;
  }
}
</style>
