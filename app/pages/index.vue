<script lang="ts" setup>
import { AppRoutes } from '~/constants/app.route';

definePageMeta({
  layout: 'empty',
});

const { user } = useUser();

await navigateTo(user.value?.isOnboarded === false ? AppRoutes.ONBOARDING : AppRoutes.WALLET);
</script>