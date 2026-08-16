"use client";

export type TabItem = {
  id: string;
  label: string;
};

export default function Tabs({
  tabs,
  activeId,
  onChange,
}: {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Converter sections"
      className="flex gap-100 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`px-150 py-100 text-[12px] uppercase cursor-pointer rounded-[8px] border ${
              isActive
                ? "bg-currency-change-bg border-currency-change-stroke text-white"
                : "border-transparent text-[var(--neutral-200)] hover:text-white"
            }`}>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}