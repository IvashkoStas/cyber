
export function formatPrice(price: string | number, quantity = 2): string {
  const stringPrice = String(price);
  const format = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: quantity,
    maximumFractionDigits: quantity,
  }).format(parseFloat(stringPrice));

  return format;
}
