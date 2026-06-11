import { createSupabaseAdmin } from "@/lib/supabase";
import { captureVippsPayment } from "@/lib/vipps";
import { sendDepositConfirmation } from "@/lib/email";

export async function completeBookingPayment(
  orderId: string,
  transactionId?: string
): Promise<boolean> {
  const db = createSupabaseAdmin();

  const { data: session } = await db
    .from("payment_sessions")
    .select("*, trips(title_no)")
    .eq("order_id", orderId)
    .single();

  if (!session || session.status === "captured") {
    return false;
  }

  await captureVippsPayment(orderId);

  const now = new Date().toISOString();

  await db
    .from("bookings")
    .update({
      status: "deposit_paid",
      deposit_paid_at: now,
      payment_method: "vipps",
    })
    .eq("id", session.booking_id);

  await db
    .from("payment_sessions")
    .update({
      status: "captured",
      vipps_transaction_id: transactionId ?? null,
      updated_at: now,
    })
    .eq("order_id", orderId);

  const tripTitle =
    (session.trips as { title_no: string } | null)?.title_no ?? "Languedoc";

  await sendDepositConfirmation({
    to: session.email,
    name: session.guest_name,
    tripTitle,
    depositEur: Number(session.deposit_eur),
    orderId,
  });

  return true;
}
