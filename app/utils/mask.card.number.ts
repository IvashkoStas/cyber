export function maskCardNumber(cardNumber?: Nullable<string>, show: boolean = false): string {
  if (!cardNumber?.length) {
    return '';
  }
  const cleaned = cardNumber.replace(/\D/g, '');

  if (show) {
    return cleaned.replace(/(.{4})/g, '$1 ') ?? '';
  }

  const masked =
    '**** **** **** ' +
    cleaned
      .slice(12)
      .match(/.{1,4}/g)
      ?.join(' ');

  return masked ?? '';
}
