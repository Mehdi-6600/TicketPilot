"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  Banknote,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  ExternalLink,
  Info,
  MapPin,
  PlaneTakeoff,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { toPersianDate, toPersianDateTime } from "@/lib/date";
import {
  FLIGHT_CURRENCIES,
  FLIGHT_PROVIDERS,
  type FlightCurrency,
  type FlightProvider,
  type FlightSearchQuery,
} from "@/lib/flight-providers";

const STORAGE_KEY = "ticketpilot.flight-quotes.v1";
const CITY_SUGGESTIONS = [
  "تهران",
  "مسقط",
  "مشهد",
  "شیراز",
  "اصفهان",
  "اهواز",
  "چابهار",
  "قشم",
  "دبی",
  "استانبول",
];

type FlightQuote = {
  amount: number;
  currency: FlightCurrency;
  note: string;
  updatedAt: string;
};

type QuoteDraft = {
  amount: string;
  currency: FlightCurrency;
  note: string;
};

type ProviderQuotes = Record<string, FlightQuote>;
type SavedQuoteStore = Record<string, ProviderQuotes>;

const ACCENT_STYLES = {
  blue: {
    mark: "border-sky-100 bg-pastel-blue text-ios-blue",
    badge: "bg-sky-50 text-sky-700",
  },
  orange: {
    mark: "border-orange-100 bg-pastel-peach text-ios-orange",
    badge: "bg-orange-50 text-orange-800",
  },
} as const;

function latinDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660));
}

function parsePrice(value: string): number | null {
  const normalized = latinDigits(value)
    .replace(/[٬,\s]/g, "")
    .replace(/٫/g, ".")
    .replace(/[^\d.]/g, "");
  const amount = Number(normalized);
  return normalized !== "" && Number.isFinite(amount) && amount > 0
    ? amount
    : null;
}

function formatPrice(amount: number, currency: FlightCurrency): string {
  const label = FLIGHT_CURRENCIES.find((item) => item.value === currency)?.label;
  const formatted = new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: 3,
  }).format(amount);
  return `${formatted} ${label ?? currency}`;
}

function emptyDraft(): QuoteDraft {
  return { amount: "", currency: "TOMAN", note: "" };
}

function makeDrafts(quotes: ProviderQuotes = {}): Record<string, QuoteDraft> {
  const drafts: Record<string, QuoteDraft> = {};
  for (const provider of FLIGHT_PROVIDERS) {
    const quote = quotes[provider.id];
    drafts[provider.id] = quote
      ? {
          amount: String(quote.amount),
          currency: quote.currency,
          note: quote.note,
        }
      : emptyDraft();
  }
  return drafts;
}

function isFlightCurrency(value: unknown): value is FlightCurrency {
  return FLIGHT_CURRENCIES.some((currency) => currency.value === value);
}

function isFlightQuote(value: unknown): value is FlightQuote {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const quote = value as Record<string, unknown>;
  return (
    typeof quote.amount === "number" &&
    Number.isFinite(quote.amount) &&
    quote.amount > 0 &&
    isFlightCurrency(quote.currency) &&
    typeof quote.note === "string" &&
    typeof quote.updatedAt === "string" &&
    !Number.isNaN(Date.parse(quote.updatedAt))
  );
}

function readSavedQuoteStore(): SavedQuoteStore {
  try {
    const raw: unknown = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "{}"
    );
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
      return {};
    }

    const store: SavedQuoteStore = {};
    for (const [searchKey, value] of Object.entries(raw)) {
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        continue;
      }
      const quotes: ProviderQuotes = {};
      for (const [providerId, quote] of Object.entries(value)) {
        if (isFlightQuote(quote)) quotes[providerId] = quote;
      }
      if (Object.keys(quotes).length > 0) store[searchKey] = quotes;
    }
    return store;
  } catch {
    return {};
  }
}

function normalizePlace(value: string): string {
  return latinDigits(value)
    .trim()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("fa-IR");
}

function getSearchKey(query: FlightSearchQuery): string {
  return [
    normalizePlace(query.origin),
    normalizePlace(query.destination),
    query.departureDate,
  ].join("|");
}

function formatSearchDate(value: string): string {
  return toPersianDate(new Date(`${value}T12:00:00`));
}

function quoteStatus(
  quote: FlightQuote | undefined,
  query: FlightSearchQuery
): { label: string; style: string } | null {
  if (!quote || query.maxPrice === null) return null;
  if (quote.currency !== query.currency) {
    return {
      label: "واحد متفاوت",
      style: "bg-pastel-lavender text-violet-700",
    };
  }
  if (quote.amount <= query.maxPrice) {
    return { label: "داخل سقف قیمت", style: "bg-pastel-mint text-emerald-800" };
  }
  return { label: "بالاتر از سقف", style: "bg-pastel-peach text-orange-800" };
}

export default function FlightPriceSearch() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [budgetCurrency, setBudgetCurrency] = useState<FlightCurrency>("TOMAN");
  const [search, setSearch] = useState<FlightSearchQuery | null>(null);
  const [savedQuotes, setSavedQuotes] = useState<ProviderQuotes>({});
  const [drafts, setDrafts] = useState<Record<string, QuoteDraft>>(() =>
    makeDrafts()
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [quoteErrors, setQuoteErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (search) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [search]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setNotice(null);
    setCopyStatus(null);

    const cleanOrigin = origin.trim();
    const cleanDestination = destination.trim();
    if (!cleanOrigin || !cleanDestination || !departureDate) {
      setFormError("مبدا، مقصد و تاریخ پرواز را کامل کن.");
      return;
    }
    if (normalizePlace(cleanOrigin) === normalizePlace(cleanDestination)) {
      setFormError("مبدا و مقصد نمی‌توانند یکسان باشند.");
      return;
    }

    const parsedMaxPrice = maxPrice.trim() ? parsePrice(maxPrice) : null;
    if (maxPrice.trim() && parsedMaxPrice === null) {
      setFormError("سقف قیمت را به‌صورت یک عدد بزرگ‌تر از صفر وارد کن.");
      return;
    }

    const nextSearch: FlightSearchQuery = {
      origin: cleanOrigin,
      destination: cleanDestination,
      departureDate,
      maxPrice: parsedMaxPrice,
      currency: budgetCurrency,
    };
    const stored = readSavedQuoteStore()[getSearchKey(nextSearch)] ?? {};

    setSearch(nextSearch);
    setSavedQuotes(stored);
    setDrafts(makeDrafts(stored));
    setQuoteErrors({});
  }

  function updateDraft(
    providerId: string,
    changes: Partial<QuoteDraft>
  ) {
    setDrafts((current) => ({
      ...current,
      [providerId]: {
        ...(current[providerId] ?? emptyDraft()),
        ...changes,
      },
    }));
    setQuoteErrors((current) => {
      const next = { ...current };
      delete next[providerId];
      return next;
    });
    setNotice(null);
  }

  function saveQuote(provider: FlightProvider) {
    if (!search) return;
    const draft = drafts[provider.id] ?? emptyDraft();
    const amount = parsePrice(draft.amount);
    if (amount === null) {
      setQuoteErrors((current) => ({
        ...current,
        [provider.id]: "قیمت معتبر را وارد کن.",
      }));
      return;
    }

    const quote: FlightQuote = {
      amount,
      currency: draft.currency,
      note: draft.note.trim(),
      updatedAt: new Date().toISOString(),
    };
    const searchKey = getSearchKey(search);
    const store = readSavedQuoteStore();
    store[searchKey] = {
      ...(store[searchKey] ?? {}),
      [provider.id]: quote,
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      setSavedQuotes(store[searchKey]);
      setQuoteErrors((current) => {
        const next = { ...current };
        delete next[provider.id];
        return next;
      });
      setNotice(`قیمت ${provider.name} ذخیره شد.`);
    } catch {
      setNotice("ذخیره‌سازی مرورگر در دسترس نیست؛ قیمت در این نشست ثبت نشد.");
    }
  }

  function removeQuote(providerId: string) {
    if (!search) return;
    const searchKey = getSearchKey(search);
    const store = readSavedQuoteStore();
    if (store[searchKey]) {
      delete store[searchKey][providerId];
      if (Object.keys(store[searchKey]).length === 0) delete store[searchKey];
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      // Keep the current screen usable even when browser storage is unavailable.
    }
    setSavedQuotes(store[searchKey] ?? {});
    updateDraft(providerId, emptyDraft());
    setNotice("قیمت ذخیره‌شده حذف شد.");
  }

  async function copySearchDetails() {
    if (!search) return;
    const details = [
      `${search.origin} → ${search.destination}`,
      `تاریخ پرواز: ${formatSearchDate(search.departureDate)}`,
      search.maxPrice !== null
        ? `حداکثر قیمت: ${formatPrice(search.maxPrice, search.currency)}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(details);
      setCopyStatus("مشخصات جستجو کپی شد.");
    } catch {
      setCopyStatus("کپی خودکار در این مرورگر در دسترس نیست.");
    }
  }

  const comparableQuotes = search
    ? FLIGHT_PROVIDERS.flatMap((provider) => {
        const quote = savedQuotes[provider.id];
        return quote && quote.currency === search.currency
          ? [{ provider, quote }]
          : [];
      }).sort((a, b) => a.quote.amount - b.quote.amount)
    : [];
  const cheapestQuote = comparableQuotes[0];
  const withinBudgetCount =
    search?.maxPrice === null || search?.maxPrice === undefined
      ? null
      : comparableQuotes.filter((item) => item.quote.amount <= search.maxPrice!).length;

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-xs font-semibold text-ios-blue">ابزار فروش</p>
          <h1 className="text-xl font-bold text-ink sm:text-2xl">
            استعلام قیمت بلیط
          </h1>
          <p className="mt-1 max-w-xl text-sm leading-6 text-ink-muted">
            مسیر و تاریخ را یک‌بار وارد کن، قیمت دو منبع را بررسی و کنار هم ثبت کن.
          </p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-100 bg-pastel-blue text-ios-blue shadow-raised-sm">
          <PlaneTakeoff size={23} />
        </div>
      </header>

      <form onSubmit={handleSearch} className="neo-card space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-ink">مشخصات پرواز</h2>
            <p className="mt-0.5 text-xs text-ink-muted">
              برای پیشنهاد سریع‌تر می‌توانی از شهرهای پرتکرار استفاده کنی.
            </p>
          </div>
          <span className="rounded-full bg-pastel-lavender px-3 py-1 text-[11px] font-medium text-violet-700">
            یک‌طرفه
          </span>
        </div>

        <datalist id="flight-city-suggestions">
          {CITY_SUGGESTIONS.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
          <label className="block min-w-0">
            <span className="mb-1.5 flex items-center gap-1.5 text-sm text-ink-soft">
              <MapPin size={15} className="text-ios-blue" />
              مبدا
            </span>
            <input
              type="text"
              value={origin}
              onChange={(event) => setOrigin(event.target.value)}
              list="flight-city-suggestions"
              autoComplete="off"
              dir="auto"
              placeholder="مثلاً تهران"
              className="neo-input"
              required
            />
          </label>

          <button
            type="button"
            onClick={() => {
              setOrigin(destination);
              setDestination(origin);
            }}
            aria-label="جابجایی مبدا و مقصد"
            title="جابجایی مبدا و مقصد"
            className="flex h-10 w-10 items-center justify-center justify-self-start rounded-xl border border-sky-100 bg-surface text-ios-blue shadow-raised-sm transition hover:bg-pastel-blue active:shadow-pressed sm:mb-1 sm:justify-self-center"
          >
            <ArrowLeftRight size={18} />
          </button>

          <label className="block min-w-0">
            <span className="mb-1.5 flex items-center gap-1.5 text-sm text-ink-soft">
              <MapPin size={15} className="text-ios-orange" />
              مقصد
            </span>
            <input
              type="text"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              list="flight-city-suggestions"
              autoComplete="off"
              dir="auto"
              placeholder="مثلاً مسقط"
              className="neo-input"
              required
            />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-sm text-ink-soft">
              <CalendarDays size={15} className="text-ios-blue" />
              تاریخ پرواز
            </span>
            <input
              type="date"
              value={departureDate}
              onChange={(event) => setDepartureDate(event.target.value)}
              dir="ltr"
              className="neo-input"
              required
            />
          </label>

          <div>
            <label
              htmlFor="flight-max-price"
              className="mb-1.5 flex items-center gap-1.5 text-sm text-ink-soft"
            >
              <Banknote size={15} className="text-ios-green" />
              حداکثر قیمت (اختیاری)
            </label>
            <div className="flex gap-2">
              <input
                id="flight-max-price"
                type="text"
                inputMode="decimal"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="بدون محدودیت"
                className="neo-input min-w-0 flex-1"
              />
              <select
                value={budgetCurrency}
                onChange={(event) =>
                  setBudgetCurrency(event.target.value as FlightCurrency)
                }
                aria-label="واحد حداکثر قیمت"
                className="neo-select w-32 shrink-0 px-2 text-sm sm:w-36"
              >
                {FLIGHT_CURRENCIES.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-[11px] leading-5 text-ink-muted">
              برای مقایسه سقف قیمت، نرخ هر سایت را با همین واحد وارد کن.
            </p>
          </div>
        </div>

        {formError && (
          <div
            role="alert"
            className="rounded-2xl bg-pastel-pink px-3 py-2 text-sm text-ios-red"
          >
            {formError}
          </div>
        )}

        <button
          type="submit"
          className="btn-ios-blue flex w-full items-center justify-center gap-2"
        >
          <Search size={18} />
          <span>نمایش منابع و استعلام قیمت</span>
        </button>
      </form>

      {search ? (
        <section
          ref={resultsRef}
          aria-label="منابع استعلام قیمت"
          className="scroll-mt-24 space-y-3"
        >
          <div className="neo-card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="mb-1 text-xs text-ink-muted">منابع برای استعلام</p>
              <div className="flex flex-wrap items-center gap-2 text-lg font-bold text-ink">
                <span dir="auto">{search.origin}</span>
                <ArrowLeftRight size={17} className="shrink-0 text-ios-blue" />
                <span dir="auto">{search.destination}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-muted">
                <span>تاریخ: {formatSearchDate(search.departureDate)}</span>
                {search.maxPrice !== null ? (
                  <span>
                    سقف: {formatPrice(search.maxPrice, search.currency)}
                  </span>
                ) : (
                  <span>بدون سقف قیمت</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={copySearchDetails}
              className="btn-neo flex shrink-0 items-center justify-center gap-2 px-3 py-2 text-sm"
            >
              {copyStatus?.startsWith("مشخصات") ? (
                <Check size={16} className="text-ios-green" />
              ) : (
                <Copy size={16} className="text-ios-blue" />
              )}
              کپی مشخصات
            </button>
          </div>

          {copyStatus && (
            <p role="status" className="px-1 text-xs text-ink-muted">
              {copyStatus}
            </p>
          )}

          <div className="flex items-start gap-2 rounded-2xl border border-sky-100/70 bg-white/50 px-3 py-3 text-xs leading-5 text-ink-soft">
            <Info size={16} className="mt-0.5 shrink-0 text-ios-blue" />
            <p>
              قیمت لحظه‌ای از این سایت‌ها به‌صورت خودکار دریافت نمی‌شود؛ صفحه سایت را
              باز کن و مسیر و تاریخ را در فرم همان سایت وارد کن. بعد از دیدن نرخ، مبلغ
              را اینجا ثبت کن. نرخ‌های ثبت‌شده فقط در همین مرورگر ذخیره می‌شوند.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {FLIGHT_PROVIDERS.map((provider) => {
              const quote = savedQuotes[provider.id];
              const draft = drafts[provider.id] ?? emptyDraft();
              const accent = ACCENT_STYLES[provider.accent];
              const status = search ? quoteStatus(quote, search) : null;
              const websiteUrl = provider.getSearchUrl(search);

              return (
                <article key={provider.id} className="neo-card space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-xs font-extrabold ${accent.mark}`}
                        aria-hidden="true"
                      >
                        {provider.mark}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-ink">{provider.name}</h3>
                        <p className="mt-0.5 text-xs leading-5 text-ink-muted">
                          {provider.description}
                        </p>
                      </div>
                    </div>
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      referrerPolicy="no-referrer"
                      aria-label={`باز کردن سایت ${provider.name} در برگه جدید`}
                      className="flex shrink-0 items-center gap-1 rounded-xl bg-surface px-2.5 py-2 text-xs font-medium text-ios-blue shadow-raised-sm transition hover:bg-pastel-blue active:shadow-pressed"
                    >
                      باز کردن
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  {quote && (
                    <div className="rounded-2xl border border-emerald-100/70 bg-pastel-mint/70 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-[11px] text-ink-muted">
                            آخرین قیمت ثبت‌شده
                          </p>
                          <p className="mt-0.5 text-lg font-bold text-ink">
                            {formatPrice(quote.amount, quote.currency)}
                          </p>
                        </div>
                        {status && (
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.style}`}
                          >
                            {status.label}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 flex items-center gap-1 text-[11px] text-ink-muted">
                        <Clock3 size={12} />
                        بروزرسانی: {toPersianDateTime(new Date(quote.updatedAt))}
                      </p>
                      {quote.note && (
                        <p className="mt-1 text-xs leading-5 text-ink-soft">
                          {quote.note}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 border-t border-sky-100/70 pt-3">
                    <label
                      htmlFor={`quote-price-${provider.id}`}
                      className="block text-xs font-medium text-ink-soft"
                    >
                      قیمت اعلام‌شده در سایت
                    </label>
                    <div className="flex gap-2">
                      <input
                        id={`quote-price-${provider.id}`}
                        type="text"
                        inputMode="decimal"
                        value={draft.amount}
                        onChange={(event) =>
                          updateDraft(provider.id, { amount: event.target.value })
                        }
                        placeholder="مبلغ را وارد کن"
                        aria-label={`قیمت اعلام‌شده در ${provider.name}`}
                        className="neo-input min-w-0 flex-1"
                      />
                      <select
                        value={draft.currency}
                        onChange={(event) =>
                          updateDraft(provider.id, {
                            currency: event.target.value as FlightCurrency,
                          })
                        }
                        aria-label={`واحد قیمت در ${provider.name}`}
                        className="neo-select w-32 shrink-0 px-2 text-sm sm:w-36"
                      >
                        {FLIGHT_CURRENCIES.map((currency) => (
                          <option key={currency.value} value={currency.value}>
                            {currency.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      value={draft.note}
                      onChange={(event) =>
                        updateDraft(provider.id, { note: event.target.value })
                      }
                      placeholder="یادداشت اختیاری؛ مثل ساعت یا بار مجاز"
                      aria-label={`یادداشت قیمت ${provider.name}`}
                      className="neo-input-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => saveQuote(provider)}
                        className="btn-ios-blue flex flex-1 items-center justify-center gap-2 px-3 py-2.5 text-sm"
                      >
                        <Save size={15} />
                        {quote ? "بروزرسانی قیمت" : "ثبت قیمت"}
                      </button>
                      {quote && (
                        <button
                          type="button"
                          onClick={() => removeQuote(provider.id)}
                          title="حذف قیمت ثبت‌شده"
                          aria-label={`حذف قیمت ثبت‌شده ${provider.name}`}
                          className="btn-ios-gray flex h-11 w-11 shrink-0 items-center justify-center p-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    {quoteErrors[provider.id] && (
                      <p role="alert" className="text-xs text-ios-red">
                        {quoteErrors[provider.id]}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="neo-card-mint">
            <div className="mb-2 flex items-center gap-2">
              <Banknote size={18} className="text-ios-green" />
              <h2 className="font-semibold text-ink">مقایسه قیمت‌های ثبت‌شده</h2>
            </div>
            {cheapestQuote ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-ink-soft">
                  کمترین قیمت با واحد {FLIGHT_CURRENCIES.find((item) => item.value === search.currency)?.label}:
                  <span className="mx-1 font-bold text-ink">
                    {formatPrice(cheapestQuote.quote.amount, cheapestQuote.quote.currency)}
                  </span>
                  در {cheapestQuote.provider.name}
                </p>
                {withinBudgetCount !== null && (
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-800">
                    {withinBudgetCount} منبع در سقف قیمت
                  </span>
                )}
              </div>
            ) : Object.keys(savedQuotes).length > 0 ? (
              <p className="text-sm leading-6 text-ink-soft">
                قیمت ثبت شده، اما موردی با واحد {FLIGHT_CURRENCIES.find((item) => item.value === search.currency)?.label} برای مقایسه وجود ندارد. برای مقایسه، واحد قیمت‌ها را یکسان کن.
              </p>
            ) : (
              <p className="text-sm leading-6 text-ink-soft">
                بعد از بررسی قیمت در سایت‌ها، نرخ را در کارت هر منبع ثبت کن تا اینجا
                با هم مقایسه شوند.
              </p>
            )}
            {notice && (
              <p role="status" className="mt-2 text-xs font-medium text-ink-muted">
                {notice}
              </p>
            )}
          </div>
        </section>
      ) : (
        <div className="neo-card flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pastel-lavender text-violet-700">
            <Search size={20} />
          </div>
          <div>
            <p className="font-medium text-ink">آماده استعلام؟</p>
            <p className="mt-1 text-sm leading-5 text-ink-muted">
              مبدا، مقصد و تاریخ را وارد کن تا صفحه جستجوی هر دو منبع در دسترست باشد.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
