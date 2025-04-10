<script lang="ts" setup>
import { useWebApp } from 'vue-tg';
import { AppRoutes, AppRoutesNames } from '~/constants/app.route';
import { KycStatus } from '~~/types/kys.status';

const hapticFeedback = useVibrate();
const { initData } = useWebApp();
const route = useRoute();
const { user } = useUser();

const icons = {
  wallet: (isActive: boolean) => isActive ? '/icons/navigate/wallet-active.svg' : '/icons/navigate/wallet.svg',
  card: (isActive: boolean) => isActive ? '/icons/navigate/card-active.svg' : '/icons/navigate/card.svg',
  setting: (isActive: boolean) => isActive ? '/icons/navigate/setting-active.svg' : '/icons/navigate/setting.svg',
};

const navigateClasses = computed(() => [
  'navigate',
  {
      'navigate--sticky': !initData.length,
  },
]);

const navData = [
  {
    icon: 'wallet',
    title: 'navigate.wallet',
    to: AppRoutes.WALLET,
    activeLinks: [
      AppRoutes.WALLET,
      AppRoutes.WALLET_OPERATION,
      AppRoutes.WALLET_OUTPUT,
      AppRoutes.ADD_USDT,
    ],
  },
  {
    icon: 'card',
    title: 'navigate.card',
    to: AppRoutes.CARDS,
    activeLinks: [
      AppRoutes.CARDS,
      AppRoutes.CARDS_UP,
      AppRoutes.REQUEST_CARD,
      AppRoutes.CARDS_OPERATION,
      AppRoutes.KYC,
    ],
  },
  {
    icon: 'setting',
    title: 'navigate.account',
    to: AppRoutes.USER,
    activeLinks: [
      AppRoutes.USER,
      AppRoutes.LANGUAGE,
      AppRoutes.FAQ,
      AppRoutes.REFERRAL,
      AppRoutes.REFERRAL_DEPTH,
      AppRoutes.REFERRAL_OUTPUT,
    ],
  },
];

function getNavigateItemClasses(activeLinks: string[]) {
  const isActive = !!activeLinks.find((p) => route.path?.includes(p));

  return [
    'navigate__item',
    {
        'navigate__item--active': isActive,
    },
  ];
}

const showMenu = computed(
  () => {
    if (route.meta.hideNavigate) {
      return false;
    }

    if (!user.value?.cards?.length && user.value?.kyc?.status !== KycStatus.ADOPT_PASS && AppRoutes.BY_CARD === route.path) {
      return true;
    }

    if ([AppRoutesNames.CARD_ID, AppRoutesNames.CARD_UP_ID].includes(route.name as AppRoutesNames)) {
      return false;
    }

    return ![
      AppRoutes.AUTH,
      AppRoutes.KYC,
      AppRoutes.REQUEST_CARD,
      AppRoutes.BY_CARD,
      AppRoutes.WALLET_OUTPUT,
      AppRoutes.REFERRAL_OUTPUT,
      AppRoutes.REGISTER,
    ].includes(route.path as AppRoutes);
  },
);

function getIcon(icon: string, activeLinks: string[]) {
  const isActive = !!activeLinks.find((p) => route.path?.includes(p));

  return icons[icon as keyof typeof icons](isActive);
}

</script>

<template>
  <nav v-if="showMenu" :class="navigateClasses">
    <ul class="navigate__list">
      <li v-for="({ icon, title, to, activeLinks }) in navData" :key="to" >
      <NuxtLink :to="to" :class="getNavigateItemClasses(activeLinks)" @click="hapticFeedback.impactOccurred('light')">
        <img
          :src="getIcon(icon, activeLinks)"
          class="navigate__item-icon"
          alt="icon"
        />
        <span class="navigate__item-title">{{ $t(title) }}</span>
      </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss">
.dark .navigate {
  background-color: var(--bg-block);
  box-shadow: 0px 5px 27.6px 0px #00000040;
}

.navigate {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 20px 35px 28px;
  z-index: 5;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: #fdfdfd;
  box-shadow: 0px 5px 27.6px 0px #0000001A;

  &--sticky {
    position: sticky;
  }


  &__list {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
  }

  &__item {
    width: 80px;
    height: 43px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    opacity: 0.5;
    transition: all 0.2s ease-out;

    &--active {
      opacity: 1;
      transition: all 0.2s ease-in;
    }

    &-icon {
      height: 18px;
    }

    &-title {
      font-size: 12px;
      line-height: 1.2;
    }
  }
}
</style>