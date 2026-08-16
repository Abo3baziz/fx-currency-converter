import { Providers } from "./Providers";
import LiveMarkets from "@/components/LiveMarkets";
import Header from "@/components/Header";
import ConverterSection from "@/features/CurrencyConverter/components/ConverterSection";

export default function Home() {
  return (
    <>
      <Providers>
        <Header />
        <LiveMarkets />
        <section className="max-mobile:py-400 max-mobile:px-200 px-400 pt-600">
          <ConverterSection />
        </section>
      </Providers>
    </>
  );
}
