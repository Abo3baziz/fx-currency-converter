import { RateTypes, CurrencyRate } from "@/Types";

export function matchRates(
  todayRates: CurrencyRate[],
  yesterdayRates: CurrencyRate[],
): RateTypes[] {
  const yesterdayMap = new Map(
    yesterdayRates.map((item) => [`${item.base}-${item.quote}`, item.rate]),
  );

  return todayRates.flatMap((item) => {
    const yesterdayRate = yesterdayMap.get(`${item.base}-${item.quote}`);

    if (yesterdayRate === undefined) {
      return [];
    }

    return {
      base: item.base,
      quote: item.quote,
      todayRate: item.rate,
      yesterdayRate,
    };
  });
}
