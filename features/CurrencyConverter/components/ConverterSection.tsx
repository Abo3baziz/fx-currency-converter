"use client";

import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPairRate } from "@/services/api";
import roundCurrency from "@/utils/roundCurrency";
import { useCurrencyStore } from "../store/useCurrencyStore";
import CurrencyField from "./CurrencyField";
import SwapCurrencies from "./SwapCurrencies";
import RateLine from "./RateLine";

export default function ConverterSection() {
  const base = useCurrencyStore((s) => s.base);
  const quote = useCurrencyStore((s) => s.quote);
  const sendAmount = useCurrencyStore((s) => s.sendAmount);
  const receiveAmount = useCurrencyStore((s) => s.receiveAmount);
  const editingField = useCurrencyStore((s) => s.editingField);
  const derivePending = useCurrencyStore((s) => s.derivePending);
  const setSendAmount = useCurrencyStore((s) => s.setSendAmount);
  const setReceiveAmount = useCurrencyStore((s) => s.setReceiveAmount);
  const clearDerivePending = useCurrencyStore((s) => s.clearDerivePending);

  const conversionAnnouncement = useMemo(
    () =>
      editingField === "send" && receiveAmount !== ""
        ? `${sendAmount} ${base} equals ${receiveAmount} ${quote}`
        : "",
    [editingField, sendAmount, receiveAmount, base, quote],
  );

  const pairRate = useQuery({
    queryFn: () => getPairRate(base, quote),
    queryKey: ["rates", "pair", base, quote],
  });

  const rate = pairRate.data?.rate;

  useEffect(() => {
    if (rate === undefined || !derivePending) {
      return;
    }

    if (editingField === "send") {
      const converted = roundCurrency((Number(sendAmount) || 0) * rate);
      setReceiveAmount(String(converted));
    } else {
      const converted = roundCurrency((Number(receiveAmount) || 0) / rate);
      setSendAmount(String(converted));
    }

    clearDerivePending();
  }, [
    rate,
    derivePending,
    editingField,
    sendAmount,
    receiveAmount,
    setSendAmount,
    setReceiveAmount,
    clearDerivePending,
  ]);

  return (
    <section className="flex flex-col gap-200">
      <h1 className="text-[20px] text-white">CHECK THE RATE</h1>
      <div className="bg-currency-section-bg flex items-center gap-200 max-mobile:flex-col p-200 rounded-[20px]">
        <CurrencyField title="send" rate={rate} />
        <SwapCurrencies />
        <CurrencyField title="receive" rate={rate} />
      </div>

      <RateLine
        rate={rate}
        isError={pairRate.isError}
        onRetry={() => pairRate.refetch()}
      />

      <span aria-live="polite" className="sr-only">
        {conversionAnnouncement}
      </span>
    </section>
  );
}