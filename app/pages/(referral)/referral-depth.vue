<script lang="ts" setup>
import { AppRoutes } from '~/constants/app.route';

definePageMeta({
  middleware: 'onboard',
});


const { referral, getReferral, bonusBalance } = useReferral();


await getReferral();

</script>

<template>
  <div class="referral-depth h-full px-4 pb-[120px] pt-[30px]">
    <UiCustomBackButton @click="$router.replace(AppRoutes.USER)" />
    <BalanceTitle
      :title="$t('RefClassic.balance')"
      :balance="bonusBalance"
    />
    <CardRef :url="referral?.url" />
    <SharedTransactionGroup
      entity="ref"
      :to="AppRoutes.REFERRAL_OPERATION"
      show-link
      :link-title="$t('referralDepth.history')"
    />
  </div>
</template>

<style lang="scss" scoped>
.referral-depth {
  height: min-content;

  &__link {
    margin-top: 40px;
  }

  &__info {
    min-height: 50vh;
    margin: 20px -1.25rem 0;

    border-radius: 20px;
    padding: 15px;
    background: #1E1C1F;
  }

  &__tabs {
    display: flex;
    gap: 6px;
    align-items: center;
    background: #101011;
    border-radius: 15px;
    padding: 5px;

    .tab {
      flex: 0 0 calc(50% - 3px);
      padding: 16px;
      border-radius: 10px;
      transition: all 0.2s ease-in-out;
      font-size: 15px;
      font-weight: 500;
      line-height: 18.29px;
      text-align: center;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;

      &--active {
        background-color: #fff;
        color: #100F10;
      }
    }
  }

}
</style>
