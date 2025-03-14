import { AppRoutes } from '~/constants/app.route';
import { KycStatus } from '~~/types/kys.status';

export default defineNuxtRouteMiddleware(() => {
  const { user } = useUser();

  const abortStatuses = [
    KycStatus.ADOPT_PASS,
    KycStatus.IN_AUDIT,
    KycStatus.WAIT_AUDIT,
    KycStatus.PREMODERATION,
    KycStatus.READY_FOR_SEND,
  ];

  if (user.value?.cards?.length) {
    return navigateTo(AppRoutes.CARDS);
  }


  if (!user.value?.kyc || !abortStatuses?.includes(user.value?.kyc.status)) {
    return navigateTo(AppRoutes.WALLET);
  }

});
