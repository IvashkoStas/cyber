import type { Setting } from '~~/types/setting';

export default  function () {
  const { $fetchInstance } = useNuxtApp();
  const setting = useState('setting', () => ref<Nullable<Setting>>(null));

  const minAmountReplenishment = computed(() => setting.value?.CARD_MIN_REPLENUSH_USD ?? 0);
  const cardReplenishPercent = computed(() => setting.value?.CARD_REPLENISH_TAX_PERCENT ?? 0);
  const cardReplenishMinTax = computed(() => setting.value?.CARD_REPLENISH_MIN_TAX_USD ?? 0);



  async function getSetting() {
    try {
      const data = await $fetchInstance<Setting>('/api/setting');
      setting.value = data;

      return data;
    } catch (error) {
      console.error('get setting error: ', error);
    }
  }


  function getLineDescription(depth: number) {
    if (depth < 1) {
      return {
        percent: 0,
        dollar: 0,
      };
    }

    const index = depth - 1;
    const cardPriceUsd = setting.value?.CARD_PRICE_USD ?? 0;
    const referralPercentByu = setting.value?.REFERRAL_PERCENTS_BUY?.at(index) ?? 1;

    return {
      percent: setting.value?.REFERRAL_PERCENTS_TOPUP[index],
      dollar: Math.floor(cardPriceUsd * referralPercentByu) / 100,
    };
  }

  return {
    setting,
    minAmountReplenishment,
    getSetting,
    cardReplenishPercent,
    cardReplenishMinTax,
    getLineDescription,
  };
}