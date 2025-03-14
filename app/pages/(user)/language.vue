<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { AppRoutes } from '~/constants/app.route';
import { LanguageCode } from '~~/types/language.code';

definePageMeta({
  middleware: 'onboard',
});

const supportedLanguage = [LanguageCode.RU, LanguageCode.EN];

const hapticFeedback = useVibrate();
const { t } = useI18n();
const { user, updateUser } = useUser();
const { showAlert } = usePopup();

const selectedLanguage = shallowRef<Nullable<LanguageCode>>(getInitialLanguage());

const languages = computed(() => [
  {
    title: t('languagePage.russian'),
    code: LanguageCode.RU,
  },
  {
    title: t('languagePage.english'),
    code: LanguageCode.EN,
  },
]);


const dropMenuTitle = computed(() => {
  if (user.value?.languageCode === LanguageCode.RU) {
    return t('languagePage.russian');
  }

  if (user.value?.languageCode === LanguageCode.EN) {
    return t('languagePage.english');
  }

  return t('languagePage.title');
});

async function onSelectLanguage(code: LanguageCode) {
  try {
    if (code === selectedLanguage.value) {
      return;
    }

    await updateUser({ languageCode: code });
    selectedLanguage.value = code;
    hapticFeedback.selectionChanged();

  } catch (error: FetchCTX) {
        if (error?.data?.message?.length) {
      showAlert(error?.data?.message);
    }
  }
}

function getFlag(code?: LanguageCode) {
  if (code === LanguageCode.RU) {
    return '/icons/flags/ru.svg';
  }

  return '/icons/flags/en.svg';
}

function getInitialLanguage() {
  if (user.value?.languageCode) {
    return user.value?.languageCode;
  }
  const navigatorLanguage = navigator.language.split('-')[0];

  if (supportedLanguage?.includes(navigatorLanguage as LanguageCode)) {
    return navigatorLanguage as LanguageCode;
  }

  return LanguageCode.EN;
}
</script>

<template>
  <div class="language h-full px-5 pb-[120px] pt-[30px]">
    <UiCustomBackButton @click="$router.replace(AppRoutes.USER)" />
    <h2 class="language-title">
      {{ $t('languagePage.title') }}
    </h2>
    <UiDropMenu
      class="operation-filters__type mt-5" :title="dropMenuTitle"
    >
      <template #icon>
        <span class="language-flag">
          <img :src="getFlag(user?.languageCode)" class="language-flag__image" alt="flag" />
        </span>
      </template>
      <UiDropMenuItem
        v-for="{ title, code } in languages"
        :key="code"
        :selected="code === selectedLanguage"
        :title="title"
        @click="onSelectLanguage(code)"
      >
        <span class="language-flag">
          <img :src="getFlag(code)" class="language-flag__image" :alt="code">
        </span>
      </UiDropMenuItem>
    </UiDropMenu>
  </div>
</template>

<style lang="scss">
.language {
  &-title {
    font-size: 20px;
    font-weight: 500;
    line-height: 1.2;
    text-align: left;
  }

  &-flag {
    display: inline-flex;
    width: 20px;
    height: 20px;
    overflow: auto;
    border-radius: 50%;
    margin-right: 10px;

    &__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>