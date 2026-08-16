"use client";

import { useQuery } from "@tanstack/react-query";
import { getTickerRates } from "@/services/api";
import useReducedMotion from "@/hooks/useReducedMotion";
import SingleLiveRate from "./SingleLiveRate";
import Marquee from "react-fast-marquee";
import Loader from "./Loader";

export default function LiveRate() {
  const reducedMotion = useReducedMotion();
  const tickerRates = useQuery({
    queryFn: getTickerRates,
    queryKey: ["rates", "ticker"],
  });

  if (tickerRates.isPending) {
    return <Loader />;
  }

  if (tickerRates.isError || !tickerRates.data) {
    return (
      <div className="flex items-center gap-150 px-200">
        <p className="text-[12px] text-[var(--neutral-200)]">
          Couldn&apos;t load live rates.
        </p>
        <button
          onClick={() => tickerRates.refetch()}
          className="rounded-[8px] border border-currency-change-stroke bg-currency-change-bg px-150 py-050 text-[12px] text-white cursor-pointer hover:bg-neutral-600">
          Retry
        </button>
      </div>
    );
  }

  const rates = tickerRates.data.map((rate, index) => (
    <SingleLiveRate
      key={index}
      base={rate.base}
      quote={rate.quote}
      todayRate={rate.todayRate}
      yesterdayRate={rate.yesterdayRate}
    />
  ));

  if (reducedMotion) {
    return (
      <div className="flex overflow-x-auto">{rates}</div>
    );
  }

  return <Marquee pauseOnHover={true}>{rates}</Marquee>;
}