<script lang="ts" setup>
import QRCodeStyling from 'qr-code-styling';

interface Props {
  network: string;
  link: string;
}

const icons = {
  trx: 'usdt',
  eth: 'eth',
  bnb: 'bnb',
  ton: 'ton',
};

const props = defineProps<Props>();
const qrContainer = useTemplateRef<HTMLElement>('qr-container');
const color = computed(() => {
  const style = window.getComputedStyle(document.body);

  return style.getPropertyValue('--primary-color');
});

const qrCode = computed(() => new QRCodeStyling({
    width: 300,
    height: 300,
    type: 'svg',
    data: props.link,
    image: `/icons/currency/${icons[props.network as keyof typeof icons]}.svg`,
    dotsOptions: {
        color: color.value,
        type: 'rounded',
    },
    backgroundOptions: {
        color: 'transparent',
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      crossOrigin: 'anonymous',
      margin: 8,
    },
    cornersSquareOptions: {
      color: color.value,
      type: 'extra-rounded',
    },
}));


onMounted(() => {
  if (qrContainer.value) {
    qrCode.value.append(qrContainer.value);
  }
});

</script>

<template>
  <div ref="qr-container" />
</template>