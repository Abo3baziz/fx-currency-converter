"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRates } from "@/services/api";
import { matchRates } from "@/utils/matchRates";
import SingleLiveRate from "./SingleLiveRate";
import Marquee from "react-fast-marquee";
import Loader from "./Loader";

export default function LiveRate() {
  const todayRates = useQuery({
    queryFn: () => fetchRates(0),
    queryKey: ["rates", "today"],
  });

  const yesterdarRates = useQuery({
    // 1 here means minus one day from the current date
    queryFn: () => fetchRates(1),
    queryKey: ["rates", "yesterday"],
  });

  if (todayRates.isPending || yesterdarRates.isPending) {
    return <Loader />;
  }

  const matchedRates = matchRates(todayRates.data, yesterdarRates.data);

  return (
    <Marquee pauseOnHover={true}>
      {matchedRates.map((rate, index) => (
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
