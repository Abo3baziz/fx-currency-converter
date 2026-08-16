"use client";

import { useQuery } from "@tanstack/react-query";
import { getTickerRates } from "@/services/api";
import SingleLiveRate from "./SingleLiveRate";
import Marquee from "react-fast-marquee";
import Loader from "./Loader";

export default function LiveRate() {
  const tickerRates = useQuery({
    queryFn: getTickerRates,
    queryKey: ["rates", "ticker"],
  });

  // TODO handle failed fetch process

  if (tickerRates.isPending) {
    return <Loader />;
  }

  if (tickerRates.isError || !tickerRates.data) {
    return null;
  }

  return (
    <Marquee pauseOnHover={true}>
      {tickerRates.data.map((rate, index) => (
        <SingleLiveRate
          key={index}
          base={rate.base}
          quote={rate.quote}
          todayRate={rate.todayRate}
          yesterdayRate={rate.yesterdayRate}
        />
      ))}
    </Marquee>
  );
}