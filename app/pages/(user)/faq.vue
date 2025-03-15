<script lang="ts" setup>
import { AppRoutes } from '~/constants/app.route';

definePageMeta({
  middleware: 'onboard',
});
</script>


<template>
  <div class="faq h-full px-4 pb-[120px] pt-[30px]">
    <UiCustomBackButton @click="$router.replace(AppRoutes.USER)" />
    <h2 class="faq-title">{{$t('faqPage.title')}}</h2>
    <div class="faq-body">
      <SharedCollapse
        v-for="n in 10"
        :key="n"
        :title="$t(`faqPage.info.${n}.question`)"
        :description="$t(`faqPage.info.${n}.answer`)"
      />
    </div>
  </div>
</template>

<style lang="scss">
.faq {
  &-title {
    font-size: 20px;
    font-weight: 500;
    line-height: 1.2;
    text-align: left;
  }

  &-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 30px;
  }
}
</style>