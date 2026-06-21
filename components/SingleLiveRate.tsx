import { RateTypes } from "@/Types";
import calcChangeRate from "@/utils/calcChangeRate";

export default function SingleLiveRate({
  base,
  quote,
  todayRate,
  yesterdayRate,
}: RateTypes) {
  const { changePercentage, positiveChange } = calcChangeRate(
    todayRate,
    yesterdayRate,
  );
  return (
    <div className="max-mobile:text-[10px] text-[12px] text-white flex gap-125 p-125 border-x  border-[var(--neutral-500)]">
      <p className="text-[var(--neutral-200)]">
        {base}/{quote}
      </p>

      <p className="font-medium">{todayRate}</p>

      <p
        className={
          positiveChange ? "text-[var(--green-500)]" : "text-[var(--red-500)]"
        }>
        {changePercentage}
      </p>
    </div>
  );
}
