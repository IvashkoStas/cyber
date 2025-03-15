<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core';
import { useI18n } from 'vue-i18n';
import { AppRoutes } from '~/constants/app.route';
import { Keys } from '~/constants/keys';
import { checkPassword, confirmPassword, email, protonServiceValidator, required } from '~/utils/validators';
import { ConfirmationType } from '~~/types/confirmation.type';
import type { LoginDto } from '~~/types/login.dto';

type Steps = 1 | 2 | 3;

const endTime = useCookie(Keys.REGISTER_EMAIL_END_TIME);

const { t } = useI18n();
const { createUser } = useUser();
const { getMainButtonProps, getCodeByConfirm } = useShared();
const { showAlert } = usePopup();

const currentStep = shallowRef<Steps>(1);
const pending = shallowRef(false);

const stepPassed = reactive<Record<Steps, ComputedRef<boolean>>>({
  1: computed(() => !stepOne.value.$invalid),
  2: computed(() => !stepTwo.value.$invalid),
  3: computed(() => !stepThree.value.$invalid),
});

function onPrevStep() {
  if (currentStep.value > 1) {
    currentStep.value -= 1;

    return;
  }

  navigateTo(AppRoutes.AUTH, {
    replace: true,
  });
}

async function sendConfirmCodeByEmail() {
  const mbMessage = await getCodeByConfirm(stepOneData.email, ConfirmationType.REGISTRATION);

  if (mbMessage?.length) {
    showAlert(mbMessage);

    return false;
  }

  endTime.value = String(Date.now() + 61000);

  return true;
}

const stepActions = {
  1: stepOneAction,
  2: stepTwoAction,
  3: stepThreeAction,
};

async function onNextStep() {
  try {
    pending.value = true;
    await stepActions[currentStep.value]();
  } finally {
    pending.value = false;
  }
}

async function stepOneAction() {
  if (await sendConfirmCodeByEmail()) {
    currentStep.value = 2;
  }
}

function stepTwoAction() {
  currentStep.value = 3;
}

async function stepThreeAction() {
  const body: LoginDto = {
    email: stepOneData.email,
    password: stepThreeData.password,
  };

  try {
    const user = await createUser(stepTwoData.code, body);
    navigateTo(user?.isOnboarded ? AppRoutes.WALLET : AppRoutes.ONBOARDING);
  } catch (error: FetchCTX) {
    if (error?.data?.message?.length) {
      showAlert(error?.data?.message);
    }
  }
}

const stepOneData = reactive({
  email: '',
});


watch(() => stepOneData.email, (value, prevValue) => {
  if (endTime.value && value !== prevValue) {
    endTime.value = null;
  }
});

const stepTwoData = reactive({
  code: '',
});

const stepThreeData = reactive({
  password: '',
  confirmPassword: '',
});

const rulesForStepOneData = () => ({
  email: {
    email,
    required,
    protonServiceValidator,
  },
});

const rulesForStepTwoData = () => ({
  code: {
    required,
    minLength: minLengthFunc(6),
  },
});

const rulesForStepThreeData = () => ({
  password: {
    required,
    checkPassword,
  },
  confirmPassword: {
    required,
    checkPassword,
    confirmed: confirmPassword(stepThreeData.password),
  },
});


const stepOne = useVuelidate(rulesForStepOneData, stepOneData);
const stepTwo = useVuelidate(rulesForStepTwoData, stepTwoData);
const stepThree = useVuelidate(rulesForStepThreeData, stepThreeData);
</script>

<template>
  <div class="register px-4 pb-[50px]">
    <SharedStepHeader
      :title="$t(`registerScreen.steps.${currentStep}.title`)"
      :current-step="currentStep"
      :step-count="3"
    />
    <UiCustomBackButton
      :key="currentStep"
      class="mt-[20px]"
      @click="onPrevStep"
    />
    <div class="register-body">
      <RegisterStepOne
        v-show="currentStep === 1"
        key="1"
        v-model="stepOneData.email"
        :error="stepOne.email.$errors[0]?.$message?.toString()"
      />
      <RegisterStepTwo
        v-show="currentStep === 2"
        :key="String(email + '2')"
        v-model="stepTwo.code.$model"
        :email="stepOneData.email"
        :focus="currentStep === 2"
        @resend-code="sendConfirmCodeByEmail"
      />
      <RegisterStepThree
        v-show="currentStep === 3"
        :key="String(email + '3')"
        v-model:password="stepThree.password.$model"
        v-model:confirm-password="stepThree.confirmPassword.$model"
        :errors="[
          stepThree.password.$errors[0]?.$message?.toString(),
          stepThree.confirmPassword.$errors[0]?.$message?.toString(),
        ]"
      />
    </div>
    <UiCustomMainButton
      :progress="pending"
      style="margin-top: auto;"
      v-bind="getMainButtonProps(pending || !stepPassed[currentStep])"
      :text="$t('kyc.actions.next')"
      @click="onNextStep"
    />
  </div>
</template>

<style lang="scss">
.register {
  display: flex;
  flex-direction: column;
  height: 100dvh;

  &-body {
    margin: 10px 0;
    max-width: 100vw;
  }
}
</style>