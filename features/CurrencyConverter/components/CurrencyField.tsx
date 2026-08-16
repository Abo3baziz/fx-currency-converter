"use client";

import { useCurrencyStore } from "../store/useCurrencyStore";
import roundCurrency from "@/utils/roundCurrency";
import ChangeCurrencyButton from "./ChangeCurrencyButton";

export default function CurrencyField({
  title,
  rate,
}: {
  title: "send" | "receive";
  rate: number | undefined;
}) {
  const sendAmount = useCurrencyStore((s) => s.sendAmount);
  const receiveAmount = useCurrencyStore((s) => s.receiveAmount);
  const editingField = useCurrencyStore((s) => s.editingField);
  const setSendAmount = useCurrencyStore((s) => s.setSendAmount);
  const setReceiveAmount = useCurrencyStore((s) => s.setReceiveAmount);
  const setEditingField = useCurrencyStore((s) => s.setEditingField);

  const isEditing = editingField === title;
  const isSend = title === "send";

  const displayValue = isSend ? sendAmount : receiveAmount;

  const handleSelectField = () => {
    if (isEditing) {
      return;
    }
    if (rate === undefined) {
      setEditingField(title);
      return;
    }

    if (isSend) {
      const converted = roundCurrency((Number(receiveAmount) || 0) / rate);
      setSendAmount(String(converted));
    } else {
      const converted = roundCurrency((Number(sendAmount) || 0) * rate);
      setReceiveAmount(String(converted));
    }
    setEditingField(title);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (isSend) {
      setSendAmount(value);
      if (rate !== undefined) {
        const converted = roundCurrency((Number(value) || 0) * rate);
        setReceiveAmount(String(converted));
      }
    } else {
      setReceiveAmount(value);
      if (rate !== undefined) {
        const converted = roundCurrency((Number(value) || 0) / rate);
        setSendAmount(String(converted));
      }
    }
  };

  const fieldType = isSend ? "base" : "quote";

  return (
    <div className="bg-currency-field-bg max-mobile:p-200 p-250 rounded-2xl flex flex-col gap-250 border-currency-field-stroke border">
      <label
        htmlFor={isSend ? "send" : "receive"}
        className="uppercase text-[14px] text-[var(--neutral-100)]">
        {title}
      </label>

      <div className="flex">
        <input
          type="number"
          name={isSend ? "send" : "receive"}
          id={isSend ? "send" : "receive"}
          min={1}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleSelectField}
          className="uppercase max-tablet:text-[32px] text-[40px] w-full bg-transparent"
        />

        <ChangeCurrencyButton fieldType={fieldType} />
      </div>
    </div>
  );
}