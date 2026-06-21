import { Providers } from "./Providers";
import LiveMarkets from "@/components/LiveMarkets";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
      <Providers>
        <Header />
        <LiveMarkets />
      </Providers>
    </>
  );
}
