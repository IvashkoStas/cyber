import type { PartnerReferral, Referral } from '~~/types/referral';

export default  function () {
  const { $fetchInstance } = useNuxtApp();

  const referral = useState('referral', () => ref<Nullable<Referral>>(null));

  const bonusBalance = computed(() => referral.value?.balance ?? 0);

  async function getPartnerReferrals(depth: number, params?: Record<string, unknown>) {
    const url = `/api/referral/depth/${depth}`;
    try {
      return await $fetchInstance<PartnerReferral>(url, params);
    } catch(error) {
      console.error('get partner referral error: ', error);
    }
  }

  async function getReferral() {
    try {
      const data = await $fetchInstance<Referral>('/api/referral');
      referral.value = data;

      return data;
    } catch (error) {
      console.error('get referral error: ', error);
    }
  }

  async function onSwapRef(dto: { amount: number }) {
    try {
      const data = await $fetchInstance('/api/wallet/swap-ref', {
        method: 'POST',
        body: dto,
      });

      return data;
    } catch (error: FetchCTX) {
      console.error('post swap ref error: ', error);
      throw new Error(error?.data?.message);
    }
  }

  return {
    referral,
    bonusBalance,
    getReferral,
    getPartnerReferrals,
    onSwapRef,
  };
}