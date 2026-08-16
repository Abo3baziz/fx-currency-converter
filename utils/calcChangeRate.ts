export default function calcChangeRate(
  todayRate: number,
  yesterdayRate: number,
) {
  const changeAmount = todayRate - yesterdayRate;
  const changePercentage = (changeAmount / yesterdayRate) * 100;
  const positiveChange = changeAmount >= 0 ? 1 : 0;

  const amount = positiveChange ? `+${changeAmount.toFixed(2)}` : changeAmount.toFixed(2);
  const percentage = positiveChange
    ? `+${changePercentage.toFixed(2)}%`
    : `${changePercentage.toFixed(2)}%`;

  return {
    changeAmount: amount,
    changePercentage: percentage,
    positiveChange,
  };
}