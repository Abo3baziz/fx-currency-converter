import Image from "next/image";
import exchangeIcon from "@/public/images/icon-exchange.svg";

export default function SwapCurrencies() {
  return (
    <button className="rounded-[8px] bg-currency-field-bg border-currency-field-stroke W-[48px] h-[48px] p-[14px] cursor-pointer">
      <Image
        src={exchangeIcon}
        alt="Swap icon"
      />
    </button>
  );
}
