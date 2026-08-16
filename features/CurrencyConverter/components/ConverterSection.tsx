"use client";

import { useQuery } from "@tanstack/react-query";
import { getPairRate } from "@/services/api";
import { useCurrencyStore } from "../store/useCurrencyStore";
import CurrencyField from "./CurrencyField";
import SwapCurrencies from "./SwapCurrencies";
import RateLine from "./RateLine";

export default function ConverterSection() {
  const base = useCurrencyStore((s) => s.base);
  const quote = useCurrencyStore((s) => s.quote);

  const pairRate = useQuery({
    queryFn: () => getPairRate(base, quote),
    queryKey: ["rates", "pair", base, quote],
  });

  const rate = pairRate.data?.rate;

  return (
    <section className="flex flex-col gap-200">
      <h1 className="text-[20px] text-white">CHECK THE RATE</h1>
      <div className="bg-currency-section-bg flex items-center gap-200 max-mobile:flex-col p-200 rounded-[20px]">
        <CurrencyField title="send" rate={rate} />
        <SwapCurrencies rate={rate} />
        <CurrencyField title="receive" rate={rate} />
      </div>

      <RateLine rate={rate} />
    </section>
  );
}