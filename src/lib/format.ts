import type { Currency } from "@prisma/client";

const CURRENCY_LABELS: Record<Currency, string> = {
  TOMAN: "تومان",
  OMR: "ریال عمان",
  USD: "دلار",
};

export function formatAmount(
  amount: number | null | undefined,
  currency: Currency = "TOMAN"
): string {
  if (amount === null || amount === undefined) return "—";
  const label = CURRENCY_LABELS[currency] ?? currency;
  return new Intl.NumberFormat("fa-IR").format(amount) + " " + label;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("fa-IR").format(n);
}

export function formatPhone(phone: string): string {
  if (!phone) return "—";
  return phone;
}

export const CURRENCIES: { value: Currency; label: string }[] = [
  { value: "TOMAN", label: "تومان" },
  { value: "OMR", label: "ریال عمان" },
  { value: "USD", label: "دلار" },
];

export function getCurrencyLabel(currency: Currency): string {
  return CURRENCY_LABELS[currency] ?? currency;
}
