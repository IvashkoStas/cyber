import { AppRoutes } from '~/constants/app.route';
import { KycStatus } from '~~/types/kys.status';

export default defineNuxtRouteMiddleware(() => {
  const { user } = useUser();
  const abortStatuses = [KycStatus.REFUSE, KycStatus.NONE];


  if (!user.value?.kyc || abortStatuses?.includes(user.value?.kyc.status)) {
    return;
  }

  if (user.value.kyc.status === KycStatus.ADOPT_PASS && !user.value.cards?.length) {
    return navigateTo(AppRoutes.BY_CARD);
  }

  return navigateTo(AppRoutes.CARDS);
});
