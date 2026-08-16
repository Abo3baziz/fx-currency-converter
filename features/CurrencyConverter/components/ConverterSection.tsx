import CurrencyField from "./CurrencyField";
import SwapCurrencies from "./SwapCurrencies";

export default function ConverterSection() {
  return (
    <section className="flex flex-col gap-200">
      <h1 className="text-[20px] text-white">CHECK THE RATE</h1>
      <div className="bg-currency-section-bg flex items-center gap-200 max-mobile:flex-col p-200 rounded-[20px]">
        <CurrencyField title="send" />
        <SwapCurrencies />
        <CurrencyField title="receive" />
      </div>
    </section>
  );
}
