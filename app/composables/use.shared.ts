import { useWebAppTheme } from 'vue-tg';
import { AppRoutes } from '~/constants/app.route';
import { Keys } from '~/constants/keys';
import type { ConfirmationType } from '~~/types/confirmation.type';
import type { NetworkAddressWithSymbol } from '~~/types/network.address';
import type { Tx } from '~~/types/tx';

export default function () {
  const { $fetchInstance } = useNuxtApp();
  const appConfig = useAppConfig();
  const xTgToken = useCookie<string>(Keys.X_TG_TOKEN);
  const { user, balance, refBalance } = useUser();
  const { networks } = useWallet();
  const { setting } = useSetting();
  const { promoCode } = usePromoCode();
  const isHealthApp = useState('health', () => shallowRef(true));

  const drawers = useState('drawers', () => reactive({
    starKyc: false,
    kyc: false,
    endKyc: false,
    promo: false,
  }));

  const allowNetworks = computed<NetworkAddressWithSymbol[]>(() => {
    return user.value?.wallet.balances
      .filter(
        ({ network }) => setting.value?.WITHDRAW_NETWORKS?.includes(network) && networks.value?.find((n) => n.network === network),
      ).map(({ symbol, network }) => {
        const { address } = networks.value?.find((n) => n.network === network) ?? { address : ''};

        return {
          address,
          network,
          symbol,
        };
      }) as NetworkAddressWithSymbol[];
  });

  const refLink = computed(() => {
    if (!user.value || !setting.value) {
      return '';
    }
    const { TELEGRAM_BOT_USERNAME: botName } = setting.value;
    const { telegramId } = user.value;

    return `https://t.me/${botName}?start=${telegramId}`;
  });


  const cardPrice = computed(() => {
    const { CARD_PRICE_USD } = setting.value ?? { CARD_PRICE_USD : 0 };

    if (!promoCode.value || !CARD_PRICE_USD) {
      return CARD_PRICE_USD;
    }

    const discount = (CARD_PRICE_USD * promoCode.value.discountPercent) / 100;

    const price = CARD_PRICE_USD - discount;

    return price;
  });

  const theme = useWebAppTheme();

  const mainButtonProps = computed(() => {
    return {
      color: appConfig.theme.main,
      textColor: appConfig.theme.mainColor,
    };
  });

  function getMainButtonProps(isDisabled: boolean) {
    if (!isDisabled) {
      return mainButtonProps.value;
    }

    return {
      color: '#102626',
      textColor: '#ffffff',
      disabled: true,
    };
  }

  const isHaveMoney = computed(() => {
    return balance.value >= cardPrice.value;
  });

  const isHaveMoneyWithRef = computed(() => {
    if (isHaveMoney.value) {
      return true;
    }

    return refBalance.value >= cardPrice.value;
  });

  async function getTransactions(params?: Record<string, unknown>) {
    try {
      return await $fetchInstance<Tx>('/api/tx', {
        params,
      });

    } catch (error) {
      console.error('get tx error: ', error);

      return {
        offset: 0,
        limit: 10,
        transactions: [],
        total: 0,
        totalUSD: 0,
      };
    }
  }

  async function checkHealth() {
    try {
      const { status } = await $fetchInstance<{ status: string }>('/api/healthcheck', {
        retry: 3,
        retryDelay: 1000,
      });

      if (status.toLowerCase() !== 'ok') {
        isHealthApp.value = false;

        return await navigateTo(AppRoutes.HEALTH_ERROR);
      }

      isHealthApp.value = true;

    } catch(error) {
      isHealthApp.value = true;
      isHealthApp.value = false;

      return await navigateTo(AppRoutes.HEALTH_ERROR);
    }
  }

  function toggleDrawers(key: keyof typeof drawers.value, state: boolean = false) {
    document.body.classList[state ? 'add' : 'remove']('stop-scroll');

    drawers.value = {
      ...drawers.value,
      [key]: state,
    };
  }

  async function getCodeByConfirm(email: string, type: ConfirmationType): Promise<string | undefined> {
    try {
      await $fetchInstance('/api/mail/code', {
        method: 'POST',
        body: {
          email,
          type,
        },
      });

      return;
    } catch(error: FetchCTX) {
      return error.data?.message ?? '';
    }
  }

  function getXTgInitData() {
    if (import.meta.env.DEV) {
      const { tgInit } = useRuntimeConfig().public;

      return tgInit;
    }

    if (window?.Telegram?.WebApp.initData?.length) {
      return window?.Telegram?.WebApp.initData;
    }

    if (xTgToken.value) {
      return JSON.stringify(xTgToken.value);
    }

    return '';
  }

  return {
    refLink,
    isHaveMoney,
    isHealthApp,
    drawers,
    theme,
    allowNetworks,
    getTransactions,
    checkHealth,
    toggleDrawers,
    cardPrice,
    isHaveMoneyWithRef,
    mainButtonProps,
    getMainButtonProps,
    getCodeByConfirm,
    getXTgInitData,
  };
}