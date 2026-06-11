import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import { getVippsPaymentStatus } from "@/lib/vipps";
import { completeBookingPayment } from "@/lib/booking-payment";
import { getAppUrl } from "@/lib/payment";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  const appUrl = getAppUrl();

  if (!orderId) {
    return NextResponse.redirect(new URL("/", appUrl));
  }

  const db = createSupabaseAdmin();
  const { data: session } = await db
    .from("payment_sessions")
    .select("status, language")
    .eq("order_id", orderId)
    .single();

  const locale = session?.language ?? "no";
  const base = `${appUrl}/${locale}/betaling`;

  if (!session) {
    return NextResponse.redirect(new URL(`${base}/avbrutt`, appUrl));
  }

  if (session.status === "captured") {
    return NextResponse.redirect(new URL(`${base}/suksess`, appUrl));
  }

  if (session.status === "cancelled") {
    return NextResponse.redirect(new URL(`${base}/avbrutt`, appUrl));
  }

  try {
    const vippsStatus = await getVippsPaymentStatus(orderId);

    if (vippsStatus === "RESERVE" || vippsStatus === "SALE") {
      await completeBookingPayment(orderId);
      return NextResponse.redirect(new URL(`${base}/suksess`, appUrl));
    }

    if (
      vippsStatus === "CANCEL" ||
      vippsStatus === "REJECT" ||
      vippsStatus === "FAILED"
    ) {
      await db
        .from("payment_sessions")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("order_id", orderId);
      return NextResponse.redirect(new URL(`${base}/avbrutt`, appUrl));
    }
  } catch (error) {
    console.error("[payment/fallback]", error);
  }

  return NextResponse.redirect(
    new URL(`${base}/venter?orderId=${orderId}`, appUrl)
  );
}
