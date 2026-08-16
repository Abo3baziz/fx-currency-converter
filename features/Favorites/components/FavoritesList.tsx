"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import starFilled from "@/public/images/icon-star-filled.svg";
import { flags } from "@/assets/data/flags";
import { getHistory } from "@/services/api";
import calcChangeRate from "@/utils/calcChangeRate";
import formatRate from "@/utils/formatRate";
import getDate from "@/utils/getDate";
import { useCurrencyStore } from "@/features/CurrencyConverter/store/useCurrencyStore";

export default function FavoritesList() {
  const favorites = useCurrencyStore((s) => s.favorites);
  const toggleFavorite = useCurrencyStore((s) => s.toggleFavorite);
  const setBase = useCurrencyStore((s) => s.setBase);
  const setQuote = useCurrencyStore((s) => s.setQuote);

  const key = favorites.map((f) => `${f.base}/${f.quote}`).join(",");

  const changeQuery = useQuery({
    queryKey: ["rates", "favorites-change", key],
    queryFn: async () => {
      const from = getDate(1);
      const to = getDate(0);

      return Promise.all(
        favorites.map(async (favorite) => {
          const data = await getHistory(
            favorite.base,
            favorite.quote,
            from,
            to,
          );
          const todayRate = data[data.length - 1]?.rate;
          const yesterdayRate = data[0]?.rate;

          return { ...favorite, todayRate, yesterdayRate };
        }),
      );
    },
    enabled: favorites.length > 0,
  });

  const rows = useMemo(() => {
    const data = changeQuery.data;
    if (!data) {
      return [];
    }

    const flagMap = new Map(flags.map((f) => [f.currency, f]));

    return data.map((favorite) => {
      const hasChange =
        favorite.todayRate !== undefined && favorite.yesterdayRate !== undefined;
      const change = hasChange
        ? calcChangeRate(favorite.todayRate!, favorite.yesterdayRate!)
        : null;

      return {
        ...favorite,
        flag: flagMap.get(favorite.quote)?.flag ?? "eu.webp",
        change,
      };
    });
  }, [changeQuery.data]);

  const handleLoad = (base: string, quote: string) => {
    setBase(base);
    setQuote(quote);
  };

  return (
    <section className="bg-currency-section-bg p-200 rounded-[20px] flex flex-col gap-200">
      <h2 className="uppercase text-[14px] text-white">Favorites</h2>

      {favorites.length === 0 && (
        <p className="text-[14px] text-[var(--neutral-200)]">
          No favorites yet. Tap the star on a pair to pin it here.
        </p>
      )}

      {favorites.length > 0 && changeQuery.isPending && (
        <p className="text-[14px] text-[var(--neutral-200)]">
          Loading favorites...
        </p>
      )}

      {favorites.length > 0 && changeQuery.isError && (
        <div className="flex flex-col items-start gap-100">
          <p className="text-[14px] text-[var(--red-500)]">
            Couldn&apos;t load favorites.
          </p>
          <button
            onClick={() => changeQuery.refetch()}
            className="rounded-[8px] border border-currency-change-stroke bg-currency-change-bg px-150 py-050 text-[12px] text-white cursor-pointer hover:bg-neutral-600">
            Retry
          </button>
        </div>
      )}

      {favorites.length > 0 && !changeQuery.isError && rows.length > 0 && (
        <ul className="flex flex-col">
          {rows.map((favorite) => (
            <li
              key={`${favorite.base}/${favorite.quote}`}
              className="flex items-center justify-between gap-200 py-100 border-b border-currency-field-stroke last:border-b-0">
              <button
                type="button"
                onClick={() => handleLoad(favorite.base, favorite.quote)}
                className="flex items-center gap-100 min-w-0 flex-1 text-left cursor-pointer">
                <Image
                  src={`/images/flags/${favorite.flag}`}
                  width={24}
                  height={24}
                  alt=""
                  className="rounded-full shrink-0"
                />
                <span className="text-white text-[14px]">
                  {favorite.base}/{favorite.quote}
                </span>
                {favorite.todayRate !== undefined && (
                  <span className="text-[12px] text-[var(--neutral-200)]">
                    {formatRate(favorite.todayRate)}
                  </span>
                )}
                {favorite.change && (
                  <span
                    className={`text-[12px] ${
                      favorite.change.positiveChange
                        ? "text-[var(--green-500)]"
                        : "text-[var(--red-500)]"
                    }`}>
                    {favorite.change.changePercentage}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  toggleFavorite(favorite.base, favorite.quote)
                }
                aria-label={`Unpin ${favorite.base}/${favorite.quote}`}
                className="cursor-pointer">
                <Image src={starFilled} alt="" width={18} height={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}