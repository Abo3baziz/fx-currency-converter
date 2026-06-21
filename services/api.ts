"use server";
import getDate from "@/utils/getDate";

const baseUrl = "https://api.frankfurter.dev/v2/rates";

export async function fetchRates(num: 0 | 1) {
  const date = getDate(num);
  try {
    return await fetch(`${baseUrl}?date=${date}`).then((res) => res.json());
  } catch (error) {
    // TODO handle errors in error state
    console.log(error);
  }
}
