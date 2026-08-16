"use client";

import Image from "next/image";
import exchangeIcon from "@/public/images/icon-exchange-vertical.svg";
import { useCurrencyStore } from "../store/useCurrencyStore";
import convertCurrency from "@/utils/convertCurrency";

export default function SwapCurrencies({
  rate,
}: {
  rate: number | undefined;
}) {
  const amount = useCurrencyStore((s) => s.amount);
  const editingField = useCurrencyStore((s) => s.editingField);
  const setAmount = useCurrencyStore((s) => s.setAmount);
  const swap = useCurrencyStore((s) => s.swap);

  const handleSwap = () => {
    if (rate !== undefined) {
      const numericAmount = Number(amount) || 0;
      const converted =
        editingField === "send"
          ? convertCurrency(numericAmount, rate)
          : numericAmount;

      setAmount(String(converted));
    }

    swap();
  };

  return (
    <button
      onClick={handleSwap}
      aria-label="Swap currencies"
      className="rounded-[8px] bg-currency-field-bg border-currency-field-stroke w-[48px] h-[48px] p-[14px] cursor-pointer">
      <Image
        src={exchangeIcon}
        alt="Swap currencies"
        width={20}
        height={20}
      />
    </button>
  );
}