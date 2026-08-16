"use client";

import Image from "next/image";
import exchangeIcon from "@/public/images/icon-exchange-vertical.svg";
import { useCurrencyStore } from "../store/useCurrencyStore";

export default function SwapCurrencies() {
  const swap = useCurrencyStore((s) => s.swap);

  return (
    <button
      onClick={swap}
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