<script lang="ts" setup>
import VisaIcon from '~/assets/icons/shared/_visa.svg';



</script>

<template>
  <section class="empty-card">
    <slot />
    <VisaIcon class="empty-card__icon" />
  </section>
</template>

<style lang="scss">
.empty-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: var(--radius);
  padding: 16px;
  position: relative;
  width: 100%;
  aspect-ratio: 1.83;
  background-image: url('/main.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  &__icon {
    position: absolute;
    bottom: 16px;
    right: 16px;
    width: 65px;
  }
}
</style>