import { AppRoutes } from '~/constants/app.route';

export default defineNuxtRouteMiddleware(() => {
  const { user } = useUser();

  if (user.value?.cards?.length === 0) {
    return navigateTo(AppRoutes.REQUEST_CARD);
  }
});
