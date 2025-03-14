import { AppRoutes } from '~/constants/app.route';

export default defineNuxtRouteMiddleware(() => {
  const { user } = useUser();
  if (user.value?.cards?.length) {
    return navigateTo(AppRoutes.CARDS);
  }
});
