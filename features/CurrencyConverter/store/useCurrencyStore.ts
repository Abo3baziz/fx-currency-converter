import { create } from "zustand";
import { persist } from "zustand/middleware";

type CurrencyStore = {
  base: string;
  quote: string;
  amount: string;
  setBase: (base: string) => void;
  setQuote: (quote: string) => void;
  setAmount: (amount: string) => void;
  swap: () => void;
  favorites: FavoritePair[];
  toggleFavorite: (base: string, quote: string) => void;
  conversionLog: ConversionLogEntry[];
  logConversion: (entry: ConversionLogEntry) => void;
  clearLog: () => void;
  removeLogEntry: (id: string) => void;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  activeDropdown: "base" | "quote" | null;
  openDropdown: (field: "base" | "quote") => void;
  closeDropdown: () => void;
};

export type FavoritePair = {
  base: string;
  quote: string;
};

export type ConversionLogEntry = {
  id: string;
  base: string;
  quote: string;
  sendAmount: number;
  receiveAmount: number;
  timestamp: number;
  relativeTime: string;
};

export type TabId = "chart" | "compare" | "favorites" | "log";

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      base: "EUR",
      quote: "USD",
      amount: "100",
      setBase: (base) => set({ base }),
      setQuote: (quote) => set({ quote }),
      setAmount: (amount) => set({ amount }),
      swap: () => set((state) => ({ base: state.quote, quote: state.base })),
      favorites: [],
      toggleFavorite: (base, quote) =>
        set((state) => {
          const exists = state.favorites.some(
            (f) => f.base === base && f.quote === quote,
          );
          return {
            favorites: exists
              ? state.favorites.filter((f) => !(f.base === base && f.quote === quote))
              : [...state.favorites, { base, quote }],
          };
        }),
      conversionLog: [],
      logConversion: (entry) =>
        set((state) => ({ conversionLog: [entry, ...state.conversionLog] })),
      clearLog: () => set({ conversionLog: [] }),
      removeLogEntry: (id) =>
        set((state) => ({
          conversionLog: state.conversionLog.filter((e) => e.id !== id),
        })),
      activeTab: "chart",
      setActiveTab: (activeTab) => set({ activeTab }),
      activeDropdown: null,
      openDropdown: (field) => set({ activeDropdown: field }),
      closeDropdown: () => set({ activeDropdown: null }),
    }),
    {
      name: "fx-currency-converter",
      partialize: (state) => ({
        favorites: state.favorites,
        conversionLog: state.conversionLog,
        activeTab: state.activeTab,
      }),
    },
  ),
);