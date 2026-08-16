"use client";

import Image from "next/image";
import checkIcon from "@/public/images/icon-check.svg";

export default function CurrencyOption({
  currency,
  name,
  flag,
  selected,
  onSelect,
}: {
  currency: string;
  name: string;
  flag: string;
  selected: boolean;
  onSelect: (currency: string) => void;
}) {
  return (
    <button
      role="option"
      aria-selected={selected}
      onClick={() => {
        onSelect(currency);
      }}
      className="flex items-center gap-2 px-3 py-2 w-full hover:bg-neutral-600 text-white text-[14px] cursor-pointer text-left">
      <Image
        src={`/images/flags/${flag}`}
        width={20}
        height={20}
        alt={`${currency} flag`}
        className="rounded-full"
      />
      <span className="font-medium">{currency}</span>
      <span className="text-[12px] text-[var(--neutral-200)] truncate">
        {name}
      </span>
      <span className="ml-auto">
        {selected && (
          <Image
            src={checkIcon}
            alt=""
            width={15}
            height={15}
          />
        )}
      </span>
    </button>
  );
}