<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import DrivingLicenseIcon from '~/assets/icons/shared/_driving-license.svg';
import PassportIcon from '~/assets/icons/shared/_passport.svg';
import PlusIcon from '~/assets/icons/shared/_plus.svg';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

interface Props {
  modelValue: string;
}

interface Emits {
  (event: 'update:modelValue', value: string): void;
}


const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const { t } = useI18n();
const { showAlert } = usePopup();
const { uploadPhoto, hasKycImage, kycImage } = useKyc();

const image = shallowRef(kycImage.value);

const  model = computed({
  get: () => props.modelValue,
  set: (value: string) => emits('update:modelValue', value),
});

const buttons = computed(
  () => [
    {
      title: t('kyc.steps.3.passport'),
      icon: PassportIcon,
    },
    {
      title: t('kyc.steps.3.drivingLicense'),
      icon: DrivingLicenseIcon,
    },
  ],
);

function uploadFile(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    return;
  }

  if (file?.size >= MAX_FILE_SIZE) {
    showAlert(t('shared.labels.photo'));

    return;
  }

  heicConverter(file).then((convertImage) => {
    image.value = URL.createObjectURL(file);
    uploadPhoto(convertImage);
  });
}
</script>

<template>
  <div class="kyc-step__three">
    <p class="step-three__description">{{ $t('kyc.steps.3.description') }}</p>
    <div class="step-three__actions">
      <label v-for="({ title, icon }, index) in buttons" :key="index" class="step-three__button">
        <div class="icon-wrapper">
          <Component :is="icon" />
        </div>
        <p class="title">{{ title }}</p>
        <UiRadio v-model="model" class="arrow" name="type" :value="String(index + 1)"  />
      </label>
    </div>
    <label class="step-three__image">
      <input
        accept=".heic, .heif, image/*,"
        class="step-three__input"
        type="file"
        @change="uploadFile($event)"
      >
      <template v-if="!hasKycImage && !image">
        <PlusIcon class="plus-icon" />
        <p class="step-three__image-description">{{ $t('kyc.steps.3.uploadImage') }}</p>
      </template>
      <Transition name="fade" mode="out-in">
        <img
          v-if="image"
          :key="image"
          :src="image"
          class="document"
          alt="document"
        />
      </Transition>
    </label>
  </div>
</template>

<style lang="scss" scoped>
.kyc-step__three {
  padding: 10px 0 30px;

  .step-three {
    &__description {
      font-size: 14px;
      line-height: 1.2;
      color: rgb(255 255 255 / 50%);
    }

    &__actions {
      margin: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 15px;
      border-radius: 15px;
      background: rgb(255 255 255 / 5%);
    }

    &__button {
      display: flex;
      align-items: center;
      gap: 4px;
      position: relative;

      .icon-wrapper {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #1E1C1F;
      }

      .arrow {
        display: block;
        margin-left: auto;
      }
    }

    &__image {
      width: 100%;
      height: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 3px;
      position: relative;
      border-radius: 15px;
      background: rgb(255 255 255 / 5%);
      margin-top: 20px;
      overflow: hidden;

      &-description {
        font-size: 12px;
        color: rgb(255 255 255 / 50%);
      }

      .plus-icon {
        height: 24px;
        width: 24px;
      }

      .document {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &__input {
      height: 0;
      width: 0;
      position: absolute;
      z-index: -1000;
      opacity: 0;
    }
  }
}
</style>