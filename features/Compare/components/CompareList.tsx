"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import starFilled from "@/public/images/icon-star-filled.svg";
import star from "@/public/images/icon-star.svg";
import { flags } from "@/assets/data/flags";
import { getLatest } from "@/services/api";
import formatAmount from "@/utils/formatAmount";
import formatRate from "@/utils/formatRate";
import roundCurrency from "@/utils/roundCurrency";
import { useCurrencyStore } from "@/features/CurrencyConverter/store/useCurrencyStore";

export default function CompareList() {
  const base = useCurrencyStore((s) => s.base);
  const sendAmount = useCurrencyStore((s) => s.sendAmount);
  const favorites = useCurrencyStore((s) => s.favorites);
  const toggleFavorite = useCurrencyStore((s) => s.toggleFavorite);

  const latestQuery = useQuery({
    queryFn: () => getLatest(base),
    queryKey: ["rates", "latest", base],
  });

  const sendNumber = Number(sendAmount);
  const hasAmount =
    sendAmount !== "" && Number.isFinite(sendNumber) && sendNumber > 0;

  const rows = useMemo(() => {
    const data = latestQuery.data;
    if (!data) {
      return [];
    }

    const flagMap = new Map(flags.map((f) => [f.currency, f]));

    return data
      .filter((rate) => rate.quote !== base && flagMap.has(rate.quote))
      .map((rate) => {
        const flag = flagMap.get(rate.quote)!;
        const isFavorite = favorites.some(
          (f) => f.base === base && f.quote === rate.quote,
        );

        return {
          quote: rate.quote,
          rate: rate.rate,
          flag: flag.flag,
          group: flag.group,
          amount: roundCurrency(sendNumber * rate.rate),
          isFavorite,
        };
      })
      .sort(
        (a, b) =>
          (a.group === "popular" ? 0 : 1) - (b.group === "popular" ? 0 : 1) ||
          a.quote.localeCompare(b.quote),
      );
  }, [latestQuery.data, base, sendNumber, favorites]);

  return (
    <section className="bg-currency-section-bg p-200 rounded-[20px] flex flex-col gap-200">
      <h2 className="uppercase text-[14px] text-white">Compare</h2>

      {latestQuery.isPending && (
        <p className="text-[14px] text-[var(--neutral-200)]">
          Loading rates...
        </p>
      )}

      {latestQuery.isError && (
        <p className="text-[14px] text-[var(--neutral-200)]">
          Couldn&apos;t load rates.
        </p>
      )}

      {!hasAmount && !latestQuery.isPending && (
        <p className="text-[14px] text-[var(--neutral-200)]">
          Enter an amount to compare rates.
        </p>
      )}

      {hasAmount && rows.length === 0 && !latestQuery.isPending && (
        <p className="text-[14px] text-[var(--neutral-200)]">
          No rates available.
        </p>
      )}

      {hasAmount && rows.length > 0 && (
        <ul className="flex flex-col">
          {rows.map((row) => (
            <li
              key={row.quote}
              className="flex items-center justify-between gap-200 py-100 border-b border-currency-field-stroke last:border-b-0">
              <div className="flex items-center gap-100 min-w-0">
                <Image
                  src={`/images/flags/${row.flag}`}
                  width={24}
                  height={24}
                  alt=""
                  className="rounded-full shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-white text-[14px]">{row.quote}</p>
                  <p className="text-[12px] text-[var(--neutral-200)]">
                    1 {base} = {formatRate(row.rate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-150">
                <p className="text-white text-[14px]">
                  {formatAmount(row.amount)}
                </p>
                <button
                  type="button"
                  onClick={() => toggleFavorite(base, row.quote)}
                  aria-pressed={row.isFavorite}
                  aria-label={`${row.isFavorite ? "Unpin" : "Pin"} ${row.quote}`}
                  className="cursor-pointer">
                  <Image
                    src={row.isFavorite ? starFilled : star}
                    alt=""
                    width={18}
                    height={18}
                  />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}