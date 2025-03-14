<script lang="ts" setup>
import { From } from '~~/types/from';

definePageMeta({
  middleware: 'card',
});
</script>

<template>
  <SharedOutput :from="From.REF" />
</template>