import LiveRate from "./LiveRate";

export default function LiveMarkets() {
  return (
    <>
      <section className="flex overflow-x-hidden">
        <div className=" bg-liveMarket-yellow-bg w-fit px-100 py-150 flex items-center gap-075">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="6"
            height="6"
            viewBox="0 0 6 6"
            fill="none">
            <path
              d="M0 3C0 1.34315 1.34315 0 3 0C4.65685 0 6 1.34315 6 3C6 4.65685 4.65685 6 3 6C1.34315 6 0 4.65685 0 3Z"
              fill="#0A0A0A"
            />
          </svg>
          <p className="text-[12px] max-mobile:text-[10px] text-black font-light whitespace-nowrap">
            LIVE MARKETS
          </p>
        </div>

        <div className="bg-liveMarket-rates-bg w-full flex items-center">
          <LiveRate />
        </div>
      </section>
    </>
  );
}
