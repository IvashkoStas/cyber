import { AppRoutes } from '~/constants/app.route';
import { Keys } from '~/constants/keys';
import { BalanceSymbol } from '~~/types/balance';
import type { LoginDto } from '~~/types/login.dto';
import type { LoginResponse } from '~~/types/login.response';
import type { User } from '~~/types/user';
import type { UserUpdateDto } from '~~/types/user.update.dto';

export default  function () {
  const USER_URL = 'api/user';
  const pending = useState('user-pending', () => shallowRef(false));
  const token = useCookie(Keys.TOKEN);
  const { $fetchInstance } = useNuxtApp();
  const user = useState('user', () => ref<Nullable<User>>(null));
  const balance = computed(
    () => user.value?.wallet?.balances
      .reduce((acc, balance) => acc += balance.symbol === BalanceSymbol.USDT ? balance.amountUSD : 0, 0) ?? 0,
  );

  const refBalance = computed(
    () => user.value?.wallet?.balances
      .reduce((acc, balance) => acc += balance.symbol !== BalanceSymbol.USDT ? balance.amountUSD : 0, 0) ?? 0,
  );

  const kyc = computed(() => user.value?.kyc);

  const isPremium = computed(() => user.value?.partner?.taxPercentTopUp);

  // const cards = computed(() => user.value?.cards.filter(({ status }) => status !== CardStatus.DELETED_BY_USER) ?? []);

  const firstCard = computed(() => user.value?.cards[0]);

  async function getUser(): Promise<User | undefined> {
    try {
      pending.value = true;
      const data = await $fetchInstance<User>(USER_URL, {
        retry: 3,
        retryDelay: 1000,
      });
      user.value = data;

      return data;
    } catch (error: FetchCTX) {
      if (error.response.statusCode === 401) {
        navigateTo(AppRoutes.AUTH);
      }
      console.error('get user error: ', error);
    } finally {
      pending.value = false;
    }
  }

  async function loginUser(body: LoginDto): Promise<User | undefined> {
    try {
      pending.value = true;
      const data = await $fetchInstance<LoginResponse>(`${USER_URL}/login`, {
        method: 'POST',
        body,
      });

      token.value = data.token;
      user.value = data.user;

      localStorage.setItem(Keys.TOKEN, data.token);

      return data.user;
    } finally {
      pending.value = false;
    }
  }

  async function createUser(code: string, body: LoginDto): Promise<User | undefined> {
    try {
      pending.value = true;
      const data = await $fetchInstance<LoginResponse>(`${USER_URL}/create`, {
        method: 'POST',
        headers: {
          'x-email-code': code,
        },
        body,
      });

      token.value = data.token;
      user.value = data.user;

      return data.user;
    } finally {
      pending.value = false;
    }
  }

  async function updateUser(dto: UserUpdateDto): Promise<User | string>  {
    try {
      pending.value = true;
      const data = await $fetchInstance<User>(USER_URL, {
        method: 'PATCH',
        body: dto,
      });

      if (dto.isOnboarded) {
        window.localStorage.setItem('isOnboarded', 'true');
      }

      user.value = data;

      return data;
    } catch (error: FetchCTX) {
      console.error('update user error: ', error);

      return error?.data.message ?? '';
    } finally {
      pending.value = false;
    }
  }

  async function updateUserDeviceTokens(token: string) {
    if (!user.value) {
      return;
    }

    if (user.value?.deviceTokens?.includes(token)) {
      return;
    }

    const deviceTokens = new Set([token, ...(user.value.deviceTokens?.slice()?.reverse() ?? [])].slice(0, 2));

    updateUser({ deviceTokens: Array.from(deviceTokens) });
  }

  return {
    user,
    pending,
    kyc,
    isPremium,
    firstCard,
    balance,
    refBalance,
    loginUser,
    getUser,
    updateUser,
    createUser,
    updateUserDeviceTokens,
  };
}