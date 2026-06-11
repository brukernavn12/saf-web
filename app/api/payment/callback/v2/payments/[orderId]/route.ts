import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import { completeBookingPayment } from "@/lib/booking-payment";

interface VippsCallbackBody {
  orderId: string;
  transactionInfo: {
    status: "RESERVE" | "SALE" | "CANCEL" | "REJECT";
    transactionId: string;
  };
}

export async function POST(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const body = (await req.json()) as VippsCallbackBody;
    const orderId = params.orderId;
    const status = body.transactionInfo?.status;

    const db = createSupabaseAdmin();
    const { data: session } = await db
      .from("payment_sessions")
      .select("status")
      .eq("order_id", orderId)
      .single();

    if (!session) {
      return NextResponse.json({ ok: true });
    }

    if (session.status === "captured") {
      return NextResponse.json({ ok: true });
    }

    if (status === "CANCEL" || status === "REJECT") {
      await db
        .from("payment_sessions")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("order_id", orderId);
      return NextResponse.json({ ok: true });
    }

    if (status === "RESERVE" || status === "SALE") {
      await completeBookingPayment(orderId, body.transactionInfo.transactionId);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[vipps-callback]", error);
    return NextResponse.json({ ok: true });
  }
}
