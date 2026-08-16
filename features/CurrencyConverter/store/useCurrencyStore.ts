import { create } from "zustand";
import { persist } from "zustand/middleware";

type CurrencyStore = {
  base: string;
  quote: string;
  sendAmount: string;
  receiveAmount: string;
  editingField: "send" | "receive";
  derivePending: boolean;
  setBase: (base: string) => void;
  setQuote: (quote: string) => void;
  setSendAmount: (amount: string) => void;
  setReceiveAmount: (amount: string) => void;
  setEditingField: (field: "send" | "receive") => void;
  clearDerivePending: () => void;
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
      sendAmount: "100",
      receiveAmount: "",
      editingField: "send",
      derivePending: true,
      setBase: (base) => set({ base, derivePending: true }),
      setQuote: (quote) => set({ quote, derivePending: true }),
      setSendAmount: (sendAmount) => set({ sendAmount }),
      setReceiveAmount: (receiveAmount) => set({ receiveAmount }),
      setEditingField: (editingField) => set({ editingField }),
      clearDerivePending: () => set({ derivePending: false }),
      swap: () =>
        set((state) => ({
          base: state.quote,
          quote: state.base,
          sendAmount: state.receiveAmount,
          receiveAmount: state.sendAmount,
          editingField: "send",
        })),
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