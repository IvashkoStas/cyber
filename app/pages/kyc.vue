<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core';
import { useWebApp } from 'vue-tg';
import { AppRoutes } from '~/constants/app.route';
import { alpha, email, minLength, protonServiceValidator, required, validateAge, validateDateFormat, validateDocumentDate } from '~/utils/validators';
import type { KycDto } from '~~/types/kyc.dto';
import { KycStatus } from '~~/types/kys.status';
import type { VueTelInputValidateData } from '~~/types/vue.tel.validate.data';

definePageMeta({
  middleware: ['no-card', 'no-kyc'],
});

type Steps = 1 | 2 | 3;

const { user } = useUser();
const { kyc, stepPassed: kycStepPassed, kycRequest, patchKyc, hasKycImage } = useKyc();
const { theme, getMainButtonProps } = useShared();
const { setting } = useSetting();
const { impactOccurred } = useVibrate();
const { showAlert } = usePopup();

const route = useRoute();
const router = useRouter();
const step = computed(() => (Number(route.query.step) || 1) as Steps);
const currentStep = shallowRef<Steps>(step.value);
const themeKey = computed(() => theme.colorScheme.value);

watch(currentStep, (step) => {
  router.replace({ query: { step } });
});

onBeforeMount(() => {
  let step = 1;

  if (kycStepPassed.first && !kycStepPassed.second) {
    step = 2;
  }

  if (kycStepPassed.first && kycStepPassed.second && !kycStepPassed.third) {
    step = 3;
  }

  router.replace({ query: { step } });
});

const pending = shallowRef(false);

const phoneData = shallowRef<Partial<VueTelInputValidateData>>({
  formatted: kyc.value?.phone ?? '',
  country: kyc.value?.documentCountry ?? '',
});

const stepOneData = reactive({
  phone: computed(() => phoneData.value?.formatted ?? ''),
  documentCountry: computed(() => phoneData.value?.country ?? ''),
  email: user.value?.email?.toLocaleUpperCase() ?? kyc.value?.email?.toLocaleUpperCase() ?? '',
});

const phoneError = computed(() => {
  if (!phoneData.value?.formatted?.length) {
    return 'shared.labels.required';
  }

  if (phoneData.value?.valid === false) {
    return 'shared.labels.invalidPhone';
  }

  return '';
});

const rulesForStepOneData = {
  phone: {
    required,
  },
  email: {
    email,
    required,
    protonServiceValidator,
  },
};

const stepTwoData = reactive({
  lastName: kyc.value?.lastName?.toLocaleUpperCase() ?? '',
  firstName: kyc.value?.firstName?.toLocaleUpperCase() ?? '',
  bdate: decodeDate(kyc.value?.bdate),
});

const rulesForStepTwoData = {
  lastName: {
    required,
    alpha,
  },
  firstName: {
    required,
    alpha,
  },
  bdate: {
    required,
    minLength,
    validateDateFormat,
    validateAge,
  },
};

const stepThreeData = reactive({
  documentType: kyc.value?.documentType?.toLocaleUpperCase() ?? '',
  documentNumber: kyc.value?.documentNumber?.toLocaleUpperCase() ?? '',
  documentExpireDate: decodeDate(kyc.value?.documentExpireDate),
});

const rulesForStepThreeData = {
  documentType: {
    required,
  },
  documentNumber: {
    required,
  },
  documentExpireDate: {
    required,
    minLength,
    validateDateFormat,
    validateDocumentDate,
  },
};

const stepOne = useVuelidate(rulesForStepOneData, stepOneData);
const stepTwo = useVuelidate(rulesForStepTwoData, stepTwoData);
const stepThree = useVuelidate(rulesForStepThreeData, stepThreeData);

function updatePhoneData(data?: VueTelInputValidateData) {
  if (!data) {
    return;
  }

  phoneData.value = data;
}

function onPrevStep() {
  if (currentStep.value > 1) {
    currentStep.value -= 1;

    return;
  }

  navigateTo(AppRoutes.REQUEST_CARD, {
    replace: true,
  });
}

function formatDate(date: string): string {
  const [day, month, year] = date.split('.');

  return new Date(`${year}-${month}-${day}`).toISOString();
}

function decodeDate(_date?: Nullable<string>): string {
  if (!_date) {
    return '';
  }

  const date = new Date(_date);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function bodyCreator() {
  const body: Partial<KycDto> = {};
  switch (currentStep.value) {
    case 1:
      body.email = stepOne.value.email.$model;
      body.documentCountry = phoneData.value?.country ?? '';
      body.phone = phoneData.value?.formatted?.split(' ').join('') ?? '';
      break;
    case 2:
      body.firstName = stepTwo.value.firstName.$model;
      body.lastName = stepTwo.value.lastName.$model;
      body.bdate = formatDate(stepTwo.value.bdate.$model);
      break;
    case 3:
      body.documentType = stepThree.value.documentType.$model;
      body.documentNumber = stepThree.value.documentNumber.$model;
      body.documentExpireDate = formatDate(stepThree.value.documentExpireDate.$model);
      break;
    default:
      break;
  }

  return body;
}

async function onNextStep(): Promise<void> {
  try {
    pending.value = true;

    await patchKyc(bodyCreator());

    if (currentStep.value === 3) {
      await kycRequest();
      impactOccurred('medium');

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(1);
        }, 300);
      });

      await navigateTo(AppRoutes.BY_CARD);
    } else {
      currentStep.value += 1;
      impactOccurred('light');
      router.replace({ query: { step: currentStep.value } });
    }
  } catch (error: FetchCTX) {
    if (error?.data?.message?.length) {
      showAlert(error?.data?.message);
    }
  } finally {
    pending.value = false;
  }
}

const stepPassed = reactive<Record<Steps, ComputedRef<boolean>>>({
  1: computed(
    () => !!phoneData.value?.valid && !stepOne.value.$invalid && !setting.value?.UNSUPPORTED_COUNTRIES?.includes(phoneData.value?.country ?? ''),
  ),
  2: computed(() => !stepTwo.value.$invalid),
  3: computed(() => !stepThree.value.$invalid && hasKycImage.value),
});

const showUiCustomBackButton = shallowRef(false);

onBeforeMount(() => {
  const isByCard = [KycStatus.ADOPT_PASS, KycStatus.IN_AUDIT, KycStatus.PREMODERATION, KycStatus.READY_FOR_SEND]?.includes(
    kyc.value?.status as KycStatus,
  );

  if (isByCard) {
    navigateTo(AppRoutes.BY_CARD);
  }
});

onMounted(() => {
  window.scrollTo(0, 0);

  setTimeout(() => {
    showUiCustomBackButton.value = true;
  }, 100);
});

onBeforeUnmount(() => {
  showUiCustomBackButton.value = false;
});

const { initData } = useWebApp();

const kycClasses = computed(() => [
  'kyc',
  'px-5',
  'pb-[50px]',
  {
    'kyc--pwa': !initData.length,
  },
]);
</script>

<template>
  <div :class="kycClasses">
    <SharedStepHeader :title="$t(`kyc.steps.${currentStep}.title`)" :current-step="currentStep" :step-count="3" />
    <UiCustomBackButton v-if="showUiCustomBackButton" :key="currentStep" class="mt-[20px]" @click="onPrevStep" />
    <div class="kyc-body">
      <KycFormStepOne
        v-show="currentStep === 1"
        v-model:email="stepOne.email.$model"
        :phone-data="phoneData"
        :disabled-email="!initData.length && !!user?.email?.length"
        :errors="[stepOne.email.$errors[0]?.$message as string, phoneError]"
        @update="updatePhoneData"
      />
      <KycFormStepTwo
        v-show="currentStep === 2"
        v-model:last-name="stepTwo.lastName.$model"
        v-model:first-name="stepTwo.firstName.$model"
        v-model:bdate="stepTwo.bdate.$model"
        :errors="[
          stepTwo.lastName.$errors[0]?.$message as string | undefined,
          stepTwo.firstName.$errors[0]?.$message as string | undefined,
          stepTwo.bdate.$errors[0]?.$message as string | undefined,
        ]"
      />
      <KycFormStepThree
        v-show="currentStep === 3"
        v-model:document-type="stepThree.documentType.$model"
        v-model:document-number="stepThree.documentNumber.$model"
        v-model:document-expire-date="stepThree.documentExpireDate.$model"
        :errors="[
          stepThree.documentNumber.$errors[0]?.$message as string | undefined,
          stepThree.documentExpireDate.$errors[0]?.$message as string | undefined,
        ]"
      />
    </div>
    <!-- <button :disabled="pending || !stepPassed[currentStep]" @click="onNextStep">{{$t('kyc.actions.next')}}</button> -->
    <UiCustomMainButton
      v-if="showUiCustomBackButton"
      :key="themeKey"
      :progress="pending"
      style="margin-top: auto"
      v-bind="getMainButtonProps(pending || !stepPassed[currentStep])"
      :text="$t('kyc.actions.next')"
      @click="onNextStep"
    />
  </div>
</template>

<style lang="scss" scoped>
.kyc {
  max-width: 100vw;
  height: min-content;
  margin-top: 0 !important;

  &--pwa {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }

  &-body {
    margin: 10px 0;
    max-width: 100vw;
  }
}
</style>
