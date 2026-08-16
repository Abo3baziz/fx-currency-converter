"use client";

import Image from "next/image";

export default function CurrencyOption({
  currency,
  flag,
  onSelect,
}: {
  currency: string;
  flag: string;
  onSelect: (currency: string) => void;
}) {
  return (
    <button
      onClick={() => {
        onSelect(currency);
      }}
      className="flex items-center gap-2 px-3 py-2 w-full hover:bg-neutral-600 text-white text-[14px] cursor-pointer">
      <Image
        src={`/images/flags/${flag}`}
        width={20}
        height={20}
        alt={`${currency} flag`}
        className="rounded-full"
      />
      <span>{currency}</span>
    </button>
  );
}
