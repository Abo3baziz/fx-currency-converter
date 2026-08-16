"use client";

import { useRef } from "react";

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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeId);
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      const tab = tabs[nextIndex];
      onChange(tab.id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Converter sections"
      onKeyDown={handleKeyDown}
      className="flex gap-100 overflow-x-auto">
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeId;

        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
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