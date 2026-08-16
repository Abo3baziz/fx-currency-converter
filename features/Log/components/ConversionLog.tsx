"use client";

import Image from "next/image";
import { useState } from "react";
import deleteFilledIcon from "@/public/images/icon-delete-filled.svg";
import deleteIcon from "@/public/images/icon-delete.svg";
import formatAmount from "@/utils/formatAmount";
import getRelativeTime from "@/utils/getRelativeTime";
import { useCurrencyStore } from "@/features/CurrencyConverter/store/useCurrencyStore";

export default function ConversionLog() {
  const base = useCurrencyStore((s) => s.base);
  const quote = useCurrencyStore((s) => s.quote);
  const sendAmount = useCurrencyStore((s) => s.sendAmount);
  const receiveAmount = useCurrencyStore((s) => s.receiveAmount);
  const conversionLog = useCurrencyStore((s) => s.conversionLog);
  const logConversion = useCurrencyStore((s) => s.logConversion);
  const removeLogEntry = useCurrencyStore((s) => s.removeLogEntry);
  const clearLog = useCurrencyStore((s) => s.clearLog);

  const [announcement, setAnnouncement] = useState("");

  const sendNumber = Number(sendAmount);
  const receiveNumber = Number(receiveAmount);
  const hasConversion =
    sendAmount !== "" &&
    Number.isFinite(sendNumber) &&
    sendNumber > 0 &&
    Number.isFinite(receiveNumber) &&
    receiveNumber > 0;

  const handleLog = () => {
    if (!hasConversion) {
      return;
    }

    const entry = {
      id: crypto.randomUUID(),
      base,
      quote,
      sendAmount: sendNumber,
      receiveAmount: receiveNumber,
      timestamp: Date.now(),
      relativeTime: getRelativeTime(Date.now()),
    };
    logConversion(entry);
    setAnnouncement(
      `Logged ${formatAmount(entry.sendAmount)} ${entry.base} equals ${formatAmount(entry.receiveAmount)} ${entry.quote}`,
    );
  };

  const handleClearLog = () => {
    clearLog();
    setAnnouncement("Conversion log cleared");
  };

  return (
    <section className="bg-currency-section-bg p-200 rounded-[20px] flex flex-col gap-200">
      <div className="flex flex-wrap items-center justify-between gap-200">
        <h2 className="uppercase text-[14px] text-white">Conversion log</h2>

        <div className="flex items-center gap-150">
          <button
            type="button"
            onClick={handleLog}
            disabled={!hasConversion}
            className="rounded-[8px] border border-currency-change-stroke bg-currency-change-bg px-150 py-100 text-[12px] text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
            Log current conversion
          </button>

          {conversionLog.length > 0 && (
            <button
              type="button"
              onClick={handleClearLog}
              className="flex items-center gap-100 text-[12px] text-[var(--neutral-200)] hover:text-white cursor-pointer">
              <Image src={deleteFilledIcon} alt="" width={14} height={14} />
              Clear all
            </button>
          )}
        </div>
      </div>

      {conversionLog.length === 0 ? (
        <p className="text-[14px] text-[var(--neutral-200)]">
          No conversions logged yet. Log the current conversion or try the
          converter above.
        </p>
      ) : (
        <>
          <ul className="flex flex-col">
            {conversionLog.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-200 py-100 border-b border-currency-field-stroke last:border-b-0">
                <div className="min-w-0">
                  <p className="text-white text-[14px]">
                    {formatAmount(entry.sendAmount)} {entry.base}
                    <span className="text-[var(--neutral-200)]"> → </span>
                    {formatAmount(entry.receiveAmount)} {entry.quote}
                  </p>
                  <p className="text-[12px] text-[var(--neutral-200)]">
                    {getRelativeTime(entry.timestamp)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeLogEntry(entry.id)}
                  aria-label={`Delete ${formatAmount(entry.sendAmount)} ${entry.base} to ${formatAmount(entry.receiveAmount)} ${entry.quote} log entry`}
                  className="cursor-pointer">
                  <Image src={deleteIcon} alt="" width={16} height={16} />
                </button>
              </li>
            ))}
          </ul>

          <span className="sr-only" role="status">
            {announcement}
          </span>
        </>
      )}
    </section>
  );
}