/** Digits only; keep the last 10 (handles +91, 91, spaces, dashes). */
export function last10Digits(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits.slice(-10);
}

export function isValidMobile(value: string): boolean {
  return /^\d{10}$/.test(last10Digits(value)) && last10Digits(value).length === 10;
}
