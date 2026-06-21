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
