<script lang="ts" setup>
import type { ReferralLine } from '~~/types/referral';

interface Props {
  lines?: ReferralLine[]
}
defineProps<Props>();

const { getLineDescription } = useSetting();

function getReferralItemClasses(active: boolean) {
  return [
    'referral-structure__item',
    {
      'referral-structure__item--active': active,
    },
  ];
}
</script>

<template>
  <div v-if="lines?.length" class="referral-structure">
    <h3 class="referral-structure__title">
     {{ $t('referralDepth.programStructure')}}
    </h3>
    <div class="referral-structure__list-wrapper">
      <ul class="referral-structure__list">
      <li
        v-for="(line, index) in lines"
        :key="index"
        :class="getReferralItemClasses(line.active)"
      >
        <div class="item-left">
          <p class="item-left__title">
            {{ $t("referralDepth.levelNumber", { level: line.depth }) }}
          </p>
          <p class="item-left__description">
            {{ $t('referralDepth.description', getLineDescription(line.depth)) }}
          </p>
        </div>
        <div v-if="!line.active" class="item-right">
          <span class="item-right--highlight">{{ line.referrals }}</span>/{{ line.referralsNeed }}
        </div>
      </li>
    </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.referral-structure {
  width: 100%;
  // height: 200px;
  padding: 15px;
  gap: 0px;
  border-radius: 15px;
  background-color: #101011;
  overflow: hidden;

  &__title {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.2;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }

  &__list {
    min-height: 210px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-left: 15px;

    &-wrapper {
      height: 170px;
      // overflow-y: auto;
      margin-top: 20px;
    }
  }

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px 10px 10px;
    background-color: rgba($color: #fff, $alpha: 0.05);
    border-radius: 10px;
    position: relative;

    &:before {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      position: absolute;
      left: -15px;
      top: 50%;
      z-index: 1;
      transform: translateY(-50%);
      background-color: #404041;
      border-radius: 50%;
    }

    &:after {
      content: '';
      display: block;
      width: 1px;
      height: calc(100% + 10px);
      position: absolute;
      left: -10px;
      top: 0;
      background-color: #404041;
      border-radius: 50%;
    }

    &:first-child::after {
      transform: translateY(50%);
    }

    &:last-child::after {
      height: 50%;
    }

    &--active {
      background: linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),
        linear-gradient(68.19deg, rgba(48, 44, 72, 0.2) 64.5%, rgba(84, 52, 86, 0.2) 96.74%);

        &::before,
        &::after {
          background-color: #fff;
        }

        .item-left {
          &__title {
            color: #fff;
          }
        }
    }

    .item-left {
      color: rgba(255, 255, 255, 0.5);

      &__title {
        font-size: 15px;
        font-weight: 500;
        line-height: 1.2;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
        color: rgba(255, 255, 255, 0.5);
      }

      &__description {
        margin-top: 5px;
        font-size: 13px;
        font-weight: 400;
        line-height: 15.85px;
        text-underline-position: from-font;
        text-decoration-skip-ink: none;
      }
    }

    .item-right {
      padding: 2px 6px;
      border-radius: 5px;
      background: #FFFFFF1A;
      font-size: 13px;
      font-weight: 400;
      line-height: 1.2;
      text-align: center;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
      color: rgba(255, 255, 255, 0.5);

      &--highlight {
        color: #4EC68D;
      }
    }
  }
}
</style>
