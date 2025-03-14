export function fixCardExpiration(expiration?: Nullable<string>): Nullable<string> {
  if (!expiration?.length) {
    return null;
  }

  const date = new Date(expiration);

  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = String(date.getFullYear()).slice(2, 4);

  return `${month}/${year}`;
}
