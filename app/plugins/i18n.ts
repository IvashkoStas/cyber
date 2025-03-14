import { createI18n } from 'vue-i18n';
import en from '~/locales/en.json';
import ru from '~/locales/ru.json';

const browserLocale = navigator.language.split('-')?.at(0) ?? 'en';

const locales = ['en', 'ru'];

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    warnHtmlMessage: false,
    legacy: true,
    locale: locales.find((l) => l === browserLocale) ??  'en',
    fallbackLocale: 'en',
    messages: {
      en,
      ru,
    },
  });

  vueApp.use(i18n);
});
