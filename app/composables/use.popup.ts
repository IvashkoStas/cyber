import { useWebApp, useWebAppPopup } from 'vue-tg';

export default function () {
  const popup = useWebAppPopup();
  const { initData } = useWebApp();

  function showAlert(text: string) {
    if (!initData.length) {
      alert(text);

      return;
    }

    popup.showAlert(text);
  }

  async function showConfirm(confirmText: string, cb: (ok: boolean) => unknown | Promise<unknown>) {
    if (!initData.length) {
      const isConfirm = confirm(confirmText);

      await cb(isConfirm);

      return;
    }

    popup.showConfirm(confirmText, cb);
  }

  return {
    showAlert,
    showConfirm,
  };
}