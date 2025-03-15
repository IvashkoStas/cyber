<script lang="ts" setup>
import { useWebApp } from 'vue-tg';
import ArrowNextIcon from '~/assets/icons/arrows/arrow-next.svg';
import { AppRoutes } from '~/constants/app.route';
import { SUPPORT_LINK } from '~/constants/links';
import { formatPrice } from '~/utils/format.price';

definePageMeta({
  middleware: 'onboard',
});

const USER_PHOTO = '/images/user.png';

const icons = {
  setting: 'lang',
  shield: 'shield',
  support: 'support',
  faq: 'faq',
};

const links = computed(() => ({
  setting: AppRoutes.LANGUAGE,
  shield: AppRoutes.LOCK,
  support: SUPPORT_LINK,
  faq: AppRoutes.FAQ,
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
</script>

<template>
  <div class="user-main h-full pb-[120px]">
    <section class="user-main__avatar-wrapper">
      <div class="user-main__avatar">
        <img
          class="avatar-image"
          :src="userImage"
          alt="avatar"
        />
      </div>
    </section>
    <section class="px-4">
      <h2 class="user-main__name">
        {{ username }}
      </h2>
      <NuxtLink :to="referralLink" class="user-main__ref" @click="impactOccurred('light')">
        <h3 class="ref-title">{{$t('user.RefClassic')}}</h3>
        <div class="ref-bottom">
          <div class="ref-bottom__price">
            {{ formatPrice(bonusBalance) }}
            <span class="symbol">USDT</span>
          </div>
        </div>
      </NuxtLink>
      <ul class="user-main__settings">
        <li v-for="[key, icon] in Object.entries(icons)" :key="key">
          <NuxtLink
            class="settings-item"
            :to="links[key as keyof typeof links]"
            :target="key === 'support' ? '_blank' : '_self'"
            @click="impactOccurred('soft')"
          >
            <div class="item-icon__wrapper">
              <img :src="`/icons/user/${icon}.svg`" />
            </div>
            <span class="item-text">{{$t(`user.settings.${key}`)}}</span>
            <ArrowNextIcon class="item-chevron" />
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss">
.user-main {
  height: min-content;

  &__avatar-wrapper {
    padding-top: 70px;
    background-repeat: no-repeat;
    background-image: url('/main.svg');
  }

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
    margin-top: 12px;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
  }

  &__ref {
    display: block;
    margin-top: 20px;
    padding: 16px;
    border-radius: var(--radius);
    background-color: var(--accent-block);

    .ref {
      &-title {
        font-size: 13px;
        color: var(--primary-color);
      }

      &-bottom {
        margin-top: 4px;

        &__price {
          display: flex;
          align-items: baseline;
          gap: 8px;
          font-size: 34px;
          font-weight: 500;

          .symbol {
            font-size: 18px;
            font-weight: 200;
          }
        }
      }
    }
  }

  &__settings {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 16px;

    .settings-item {
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      overflow: hidden;
      border-radius: var(--radius);

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background-color: var(--bg-block);
        opacity: 0.7;
      }

      .item {
        &-icon__wrapper {
          position: relative;
          z-index: 1;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: var(--bg-block);
        }

        &-text {
          position: relative;
          z-index: 1;
          font-size: 14px;
          color: var(--primary-color);
        }

        &-chevron {
          position: relative;
          z-index: 1;
          display: block;
          margin-left: auto;
          color: var(--main);
        }
      }
    }
  }
}
</style>