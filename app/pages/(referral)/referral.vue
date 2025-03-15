<script lang="ts" setup>
import ChevronRightIcon from '~/assets/icons/chevrons/chevron-right.svg';
import PeopleIcon from '~/assets/icons/shared/_people.svg';
import StatIcon from '~/assets/icons/shared/_stat.svg';
import { AppRoutes } from '~/constants/app.route';

definePageMeta({
  middleware: 'onboard',
});

const { setting } = useSetting();
const { getPartnerReferrals, bonusBalance } = useReferral();

const total = ref<Nullable<number>>(null);
const percents = computed(() => `${setting.value?.REFERRAL_PERCENTS_BUY[0] ?? 0}%`);

const data = await getPartnerReferrals(0, { offset: 0, limit: 1 });
total.value = data?.total ?? 0;
</script>

<template>
  <div class="referral h-full px-4 pb-[120px] pt-[30px]">
    <UiCustomBackButton @click="$router.replace(AppRoutes.USER)" />
    <BalanceTitle
      :title="$t('RefClassic.balance')"
      :balance="bonusBalance"
    />
    <SharedLinkWithIcon
      class="referral__link"
      direction="out" :to="AppRoutes.REFERRAL_OUTPUT"
    />
    <div class="referral__people">
      <div v-if="total !== null" class="people">
        <span class="people-count">{{ total }}</span>
        <PeopleIcon />
      </div>
      <div class="people-price">{{ percents }}</div>
    </div>
    <CardRef />
    <NuxtLink class="referral__tariffs" :to="AppRoutes.LOCK">
      <div class="tariffs-icon">
        <StatIcon class="tariffs-icon__stat" />
      </div>
      {{ $t('RefClassic.stat') }}
      <ChevronRightIcon class="tariffs-chevron" />
    </NuxtLink>
    <SharedTransactionGroup
      class="mt-[30px]"
      entity="ref"
      :link-title="$t('wallet.operations')"
    >
      <h3 class="ref-marketing__transactions">
        {{ $t('walletOperation.title') }}
      </h3>
    </SharedTransactionGroup>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/css/mixins' as mixins;

.referral {
  height: min-content;

  &__link {
    margin-top: 40px;
  }

  &__people {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 15px 12px;

    &:before {
      content: '';
      position: absolute;
      inset: 0;
      background:   #E97DE21A;
    }
    @include mixins.gradientCard;

    .people {
      display: flex;
      align-items: center;
      gap: 5px;

      &-count {
        font-size: 13px;
        font-weight: 600;
        line-height: 1.2;
      }

      &-price {
        font-size: 15px;
        font-weight: 400;
        line-height: 2.4;
        color: #E97DE2;
      }
    }
  }

  &__tariffs {
    display: flex;
    align-items: center;
    gap: 12px;
    border-radius: 15px;
    margin-top: 20px;
    padding: 15px;
    background: rgb(255 255 255 / 5%);
    font-size: 15px;
    font-weight: 500;
    line-height: 1.2;
    color: rgb(255 255 255 / 80%);

    .tariffs {
      &-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: rgb(17 16 18);

        &__stat {
          height: 24px;
          width: 24px;
        }
      }

      &-chevron {
        display: block;
        margin-left: auto;
      }
    }
  }
}
</style>