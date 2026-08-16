"use client";

import Image from "next/image";
import deleteFilledIcon from "@/public/images/icon-delete-filled.svg";
import deleteIcon from "@/public/images/icon-delete.svg";
import formatAmount from "@/utils/formatAmount";
import getRelativeTime from "@/utils/getRelativeTime";
import { useCurrencyStore } from "@/features/CurrencyConverter/store/useCurrencyStore";

export default function ConversionLog() {
  const conversionLog = useCurrencyStore((s) => s.conversionLog);
  const removeLogEntry = useCurrencyStore((s) => s.removeLogEntry);
  const clearLog = useCurrencyStore((s) => s.clearLog);

  return (
    <section className="bg-currency-section-bg p-200 rounded-[20px] flex flex-col gap-200">
      <div className="flex items-center justify-between">
        <h2 className="uppercase text-[14px] text-white">Conversion log</h2>

        {conversionLog.length > 0 && (
          <button
            type="button"
            onClick={clearLog}
            className="flex items-center gap-100 text-[12px] text-[var(--neutral-200)] hover:text-white cursor-pointer">
            <Image src={deleteFilledIcon} alt="" width={14} height={14} />
            Clear all
          </button>
        )}
      </div>

      {conversionLog.length === 0 ? (
        <p className="text-[14px] text-[var(--neutral-200)]">
          Conversions you make here will be recorded automatically.
        </p>
      ) : (
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
                aria-label="Delete conversion entry"
                className="cursor-pointer">
                <Image src={deleteIcon} alt="" width={16} height={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}