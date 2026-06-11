import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "orderId mangler" }, { status: 400 });
  }

  const db = createSupabaseAdmin();
  const { data: session } = await db
    .from("payment_sessions")
    .select("status")
    .eq("order_id", orderId)
    .single();

  return NextResponse.json({
    status: session?.status ?? "unknown",
  });
}
