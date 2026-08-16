"use client";

import Tabs, { TabItem } from "./Tabs";
import CompareList from "@/features/Compare/components/CompareList";
import FavoritesList from "@/features/Favorites/components/FavoritesList";
import ConversionLog from "@/features/Log/components/ConversionLog";
import RateHistoryChart from "@/features/RateHistory/components/RateHistoryChart";
import { TabId, useCurrencyStore } from "@/features/CurrencyConverter/store/useCurrencyStore";

const TAB_ITEMS: TabItem[] = [
  { id: "chart", label: "Chart" },
  { id: "compare", label: "Compare" },
  { id: "favorites", label: "Favorites" },
  { id: "log", label: "Log" },
];

export default function TabsSection() {
  const activeTab = useCurrencyStore((s) => s.activeTab);
  const setActiveTab = useCurrencyStore((s) => s.setActiveTab);

  return (
    <div className="flex flex-col gap-200">
      <Tabs
        tabs={TAB_ITEMS}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
      />

      {activeTab === "chart" && <RateHistoryChart />}
      {activeTab === "compare" && <CompareList />}
      {activeTab === "favorites" && <FavoritesList />}
      {activeTab === "log" && <ConversionLog />}
    </div>
  );
}