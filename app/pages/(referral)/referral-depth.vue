<script lang="ts" setup>
import { AppRoutes } from '~/constants/app.route';

definePageMeta({
  middleware: 'onboard',
});

enum Tabs {
  STAT = 'stat',
  HISTORY = 'history',
}

const { referral, getReferral, bonusBalance } = useReferral();

const selectedTab = shallowRef<Tabs>(Tabs.STAT);

await getReferral();

function getTabClasses(tab: Tabs) {
  return [
    'tab',
    {
      'tab--active': selectedTab.value === tab,
    },
  ];
}

function onChangeTab(tab: Tabs) {
  selectedTab.value = tab;
}
</script>

<template>
  <div class="referral-depth h-full px-5 pb-[120px] pt-[30px]">
    <UiCustomBackButton @click="$router.replace(AppRoutes.USER)" />
    <BalanceTitle
      :title="$t('RefClassic.balance')"
      :balance="bonusBalance"
    />
    <SharedLinkWithIcon
      class="referral-depth__link"
      direction="out" :to="AppRoutes.REFERRAL_OUTPUT"
    />
    <CardRef :url="referral?.url" />
    <div v-if="referral" class="referral-depth__info">
      <ul class="referral-depth__tabs">
        <li
          v-for="([key, tab]) in Object.entries(Tabs)"
          :key="key"
          :class="getTabClasses(tab)"
          @click="onChangeTab(tab)"
        >
          {{ $t(`referralDepth.tabs.${tab}`) }}
        </li>
      </ul>
      <div class="referral-depth__body">
        <SharedTransactionGroup
          v-show="selectedTab === Tabs.HISTORY"
          :key="Tabs.HISTORY"
          entity="ref"
          load-more
          :link-title="$t('wallet.operations')"
        />
        <div v-show="selectedTab !== Tabs.HISTORY" :key="Tabs.STAT" class="mt-[30px]">
          <ReferralStructure :lines="referral?.lines" />
          <div class="referral-lines__info">
            <ReferralLineCard
              v-for="line in referral.lines"
              :key="line.depth"
              :line="line"
            />
          </div>
        </div>
      </div>
    </div>
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
