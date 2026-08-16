"use client";

import Image from "next/image";
import starFilled from "@/public/images/icon-star-filled.svg";
import star from "@/public/images/icon-star.svg";
import { useCurrencyStore } from "../store/useCurrencyStore";
import formatRate from "@/utils/formatRate";

export default function RateLine({
  rate,
  isError,
  onRetry,
}: {
  rate: number | undefined;
  isError: boolean;
  onRetry: () => void;
}) {
  const base = useCurrencyStore((s) => s.base);
  const quote = useCurrencyStore((s) => s.quote);
  const favorites = useCurrencyStore((s) => s.favorites);
  const toggleFavorite = useCurrencyStore((s) => s.toggleFavorite);

  const isFavorite = favorites.some((f) => f.base === base && f.quote === quote);

  return (
    <div className="flex items-center justify-between gap-100">
      <div className="flex items-center gap-150">
        {isError ? (
          <>
            <p className="text-[14px] text-[var(--red-500)]">
              Couldn&apos;t load the rate.
            </p>
            <button
              onClick={onRetry}
              className="rounded-[8px] border border-currency-change-stroke bg-currency-change-bg px-150 py-050 text-[12px] text-white cursor-pointer hover:bg-neutral-600">
              Retry
            </button>
          </>
        ) : (
          <p className="text-[14px] text-white">
            {rate !== undefined ? (
              <>
                1 {base} = {formatRate(rate)} {quote}
              </>
            ) : (
              "Loading rate..."
            )}
          </p>
        )}
      </div>

      <button
        onClick={() => toggleFavorite(base, quote)}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite ? "Remove from favorites" : "Add to favorites"
        }
        className="flex items-center gap-100 cursor-pointer">
        <Image
          src={isFavorite ? starFilled : star}
          alt=""
          width={18}
          height={18}
        />
      </button>
    </div>
  );
}