<script lang="ts" setup>
import CardGrayIcon from '~/assets/icons/shared/_card-gray.svg';
import DollarIcon from '~/assets/icons/shared/_dollar.svg';
import PeoplesIcon from '~/assets/icons/shared/_peoples.svg';

type Icons = 'turnover' | 'card' | 'referral';

interface Props {
  icon: Icons;
  amount: number;
}

const icons: Record<Icons, string> = {
  turnover: DollarIcon,
  card: CardGrayIcon,
  referral: PeoplesIcon,
};

const props = defineProps<Props>();

const iconSrc = computed(() => icons[props.icon]);
const fixedAmount = computed(() => {
  if (props.icon === 'turnover') {
    return `$${formatNumber(props.amount)}`;
  }

  return formatNumber(props.amount);
});


function formatNumber(num: number) {
  const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
  });

  return formatter.format(num);
}
</script>

<template>
  <div class="info-card">
    <Component :is="iconSrc" class="info-card__icon" />
    <p class="info-card__amount">{{ fixedAmount }}</p>
    <p class="info-card__text">
      {{ $t(`referralDepth.${icon}`) }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
  .info-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 10px 23px;
    border-radius: 10px;
    background-color: #1C1C1D;

    &__icon {
      width: 30px;
      height: 30px;
    }

    &__amount {
      font-size: 15px;
      font-weight: 400;
      line-height: 1.4;
      text-align: center;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      color: #fff;
    }

    &__text {
      font-size: 10px;
      font-weight: 400;
      line-height: 12.19px;
      text-align: center;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      color: rgba($color: #fff, $alpha: 0.5);
    }
  }
</style>
