import type { Card } from '~~/types/card';
import type { CardChangePinDto } from '~~/types/card.change.pin.dto';
import type { ReplenishCardDto } from '~~/types/replenish.card.dto';

export default  function () {
  const { $fetchInstance } = useNuxtApp();
  const card = useState('card', () => ref<Nullable<Card>>(null));


  async function getCardById(cardId: number) {
    try {
      const data = await $fetchInstance<Card>(`/api/card/${cardId}`);
      card.value = data;

      return data;
    } catch (error) {
      console.error('get card error: ', error);
    }
  }

  async function onTopUpCard(cardId: number, dto: ReplenishCardDto) {
    try {
      const data = await $fetchInstance(`/api/card/${cardId}/replenish`, {
        method: 'POST',
        body: dto,
      });

      return data;
    } catch (error: FetchCTX) {
      console.error('post replenish card error: ', error);
      throw new Error(error?.data?.message);
    }
  }

  async function onRequestCard(dto?: { balanceId: number }) {
    try {
      const data = await $fetchInstance('/api/card', {
        method: 'POST',
        body: dto,
      });

      return data;
    } catch (error: FetchCTX) {
      console.error('post request card error: ', error);
      throw new Error(error?.data?.message);
    }
  }

  async function sendCardReplenishEstimate(cardId: number, dto: ReplenishCardDto) {
    return await $fetchInstance<string>(`/api/card/${cardId}/replenish/estimate`, {
      method: 'POST',
      body: dto,
    });
  }

  async function patchPin(cardId: string, dto: CardChangePinDto) {
    try {
      const data = await $fetchInstance(`/api/card/pin/${cardId}`, {
        method: 'PATCH',
        body: dto,
      });

      return data;
    } catch (error: FetchCTX) {
      console.error('patch card pin error: ', error);
      throw new Error(error?.data?.message);
    }
  }


  return {
    card,
    getCardById,
    onTopUpCard,
    onRequestCard,
    patchPin,
    sendCardReplenishEstimate,
  };
}