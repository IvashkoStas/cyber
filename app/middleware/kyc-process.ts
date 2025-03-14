import { AppRoutes } from '~/constants/app.route';

export default defineNuxtRouteMiddleware(() => {
  const { checkPassed } = useKyc();
  const step = checkPassed();

  if (!step) {
    return;
  }

  return navigateTo({
    path: AppRoutes.KYC,
    query: { step },
    replace: true,
  });
});