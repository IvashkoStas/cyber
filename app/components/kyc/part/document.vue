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

const model = computed({
  get: () => props.modelValue,
  set: (value: string) => emits('update:modelValue', value),
});

const buttons = computed(() => [
  {
    title: t('kyc.steps.3.passport'),
    icon: '/icons/kyc/passport.svg',
  },
  {
    title: t('kyc.steps.3.drivingLicense'),
    icon: '/icons/kyc/drivingLicense.svg',
  },
]);

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
        <UiRadio v-model="model" class="arrow" name="type" :value="String(index + 1)" />
        <div class="icon-wrapper">
          <img :src="icon" :alt="title" />
        </div>
        <p class="title">{{ title }}</p>
      </label>
    </div>
    <label class="step-three__image">
      <input accept=".heic, .heif, image/*," class="step-three__input" type="file" @change="uploadFile($event)" />
      <template v-if="!hasKycImage && !image">
        <img :src="'/icons/kyc/file.svg'" alt="file" class="step-three__image-icon" />
        <p class="step-three__image-description">{{ $t('kyc.steps.3.uploadImage') }}</p>
      </template>
      <Transition name="fade" mode="out-in">
        <img v-if="image" :key="image" :src="image" class="document" alt="document" />
      </Transition>
    </label>
  </div>
</template>

<style lang="scss" scoped>
.kyc-step__three {
  .step-three {
    &__description {
      margin-top: 8px;
      font-size: 14px;
      line-height: 1.2;
      color: var(--input-placeholder);
    }

    &__actions {
      margin: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__button {
      display: flex;
      align-items: center;
      gap: 4px;
      position: relative;
      padding: 12px;
      border-radius: 12px;
      background: var(--bg-block);

      .title {
        font-weight: 400;
        font-size: 14px;
      }

      .icon-wrapper {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .arrow {
        display: block;
        margin-right: 8px;
      }
    }

    &__image {
      width: 100%;
      height: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 12px;
      position: relative;
      border-radius: 15px;
      background: var(--bg-block);
      margin-top: 20px;
      overflow: hidden;
      border: 1px dashed var(--text-primary);

      &-description {
        font-size: 12px;
        color: var(--input-placeholder);
      }

      &-icon {
        height: 40px;
        width: 40px;
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
