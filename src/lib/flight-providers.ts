export type FlightCurrency = "TOMAN" | "OMR" | "USD";

export type FlightSearchQuery = {
  origin: string;
  destination: string;
  departureDate: string;
  maxPrice: number | null;
  currency: FlightCurrency;
};

export type FlightProvider = {
  id: string;
  name: string;
  mark: string;
  description: string;
  accent: "blue" | "orange";
  /** Official page where the traveler can search this provider's live inventory. */
  getSearchUrl: (query: FlightSearchQuery) => string;
};

export const FLIGHT_CURRENCIES: { value: FlightCurrency; label: string }[] = [
  { value: "TOMAN", label: "تومان" },
  { value: "OMR", label: "ریال عمان" },
  { value: "USD", label: "دلار آمریکا" },
];

/**
 * Provider registry for the fare-search section.
 * Add a provider here to show it automatically in the search results. When a
 * provider documents a deep-link or API, its URL builder can use the query
 * supplied to getSearchUrl without changing the UI.
 *
 * These providers currently expose their official search pages only; this app
 * does not pretend to retrieve live prices without an authorized integration.
 */
export const FLIGHT_PROVIDERS: readonly FlightProvider[] = [
  {
    id: "babanowrouz",
    name: "بابا نوروز",
    mark: "BN",
    description: "فرم جستجوی پرواز در وب‌سایت رسمی بابا نوروز",
    accent: "blue",
    getSearchUrl: () => "https://www.babanowrouz.com/",
  },
  {
    id: "flyalrafah",
    name: "Fly Alrafah",
    mark: "AR",
    description: "فرم جستجوی پرواز در وب‌سایت رسمی الرفاء",
    accent: "orange",
    getSearchUrl: () => "https://flyalrafah.com/fa/flight",
  },
];
