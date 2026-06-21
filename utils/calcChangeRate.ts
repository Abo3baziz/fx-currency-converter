export default function calcChangeRate(
  todayRate: number,
  yesterdayRate: number,
) {
  let changeAmount: number, changePercentage: number;

  if (todayRate > yesterdayRate) {
    changeAmount = todayRate - yesterdayRate;
    changePercentage = (todayRate - yesterdayRate) * 100;

    return {
      changeAmount: `+${changeAmount.toFixed(2)}`,
      changePercentage: `+${changePercentage.toFixed(2)}%`,
      positiveChange: 1,
    };
  } else {
    changeAmount = yesterdayRate - todayRate;
    changePercentage = (todayRate - yesterdayRate) * 100;

    return {
      changeAmount: `-${changeAmount.toFixed(2)}`,
      changePercentage: `${changePercentage.toFixed(2)}%`,
      positiveChange: 0,
    };
  }
}
