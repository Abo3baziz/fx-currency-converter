import ChangeCurrencyButton from "./ChangeCurrencyButton";

export default function CurrencyField({ title }: { title: string }) {
  return (
    <div className="bg-currency-field-bg max-mobile:p-200 p-250 rounded-2xl flex flex-col gap-250 border-currency-field-stroke border">
      <label
        htmlFor={title}
        className="uppercase text-[14px] text-[var(--neutral-100)]">
        {title}
      </label>

      <div className="flex">
        <input
          type="number"
          name={title}
          id={title}
          min={1}
          className="uppercase max-tablet:text-[32px] text-[40px] w-full"
        />

        <ChangeCurrencyButton
          fieldType={title === "send" ? "base" : "quote"}
        />
      </div>
    </div>
  );
}
