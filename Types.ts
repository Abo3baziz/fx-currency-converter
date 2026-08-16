export type RateTypes = {
  base: string;
  quote: string;
  todayRate: number;
  yesterdayRate: number;
};

export type CurrencyRate = {
  date: string;
  base: string;
  quote: string;
  rate: number;
};

export type Currency = {
  currency: string;
  flag: string;
  name: string;
  group: "popular" | "other";
};

export type CurrencyInfo = {
  iso_code: string;
  name: string;
  symbol: string;
  iso_numeric: string;
};

export type LatestRates = CurrencyRate[];