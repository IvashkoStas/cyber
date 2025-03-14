import { AppRoutes } from '~/constants/app.route';

export default defineNuxtRouteMiddleware(() => {
  const { isHealthApp } = useShared();

  if (isHealthApp.value) {
    return navigateTo(AppRoutes.WALLET);
  }
});
