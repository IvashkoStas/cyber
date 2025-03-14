import type { PromoCode } from '~~/types/promo.code';

export default  function () {
  const { $fetchInstance } = useNuxtApp();
  const promoCode = useState('promo', () => ref<Nullable<PromoCode>>(null));
  const promoCodeAC = ref<Nullable<AbortController>>(null);

  const showPromoToggle = computed(() => {
    if (!promoCode.value) {
      return true;
    }

    const isExpired = new Date(promoCode.value.expireAt) < new Date();

    if (isExpired) {
      return true;
    }

    return false;
  });

  async function getPromoCode() {
    try {
      const data = await $fetchInstance<PromoCode>('/api/promocode');

      promoCode.value = data;

      return data;
    } catch (error: FetchCTX) {
      console.error('get promocode error: ', error);
      throw new Error(error?.data?.message);
    }
  }

  async function applyPromoCode(code: string) {
    promoCodeAC.value = new AbortController();
    const data = await $fetchInstance<PromoCode>(`/api/promocode/${code}`, {
      method: 'POST',
      signal: promoCodeAC.value.signal,
    });

    promoCode.value = data;

    return data;
  }

  return {
    promoCode,
    promoCodeAC,
    showPromoToggle,
    getPromoCode,
    applyPromoCode,
  };
}