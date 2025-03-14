import { AppRoutes } from '~/constants/app.route';

export default defineNuxtRouteMiddleware(() => {
  const { user } = useUser();

  if (user.value?.isOnboarded === false) {
    return navigateTo(AppRoutes.ONBOARDING);
  }
});
