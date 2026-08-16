"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import downArrow from "@/public/images/icon-chevron-down.svg";
import searchIcon from "@/public/images/icon-search.svg";
import { flags } from "@/assets/data/flags";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useCurrencyStore } from "../store/useCurrencyStore";
import CurrencyOption from "./CurrencyOption";

export default function ChangeCurrencyButton({
  fieldType,
}: {
  fieldType: "base" | "quote";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const currentCurrency = useCurrencyStore((s) =>
    fieldType === "base" ? s.base : s.quote,
  );
  const activeDropdown = useCurrencyStore((s) => s.activeDropdown);
  const openDropdown = useCurrencyStore((s) => s.openDropdown);
  const closeDropdown = useCurrencyStore((s) => s.closeDropdown);
  const setBase = useCurrencyStore((s) => s.setBase);
  const setQuote = useCurrencyStore((s) => s.setQuote);

  const isOpen = activeDropdown === fieldType;

  useClickOutside(ref, () => {
    if (isOpen) {
      closeDropdown();
    }
  });

  const currentFlag =
    flags.find((f) => f.currency === currentCurrency)?.flag ?? "eu.webp";

  const handleSelect = useCallback(
    (currency: string) => {
      if (fieldType === "base") {
        setBase(currency);
      } else {
        setQuote(currency);
      }
      setSearch("");
      closeDropdown();
    },
    [fieldType, setBase, setQuote, closeDropdown],
  );

  const filteredCurrencies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return flags.filter(
      (f) =>
        query === "" ||
        f.currency.toLowerCase().includes(query) ||
        f.name.toLowerCase().includes(query),
    );
  }, [search]);

  const popular = filteredCurrencies.filter((f) => f.group === "popular");
  const otherCurrencies = filteredCurrencies.filter(
    (f) => f.group === "other",
  );

  return (
    <div
      ref={ref}
      className="relative">
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`currency-listbox-${fieldType}`}
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
        <div
          id={`currency-listbox-${fieldType}`}
          role="listbox"
          aria-label={`Select ${fieldType} currency`}
          className="absolute top-full mt-1 right-0 bg-currency-change-bg border border-currency-change-stroke rounded-[8px] overflow-auto max-h-[300px] z-10 w-[280px] max-w-[calc(100vw-2rem)] shadow-lg">
          <div className="sticky top-0 flex items-center gap-2 p-2.5 border-b border-currency-change-stroke bg-currency-change-bg">
            <Image
              src={searchIcon}
              alt=""
              width={15}
              height={15}
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search currency"
              aria-label="Search currencies"
              className="w-full bg-transparent text-[14px] text-white placeholder:text-[var(--neutral-200)] outline-none"
            />
          </div>

          <div className="p-1">
            {popular.length > 0 && (
              <p className="px-3 pt-2 pb-1 text-[11px] uppercase text-[var(--neutral-200)]">
                Popular
              </p>
            )}
            {popular.map((f) => (
              <CurrencyOption
                key={f.currency}
                currency={f.currency}
                name={f.name}
                flag={f.flag}
                selected={f.currency === currentCurrency}
                onSelect={handleSelect}
              />
            ))}

            {otherCurrencies.length > 0 && (
              <p className="px-3 pt-3 pb-1 text-[11px] uppercase text-[var(--neutral-200)]">
                Other currencies
              </p>
            )}
            {otherCurrencies.map((f) => (
              <CurrencyOption
                key={f.currency}
                currency={f.currency}
                name={f.name}
                flag={f.flag}
                selected={f.currency === currentCurrency}
                onSelect={handleSelect}
              />
            ))}

            {filteredCurrencies.length === 0 && (
              <p className="px-3 py-2 text-[14px] text-[var(--neutral-200)]">
                No results for &quot;{search}&quot;
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}