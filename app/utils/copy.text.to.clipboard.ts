export function fallbackCopyTextToClipboard(text: string): void {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.width = '0';
  textArea.style.height = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    const msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
};

export async function copyTextToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
  } else {
    await navigator.clipboard.writeText(text);
  }
};