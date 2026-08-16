import { create } from "zustand";

type CurrencyStore = {
  base: string;
  quote: string;
  setBase: (base: string) => void;
  setQuote: (quote: string) => void;
  activeDropdown: "base" | "quote" | null;
  openDropdown: (field: "base" | "quote") => void;
  closeDropdown: () => void;
};

export const useCurrencyStore = create<CurrencyStore>((set) => ({
  base: "EUR",
  quote: "USD",
  setBase: (base) => set({ base }),
  setQuote: (quote) => set({ quote }),
  activeDropdown: null,
  openDropdown: (field) => set({ activeDropdown: field }),
  closeDropdown: () => set({ activeDropdown: null }),
}));
