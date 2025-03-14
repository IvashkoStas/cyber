import { useWebApp, useWebAppHapticFeedback } from 'vue-tg';

export default function () {
  const { initData } = useWebApp();
  const haptic = useWebAppHapticFeedback();

  const impactOccurred = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => initData.length ? haptic.impactOccurred(style) : vibrate(100);

  const selectionChanged = () => initData.length ? haptic.selectionChanged() : vibrate(100);

  function vibrate(v: number) {
    if ('vibrate' in navigator) {
      navigator.vibrate(v);
    }

    console.log('vibrate not supported');
  }

  return  {
    impactOccurred,
    selectionChanged,
  };
}