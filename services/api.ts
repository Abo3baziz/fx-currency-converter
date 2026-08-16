"use server";
import getDate from "@/utils/getDate";
import { matchRates } from "@/utils/matchRates";
import { CurrencyInfo, CurrencyRate, LatestRates, RateTypes } from "@/Types";

const BASE_URL = "https://api.frankfurter.dev/v2";
const REVALIDATE_SECONDS = 3600;

async function request<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText} for ${path}`);
    }

    return (await res.json()) as T;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getCurrencies(): Promise<CurrencyInfo[]> {
  return request<CurrencyInfo[]>("/currencies");
}

export async function getLatest(base: string): Promise<LatestRates> {
  return request<LatestRates>(`/rates?base=${base}`);
}

export async function getPairRate(base: string, quote: string): Promise<CurrencyRate> {
  return request<CurrencyRate>(`/rate/${base}/${quote}`);
}

export async function getHistory(
  base: string,
  quote: string,
  from: string,
  to: string,
): Promise<CurrencyRate[]> {
  return request<CurrencyRate[]>(
    `/rates?from=${from}&to=${to}&base=${base}&quotes=${quote}`,
  );
}

export async function getTickerRates(): Promise<RateTypes[]> {
  const rates = await request<LatestRates>(
    `/rates?from=${getDate(6)}&to=${getDate(0)}`,
  );
  const dates = [...new Set(rates.map((entry) => entry.date))].sort();
  const todayDate = dates[dates.length - 1];
  const yesterdayDate = dates[dates.length - 2];
  const today = rates.filter((entry) => entry.date === todayDate);
  const yesterday = rates.filter((entry) => entry.date === yesterdayDate);
  return matchRates(today, yesterday);
}