import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import {
  calculateBookingAmountsEur,
  convertEurToNok,
  generateOrderId,
  getAppUrl,
  getCallbackBaseUrl,
  MIN_BOOKING_PERSONS,
} from "@/lib/payment";
import { getEurToNokRate } from "@/lib/exchange-rate";
import { initiateVippsPayment } from "@/lib/vipps";
import type { Locale } from "@/types";

interface InitiateBody {
  tripId: string;
  departureId: string;
  guestName: string;
  email: string;
  phone: string;
  persons: number;
  roomPreference?: "share_with_named" | "open_to_share";
  roomMateName?: string;
  locale?: Locale;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as InitiateBody;
    const {
      tripId,
      departureId,
      guestName,
      email,
      phone,
      persons,
      roomPreference,
      roomMateName,
      locale = "no",
    } = body;

    if (
      !tripId ||
      !departureId ||
      !guestName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !persons
    ) {
      return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
    }

    const db = createSupabaseAdmin();

    const { data: departure, error: depError } = await db
      .from("departures")
      .select("*, trips(*)")
      .eq("id", departureId)
      .eq("trip_id", tripId)
      .in("status", ["open", "confirmed"])
      .single();

    if (depError || !departure) {
      return NextResponse.json({ error: "Avgang ikke funnet" }, { status: 404 });
    }

    const tripRow = departure.trips as {
      title_no: string;
      base_price_eur: number;
      max_persons: number;
      single_room_supplement_eur: number | null;
      min_persons_per_booking: number | null;
      min_persons: number | null;
    };

    const minPersons = Math.max(
      MIN_BOOKING_PERSONS,
      tripRow.min_persons_per_booking ?? tripRow.min_persons ?? MIN_BOOKING_PERSONS
    );

    if (persons < minPersons) {
      return NextResponse.json(
        { error: `Minimum ${minPersons} personer per bestilling` },
        { status: 400 }
      );
    }

    if (departure.available_spots < persons) {
      return NextResponse.json({ error: "Ikke nok plasser" }, { status: 400 });
    }

    const trip = tripRow;

    if (persons > trip.max_persons) {
      return NextResponse.json(
        { error: `Maks ${trip.max_persons} personer` },
        { status: 400 }
      );
    }

    const pricePerPerson = Number(
      departure.price_eur ?? trip.base_price_eur
    );
    const breakdown = calculateBookingAmountsEur(
      pricePerPerson,
      persons,
      trip.single_room_supplement_eur
    );

    const { totalEur, depositEur, remainderEur, singleRooms } = breakdown;

    const exchangeRate = await getEurToNokRate();

    if (!exchangeRate) {
      return NextResponse.json(
        { error: "Valutakurs utilgjengelig – prøv igjen senere" },
        { status: 503 }
      );
    }

    const depositNok = convertEurToNok(depositEur, exchangeRate.rate);

    const orderId = generateOrderId();
    const remainderDueDate = departure.start_date
      ? new Date(
          new Date(departure.start_date).getTime() - 30 * 24 * 60 * 60 * 1000
        )
          .toISOString()
          .split("T")[0]
      : null;

    const roomType = singleRooms > 0 ? "with_single_supplement" : "shared";

    if (
      roomPreference === "share_with_named" &&
      !roomMateName?.trim()
    ) {
      return NextResponse.json(
        { error: "Oppgi navn på reisefølge" },
        { status: 400 }
      );
    }

    const { data: booking, error: bookingError } = await db
      .from("bookings")
      .insert({
        departure_id: departureId,
        guest_name: guestName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        persons,
        total_eur: totalEur,
        deposit_eur: depositEur,
        remainder_eur: remainderEur,
        remainder_due_date: remainderDueDate,
        status: "pending",
        payment_method: "vipps",
        language: locale,
        room_type: roomType,
        room_preference: roomPreference ?? null,
        room_mate_name:
          roomPreference === "share_with_named"
            ? roomMateName?.trim() ?? null
            : null,
        terms_accepted_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (bookingError || !booking) {
      console.error("[payment/initiate] booking error:", bookingError);
      return NextResponse.json(
        { error: "Kunne ikke opprette booking" },
        { status: 500 }
      );
    }

    const { error: sessionError } = await db.from("payment_sessions").insert({
      order_id: orderId,
      departure_id: departureId,
      trip_id: tripId,
      guest_name: guestName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      persons,
      total_eur: totalEur,
      deposit_eur: depositEur,
      deposit_nok: depositNok,
      language: locale,
      booking_id: booking.id,
      status: "pending",
    });

    if (sessionError) {
      console.error("[payment/initiate] session error:", sessionError);
      await db.from("bookings").delete().eq("id", booking.id);
      return NextResponse.json(
        { error: "Kunne ikke opprette betalingsøkt" },
        { status: 500 }
      );
    }

    const appUrl = getAppUrl();
    const callbackBase = getCallbackBaseUrl();

    const vippsResult = await initiateVippsPayment({
      orderId,
      amountNok: depositNok,
      description: `Depositum – ${trip.title_no}`,
      callbackUrl: `${callbackBase}/api/payment/callback`,
      fallbackUrl: `${appUrl}/api/payment/fallback?orderId=${orderId}`,
    });

    return NextResponse.json({
      redirectUrl: vippsResult.redirectUrl,
      orderId,
      depositEur,
      depositNok,
    });
  } catch (error) {
    console.error("[payment/initiate]", error);
    return NextResponse.json({ error: "Intern serverfeil" }, { status: 500 });
  }
}
