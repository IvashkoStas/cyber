import { Network  } from '~~/types/network';
// import type { Wallet } from '~~/types/wallet';
import type { WithdrawDto } from '~~/types/withdraw.dto';
import type { NetworkAddressWithSymbol } from '~~/types/network.address';

export default  function () {
  const { $fetchInstance } = useNuxtApp();
  const { user } = useUser();
  const wallet = computed(() => user.value?.wallet);

  const networks = computed(
    () => wallet.value?.assets?.filter(
      ({ network }) => network !== Network.BASE) as NetworkAddressWithSymbol[],
    );

/*   async function getWallet() {
    try {
      const data = await $fetchInstance<Wallet>('/api/wallet');
      wallet.value = data;

      return data;
    } catch (error) {
      console.error('get wallet error: ', error);
    }
  } */

  async function sendWalletWidthdraw(dto: WithdrawDto) {
    await $fetchInstance<string>('/api/wallet/withdraw', {
      method: 'POST',
      body: dto,
    });
  }


  async function sendWalletWidthdrawEstimate(dto: WithdrawDto) {
    return await $fetchInstance<string>('/api/wallet/withdraw/estimate', {
      method: 'POST',
      body: dto,
    });
  }

  return {
    wallet,
    networks,
    sendWalletWidthdraw,
    sendWalletWidthdrawEstimate,
  };
}