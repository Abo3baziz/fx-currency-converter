"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPairRate } from "@/services/api";
import getRelativeTime from "@/utils/getRelativeTime";
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
  const logConversion = useCurrencyStore((s) => s.logConversion);

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

  useEffect(() => {
    const sendNumber = Number(sendAmount);
    const receiveNumber = Number(receiveAmount);

    if (
      sendAmount === "" ||
      !Number.isFinite(sendNumber) ||
      sendNumber <= 0 ||
      !Number.isFinite(receiveNumber) ||
      receiveNumber <= 0
    ) {
      return;
    }

    const timer = setTimeout(() => {
      const timestamp = Date.now();
      logConversion({
        id: crypto.randomUUID(),
        base,
        quote,
        sendAmount: sendNumber,
        receiveAmount: receiveNumber,
        timestamp,
        relativeTime: getRelativeTime(timestamp),
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [sendAmount, receiveAmount, base, quote, logConversion]);

  return (
    <section className="flex flex-col gap-200">
      <h1 className="text-[20px] text-white">CHECK THE RATE</h1>
      <div className="bg-currency-section-bg flex items-center gap-200 max-mobile:flex-col p-200 rounded-[20px]">
        <CurrencyField title="send" rate={rate} />
        <SwapCurrencies />
        <CurrencyField title="receive" rate={rate} />
      </div>

      <RateLine rate={rate} />
    </section>
  );
}