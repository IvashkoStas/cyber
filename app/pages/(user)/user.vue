<script lang="ts" setup>
// import { getMessaging, getToken } from 'firebase/messaging';
import { useWebApp } from 'vue-tg';
import ChevronRightIcon from '~/assets/icons/chevrons/chevron-right.svg';
import FaqIcon from '~/assets/icons/user/faq.svg';
import LangIcon from '~/assets/icons/user/lang.svg';
import LogoutIcon from '~/assets/icons/user/logout.svg';
import ShieldIcon from '~/assets/icons/user/shield.svg';
import SupportIcon from '~/assets/icons/user/support.svg';
import { AppRoutes } from '~/constants/app.route';
import { SUPPORT_LINK } from '~/constants/links';
import { formatPrice } from '~/utils/format.price';

definePageMeta({
  middleware: 'onboard',
});

const { initData } = useWebApp();
const USER_PHOTO = '/images/user.png';
const CRYPTO_PAY_BOT = 'cryptopaybot.com';

const colorMode = useColorMode();

const icons = {
  setting: LangIcon,
  shield: ShieldIcon,
  support: SupportIcon,
  faq: FaqIcon,
  ...(!initData.length ? { logout: LogoutIcon } : {}),
};

const links = computed(() => ({
  setting: AppRoutes.LANGUAGE,
  shield: AppRoutes.LOCK,
  support: SUPPORT_LINK,
  faq: AppRoutes.FAQ,
  logout: AppRoutes.LOGOUT,
}));

const { user } = useUser();
const { bonusBalance } = useReferral();
const webApp = useWebApp();
const { impactOccurred } = useVibrate();
const userImage = computed(() => webApp.initDataUnsafe.user?.photo_url ?? USER_PHOTO);

const referralLink = AppRoutes.REFERRAL_DEPTH;

useHead(() => ({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: userImage.value,
    },
    {
      rel: 'prefetch',
      as: 'image',
      href: userImage.value,
    },
  ],
}));

const username = computed(() => {
  if (!user.value?.lastName?.length && !user.value?.firstName?.length) {
    return user.value?.email.split('@')?.at(0) ?? '';
  }

  return `${user.value?.lastName ?? ''} ${user.value?.firstName ?? ''}`;
});

/* async function requestPermission() {
  const permission = await window?.Notification?.requestPermission();
    console.table({ permission });
    if (permission === 'granted') {
      const messaging = getMessaging();
      const messageToken = await getToken(messaging, {
        vapidKey,
      });
      await updateUserDeviceTokens(messageToken);
  }
} */


function onChangeTheme() {
  colorMode.value = colorMode.value === 'light' ? 'dark' : 'light';
}
</script>

<template>
  <div class="user-main h-full px-5 pb-[120px] pt-[30px]">
    <section class="user-main__avatar">
      <img
        class="avatar-image"
        :src="userImage"
        alt="avatar"
      />
    </section>
    <h2 class="user-main__name">
      {{ username }}
    </h2>
    <NuxtLink :to="referralLink" class="user-main__ref" @click="impactOccurred('light')">
      <h3 class="ref-title">{{$t('user.RefClassic')}}</h3>
      <div class="ref-bottom">
        <div class="ref-bottom__price">
          <span class="symbol">$</span>
          {{ formatPrice(bonusBalance) }}
        </div>
        <div class="ref-bottom__link">
          <ChevronRightIcon />
        </div>
      </div>
    </NuxtLink>
    <ul class="user-main__settings">
      <!-- <li>
        <UiButton action theme @click="requestPermission">notify user</UiButton>
      </li> -->
      <button @click="onChangeTheme">change theme: {{ colorMode.value }}</button>
      <li v-for="[key, icon] in Object.entries(icons)" :key="key">
          <NuxtLink
            class="settings-item"
            :to="links[key as keyof typeof links]"
            :target="key === 'support' ? '_blank' : '_self'"
            @click="impactOccurred('soft')"
          >
            <div class="item-icon__wrapper">
              <Component :is="icon" />
            </div>
            <span class="item-text">{{$t(`user.settings.${key}`)}}</span>
            <ChevronRightIcon class="item-chevron" />
          </NuxtLink>
        </li>
    </ul>
  </div>
</template>

<style lang="scss">
@use '~/assets/css/mixins' as mixins;

.user-main {
  height: min-content;

  &__avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto;
    background-color: #fff;

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__name {
    margin-top: 15px;
    font-size: 18px;
    font-weight: 500;
    line-height: 1.2;
    text-align: center;
  }

  &__ref {
    display: block;
    margin-top: 30px;
    padding: 15px;

    @include mixins.gradientCard;

    .ref {
      &-title {
        font-size: 15px;
        font-weight: 500;
        line-height: 1.2;
        color: rgb(255 255 255 / 80%);
      }

      &-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
        margin-top: 42px;

        &__price {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 40px;
          font-weight: 500;
          line-height: 1.2;
          letter-spacing: 1px;
          text-align: left;

          .symbol {
            font-size: 32px;
            font-weight: 400;
            line-height: 1.3;
            color: rgb(255 255 255 / 30%);
          }
        }

        &__link {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          position: relative;
          z-index: 2;
          border-radius: 50%;
          background-color: rgb(17 16 18);
        }
      }
    }
  }

  &__settings {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 15px;
    padding: 15px;
    border-radius: 15px;
    background: rgb(255 255 255 / 5%);

    .settings-item {
      display: flex;
      align-items: center;
      gap: 12px;

      .item {
        &-icon__wrapper {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: rgb(17 16 18);
        }

        &-text {
          font-size: 15px;
          font-weight: 500;
          line-height: 1.2;
          color: rgb(255 255 255 / 80%);
        }

        &-chevron {
          display: block;
          margin-left: auto;
        }
      }
    }
  }
}
</style>