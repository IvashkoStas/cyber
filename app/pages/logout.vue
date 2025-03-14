<script lang="ts" setup>
import { AppRoutes } from '~/constants/app.route';
import { Keys } from '~/constants/keys';

const { user } = useUser();
const token = useCookie(Keys.TOKEN);
const xTgToken = useCookie(Keys.X_TG_TOKEN);

user.value = null;
token.value = null;
xTgToken.value = null;

localStorage.removeItem(Keys.TOKEN);
localStorage.removeItem(Keys.X_TG_TOKEN);

await navigateTo(AppRoutes.AUTH);
</script>