import { NextResponse } from "next/server";
import { getEurToNokRate } from "@/lib/exchange-rate";

export async function GET() {
  const result = await getEurToNokRate();

  if (!result) {
    return NextResponse.json({ rate: null, date: null });
  }

  return NextResponse.json(result);
}
