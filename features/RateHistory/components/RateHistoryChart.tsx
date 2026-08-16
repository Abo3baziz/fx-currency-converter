"use client";

import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getHistory } from "@/services/api";
import { getRangeDates, HistoryRange } from "@/utils/getRange";
import formatRate from "@/utils/formatRate";
import { useCurrencyStore } from "@/features/CurrencyConverter/store/useCurrencyStore";

const RANGE_OPTIONS: HistoryRange[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

export default function RateHistoryChart() {
  const base = useCurrencyStore((s) => s.base);
  const quote = useCurrencyStore((s) => s.quote);
  const [range, setRange] = useState<HistoryRange>("1M");

  const { start, end } = getRangeDates(range);

  const historyQuery = useQuery({
    queryFn: () => getHistory(base, quote, start, end),
    queryKey: ["rates", "history", base, quote, range],
  });

  const chartData = useMemo(() => {
    const data = historyQuery.data;
    if (!data) {
      return [];
    }

    return data.map((point) => ({
      date: point.date,
      rate: point.rate,
    }));
  }, [historyQuery.data]);

  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return null;
    }

    const open = chartData[0].rate;
    const last = chartData[chartData.length - 1].rate;
    const change = last - open;
    const changePercent = (change / open) * 100;

    return { open, last, change, changePercent };
  }, [chartData]);

  if (historyQuery.isPending) {
    return (
      <section className="bg-currency-section-bg p-200 rounded-[20px] flex flex-col gap-200">
        <HistoryHeader range={range} onRangeChange={setRange} />
        <p className="text-[14px] text-[var(--neutral-200)]">Loading chart...</p>
      </section>
    );
  }

  if (historyQuery.isError || chartData.length === 0) {
    return (
      <section className="bg-currency-section-bg p-200 rounded-[20px] flex flex-col gap-200">
        <HistoryHeader range={range} onRangeChange={setRange} />
        <div className="flex flex-col items-center gap-100 py-300">
          <p className="text-[14px] text-white">
            We couldn&apos;t load the rate history.
          </p>
          <p className="text-[12px] text-[var(--neutral-200)]">
            Check your connection and try a different range.
          </p>
          <button
            onClick={() => historyQuery.refetch()}
            className="rounded-[8px] border border-currency-change-stroke bg-currency-change-bg px-150 py-100 text-[14px] text-white cursor-pointer hover:bg-neutral-600">
            Try again
          </button>
        </div>
      </section>
    );
  }

  const positiveChange = stats && stats.change >= 0;

  return (
    <section className="bg-currency-section-bg p-200 rounded-[20px] flex flex-col gap-300">
      <div className="flex flex-wrap items-center justify-between gap-200">
        <div className="flex flex-wrap items-center gap-200 text-[12px]">
          <p className="text-[14px] text-white">
            {base}/{quote}
          </p>

          {stats && (
            <>
              <Stat label="Open" value={formatRate(stats.open)} />
              <Stat label="Last" value={formatRate(stats.last)} />
              <Stat
                label="Change"
                value={`${positiveChange ? "+" : ""}${formatRate(stats.change)}`}
                tone={positiveChange ? "positive" : "negative"}
              />
              <Stat
                label="%"
                value={`${positiveChange ? "+" : ""}${stats.changePercent.toFixed(2)}%`}
                tone={positiveChange ? "positive" : "negative"}
              />
            </>
          )}
        </div>

        <RangeTabs range={range} onRangeChange={setRange} />
      </div>

      <div className="border-t border-currency-field-stroke pt-200">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="limeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--lime-500)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--lime-500)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="var(--neutral-600)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--neutral-200)", fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "var(--neutral-600)" }}
                minTickGap={40}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "var(--neutral-200)", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--neutral-700)",
                  border: "1px solid var(--neutral-500)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--neutral-200)" }}
                itemStyle={{ color: "white" }}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="var(--lime-500)"
                strokeWidth={2}
                fill="url(#limeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

function RangeTabs({
  range,
  onRangeChange,
}: {
  range: HistoryRange;
  onRangeChange: (range: HistoryRange) => void;
}) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = RANGE_OPTIONS.indexOf(range);
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % RANGE_OPTIONS.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + RANGE_OPTIONS.length) % RANGE_OPTIONS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = RANGE_OPTIONS.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const option = RANGE_OPTIONS[nextIndex];
      onRangeChange(option);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Chart range"
      onKeyDown={handleKeyDown}
      className="flex overflow-x-auto">
      {RANGE_OPTIONS.map((option, index) => (
        <button
          key={option}
          ref={(element) => {
            tabRefs.current[index] = element;
          }}
          type="button"
          role="tab"
          aria-selected={range === option}
          tabIndex={range === option ? 0 : -1}
          onClick={() => onRangeChange(option)}
          className={`py-100 px-150 text-[12px] cursor-pointer ${
            range === option
              ? "bg-currency-change-bg text-white"
              : "text-[var(--neutral-200)] hover:text-white"
          } rounded-[8px]`}>
          {option}
        </button>
      ))}
    </div>
  );
}

function HistoryHeader({
  range,
  onRangeChange,
}: {
  range: HistoryRange;
  onRangeChange: (range: HistoryRange) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="uppercase text-[14px] text-white">Rate history</h2>

      <RangeTabs range={range} onRangeChange={onRangeChange} />
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "positive" | "negative";
}) {
  return (
    <p className="flex items-center gap-050">
      <span className="uppercase text-[var(--neutral-200)]">{label}</span>
      <span
        className={
          tone === "positive"
            ? "text-[var(--green-500)]"
            : tone === "negative"
              ? "text-[var(--red-500)]"
              : "text-white"
        }>
        {value}
      </span>
    </p>
  );
}