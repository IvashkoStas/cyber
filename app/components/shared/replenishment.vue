<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { user, updateUser } = useUser();
const { t } = useI18n();
const { impactOccurred } = useVibrate();

const key = shallowRef(1);

const { showConfirm, showAlert } = usePopup();

const autoReplenishCard = computed({
  get: () => user.value?.autoReplenishCard ?? false,
  set: () => {},
});

const switchLock = shallowRef(false);

async function updateUserWithSwitchLock(value: boolean) {
  try {
    switchLock.value = true;
    const res = await updateUser({ autoReplenishCard: value });

    if (typeof res === 'string') {
      showAlert(res);
    }
  } finally {
    key.value += 1;
    switchLock.value = false;
  }
}

function changeAutoReplenishCard() {
  if (!user.value?.cards?.length) {
    return;
  }

  if (autoReplenishCard.value) {
    return updateUserWithSwitchLock(false);
  }

  showConfirm(t('shared.autoReplenishmentDesc'), (ok: boolean) => {
    updateUserWithSwitchLock(ok).then(() => {
      impactOccurred('medium');
    });
  });
}
</script>

<template>
    <ul class="replenishment">
      <li class="replenishment-item" @click="changeAutoReplenishCard">
        {{ $t('shared.autoReplenishment') }}
        <UiSwitch
          :key="key"
          :disabled="!user?.cards?.length || switchLock"
          @update:model-value="changeAutoReplenishCard"
        />
      </li>
    </ul>
</template>

<style lang="scss" scoped>
.replenishment {
  margin-top: 8px;
  padding: 16px;
  border-radius: var(--radius);
  background-color: var(--bg-block);

  &-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
  }
}
</style>