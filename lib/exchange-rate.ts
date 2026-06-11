import { unstable_cache } from "next/cache";

export interface ExchangeRateResult {
  rate: number;
  date: string;
}

async function fetchEurToNokRate(): Promise<ExchangeRateResult | null> {
  try {
    const response = await fetch(
      "https://api.frankfurter.app/latest?from=EUR&to=NOK",
      { next: { revalidate: 86400 } }
    );

    if (!response.ok) {
      console.error("[exchange-rate] API error:", response.status);
      return null;
    }

    const data = (await response.json()) as {
      date?: string;
      rates?: { NOK?: number };
    };

    const rate = data.rates?.NOK;

    if (!rate || rate <= 0) {
      return null;
    }

    return {
      rate,
      date: data.date ?? new Date().toISOString().split("T")[0],
    };
  } catch (error) {
    console.error("[exchange-rate] fetch failed:", error);
    return null;
  }
}

export const getEurToNokRate = unstable_cache(
  fetchEurToNokRate,
  ["eur-nok-rate"],
  { revalidate: 86400 }
);
