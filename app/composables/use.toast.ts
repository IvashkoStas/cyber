import { toast, type ToastOptions } from 'vue3-toastify';

export default function () {
  return (message: string, options?: ToastOptions) => toast(message, {
    ...options,
    theme: options?.theme ?? 'dark',
    type: options?.type ?? 'default',
    style: {
      width: 'calc(100% - 20px)',
      borderRadius: '10px',
      margin: '10px',
    },
    closeButton: false,
    autoClose: 2000,
    dangerouslyHTMLString: true,
  });
}