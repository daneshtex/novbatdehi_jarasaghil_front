export function normalizeIranMobile(input: string): string {
  const digitsOnly = input.replace(/\D/g, '');
  if (digitsOnly.startsWith('0098')) return `0${digitsOnly.slice(4)}`;
  if (digitsOnly.startsWith('98')) return `0${digitsOnly.slice(2)}`;
  if (digitsOnly.startsWith('9') && digitsOnly.length === 10) return `0${digitsOnly}`;
  return digitsOnly;
}


