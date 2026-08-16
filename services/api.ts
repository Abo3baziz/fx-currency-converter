"use server";
import getDate from "@/utils/getDate";
import { matchRates } from "@/utils/matchRates";
import { CurrencyInfo, CurrencyRate, LatestRates, RateTypes } from "@/Types";

const BASE_URL = "https://api.frankfurter.dev/v2";

async function request<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`);

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
  const today = await request<LatestRates>(`/rates?date=${getDate(0)}`);
  const yesterday = await request<LatestRates>(`/rates?date=${getDate(1)}`);
  return matchRates(today, yesterday);
}