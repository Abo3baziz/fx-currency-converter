"use client";

import Image from "next/image";
import downArrow from "@/public/images/icon-chevron-down.svg";
import { flags } from "@/assets/data/flags";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useCurrencyStore } from "../store/useCurrencyStore";
import { useRef, useCallback } from "react";
import CurrencyOption from "./CurrencyOption";

export default function ChangeCurrencyButton({
  fieldType,
}: {
  fieldType: "base" | "quote";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const currentCurrency = useCurrencyStore((s) =>
    fieldType === "base" ? s.base : s.quote,
  );
  const activeDropdown = useCurrencyStore((s) => s.activeDropdown);
  const openDropdown = useCurrencyStore((s) => s.openDropdown);
  const closeDropdown = useCurrencyStore((s) => s.closeDropdown);
  const setBase = useCurrencyStore((s) => s.setBase);
  const setQuote = useCurrencyStore((s) => s.setQuote);

  const isOpen = activeDropdown === fieldType;

  // useClickOutside(ref, closeDropdown);

  const currentFlag =
    flags.find((f) => f.currency === currentCurrency)?.flag ?? "eu.webp";

  const handleSelect = useCallback(
    (currency: string) => {
      if (fieldType === "base") {
        setBase(currency);
      } else {
        setQuote(currency);
      }
      closeDropdown();
    },
    [fieldType, setBase, setQuote, closeDropdown],
  );

  return (
    <div
      ref={ref}
      className="relative">
      <button
        onClick={() => (isOpen ? closeDropdown() : openDropdown(fieldType))}
        className="flex items-center rounded-[8px] p-2.5 border border-currency-change-stroke bg-currency-change-bg gap-2 text-[14px] hover:cursor-pointer">
        <Image
          src={`/images/flags/${currentFlag}`}
          width={20}
          height={20}
          alt={`${currentCurrency} flag`}
          className="rounded-full"
        />
        <p className="text-white">{currentCurrency}</p>
        <Image
          src={downArrow}
          alt="down arrow icon"
          width={15}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 bg-currency-change-bg border border-currency-change-stroke rounded-[8px] overflow-y-auto max-h-[200px] z-10 min-w-[120px]">
          {flags.map((f) => (
            <CurrencyOption
              key={f.currency}
              currency={f.currency}
              flag={f.flag}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
