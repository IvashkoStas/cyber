<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core';
import { useI18n } from 'vue-i18n';
import { LoginWidget, type LoginWidgetUser } from 'vue-tg';
import { AppRoutes } from '~/constants/app.route';
import { Keys } from '~/constants/keys';
import { email, minLengthFunc, required } from '~/utils/validators';
import type { LoginDto } from '~~/types/login.dto';

const toast = useToast();
const CRYPTO_PAY_BOT = 'cryptopaybot.com';
const { loginUser, getUser } = useUser();
const { t } = useI18n();
const { getSetting } = useSetting();
const { getPromoCode } = usePromoCode();
const { getReferral } = useReferral();
const { showAlert } = usePopup();
const token = useCookie(Keys.TOKEN);

const config = useRuntimeConfig().public;
const xTgToken = useCookie<string>(Keys.X_TG_TOKEN);

const botUsername = computed(() => window.location?.hostname?.includes(CRYPTO_PAY_BOT) ? 'CyberbasePay_bot' : 'cyberpay_node_dev_bot');

const sending = shallowRef(false);

const state = reactive<LoginDto>({
  email: '',
  password: '',
});

const rules = {
  email: {
    required,
    email,
  },
  password: {
    required,
    minLength: minLengthFunc(8),
  },
};


async function authThroughTg(user: LoginWidgetUser) {
  const xtgTokenJson = JSON.stringify(user);
  xTgToken.value = xtgTokenJson;
  localStorage.setItem(Keys.X_TG_TOKEN, xtgTokenJson);
  xTgToken.value = JSON.stringify(user);
  await new Promise((resolve) => setTimeout(resolve, 500));
  try {
    await getUser();
    navigateTo(AppRoutes.WALLET);
  } catch (error: FetchCTX) {
    if (error?.data?.message?.length) {
      showAlert(error?.data?.message);
    }
  }
}

const data = useVuelidate(rules, state);

async function getOtherData() {
  try {
    await Promise.all([
      getSetting(),
      getReferral(),
      getPromoCode(),
    ]);
  } catch (error: unknown) {
    console.error('other data error: ', error);
  }
}

async function auth() {
  try {
    sending.value = true;
    const user = await loginUser(state);
    await getOtherData();
    navigateTo(user?.isOnboarded ? AppRoutes.WALLET : AppRoutes.ONBOARDING);
  } catch(error: FetchCTX) {
    toast(error.data.message ?? t('shared.labels.error'), {
      type: 'error',
    });
  } finally {
    sending.value = false;
  }
}

onMounted(async () => {
  if (token.value || xTgToken.value) {
    await getUser();
    navigateTo(AppRoutes.WALLET);
  }
});
</script>

<template>
  <div class="px-4 pb-[120px] pt-[50px] flex flex-col items-center gap-4">
    <img src="/icons/manifest/icon512.webp" class="icon" alt="icon" />
    <h1>{{ $t('authScreen.title') }}</h1>
    <LoginWidget
      :bot-username="botUsername"
      user-photo
      corner-radius="10"
      @auth="authThroughTg"
    />
    <UiInput
      v-model.trim="data.email.$model"
      inputmode="email"
      type="email"
      :title="$t('authScreen.email.title')"
      :placeholder="$t('authScreen.email.placeholder')"
      :error="$t(data.email.$errors?.at(0)?.$message?.toString() ?? '')"
    />
    <UiInput
      v-model.trim="data.password.$model"
      type="password"
      :title="$t('authScreen.password.title')"
      no-upper
      :placeholder="$t('authScreen.password.placeholder')"
      :error="$t(data.password.$errors?.at(0)?.$message?.toString() ?? '')"
    />
    <UiButton
      class="mt-5"
      :disabled="data.$invalid || sending"
      theme
      action
      @click="auth"
    >
      {{ $t('authScreen.title') }}
    </UiButton>
    <NuxtLink :to="AppRoutes.REGISTER" class="register-link">
      {{ $t('authScreen.register') }}
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  width: 250px;
  height: 250px;
  display: block;
  margin-bottom: 50px;
  border-radius: 50%;
}

.register-link {
  color: #fff;
}
</style>