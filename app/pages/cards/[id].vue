<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import CopyIcon from '~/assets/icons/shared/_copy.svg';
import { AppRoutes } from '~/constants/app.route';
import type { Card } from '~~/types/card';

definePageMeta({
  middleware: ['card'],
});

type CardShowData = Pick<Card, 'encodedNumber' | 'expireAt' | 'cvv' | 'pin'>

const route = useRoute();
const { t } = useI18n();
const toast = useToast();
const { card, getCardById } = useCards();
const { user } = useUser();

await getCardById(Number(route.params.id));

const cardNumberEncoded = computed(() => {
  if (!card.value) {
    return '';
  }

  const number = card.value.encodedNumber.length ? card.value.encodedNumber : card.value?.last4CardNumber?.padStart(16, '1');

  return number.replace(/(.{4})/g, '$1 ');
});

const cardNumber = computed(() => {
  if (!card.value?.last4CardNumber?.length) {
    return '';
  }

  return card.value?.last4CardNumber?.padStart(16, '*');
});


const visibleFields = reactive<Record<keyof CardShowData, boolean>>({
  encodedNumber: false,
  expireAt: false,
  cvv: false,
  pin: false,
});

const cardData = computed(() => {
  if (!card.value) {
    return [];
  }

  const cardNumberWithFormat = cardNumber.value.replace(/(.{4})/g, '$1 ');

  return [
    {
      placeholder: t('card.number'),
      fieldValue: visibleFields.encodedNumber ?  cardNumberEncoded : cardNumberWithFormat,
      key: 'encodedNumber' as keyof CardShowData,
    },
    {
      placeholder: t('card.expiration'),
      fieldValue: fixCardExpiration(card.value.expireAt),
      key: 'expireAt' as keyof CardShowData,
    },
    {
      placeholder: t('card.cvv'),
      fieldValue: visibleFields.cvv ? card.value.cvv : '***',
      key: 'cvv' as keyof CardShowData,
    },
    // {
    //   placeholder: t('card.pin'),
    //   fieldValue: visibleFields.pin ? card.value.pin : '****',
    //   key: 'pin' as keyof CardShowData,
    // },
  ];
});

function onCopy(key: keyof CardShowData) {
  visibleFields[key] = true;

  if (key !== 'pin') {
    onCopyValue(card.value?.[key]);
  }
}

async function onCopyValue(value?: string) {
  if (!value?.length) {
    return;
  }

  try {
    await copyTextToClipboard(value);
    toast(t('shared.labels.copied'), {
      type: 'success',
    });
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
<div class="card h-full px-4 pb-[120px] pt-[30px]">
  <UiCustomBackButton @click="$router.replace(AppRoutes.CARDS)" />
  <CardPayment
    class="mt-12"
    :number="cardNumber"
    :expiration="card?.expireAt"
    :card-network="card?.network"
    :status="card?.status"
    :type="user?.partner?.design ?? card?.partner?.design"
  />
  <ul class="card-info">
    <li v-for="{ placeholder, fieldValue, key } in cardData" :key="key" :style="{ gridArea: key }">
      <button class="card-info__item" @click="onCopy(key)">
        <div class="placeholder">{{ placeholder }}</div>
        <div class="value">
          {{ fieldValue }}
          <CopyIcon v-if="key !== 'pin'" />
        </div>
      </button>
    </li>
  </ul>
</div>
</template>

<style lang="scss">
.card {
  height: min-content;

  &-info {
    display: grid;
    grid-template-areas:
      'encodedNumber encodedNumber'
      'expireAt cvv'
    ;
    gap: 12px;
    margin-top: 20px;

    &__item {
      width: 100%;

      .placeholder {
        font-size: 14px;
        line-height: 1.2;
        text-align: left;
      }

      .value {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 10px 10px 13px;
        margin-top: 7px;
        border-radius: var(--radius);
        background-color: var(--input-bg);
        font-size: 14px;
        line-height: 1.2;
        letter-spacing: 3px;
      }
    }
  }
}
</style>