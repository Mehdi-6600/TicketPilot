export function formatAmount(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("fa-IR").format(n);
}

export function formatPhone(phone: string): string {
  if (!phone) return "—";
  return phone;
}
