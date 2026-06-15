import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin, createSupabaseClient } from "@/lib/supabase";
import { sendInquiryNotification } from "@/lib/email";
import { formatDate } from "@/lib/utils";
import type { Locale } from "@/types";

interface InquiryBody {
  tripId?: string;
  tripSlug?: string;
  departureId?: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  preferredDates?: string;
  preferredNights?: number;
  locale?: Locale;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as InquiryBody;
    const {
      tripId,
      tripSlug,
      departureId,
      name,
      email,
      phone,
      message,
      preferredDates,
      preferredNights,
      locale = "no",
    } = body;

    if ((!tripId && !tripSlug) || !name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
    }

    const readDb = createSupabaseClient();
    if (!readDb) {
      console.error("[inquiries] Supabase is not configured");
      return NextResponse.json(
        { error: "Tjenesten er midlertidig utilgjengelig" },
        { status: 503 }
      );
    }

    let tripQuery = readDb
      .from("trips")
      .select("id, title_no, status")
      .eq("status", "active");

    if (tripSlug) {
      tripQuery = tripQuery.eq("slug", tripSlug.trim());
    } else {
      tripQuery = tripQuery.eq("id", tripId!);
    }

    const { data: trip, error: tripError } = await tripQuery.maybeSingle();

    if (tripError) {
      console.error("[inquiries] trip lookup error:", tripError);
      return NextResponse.json(
        { error: "Kunne ikke hente reiseinformasjon" },
        { status: 500 }
      );
    }

    if (!trip) {
      return NextResponse.json({ error: "Reise ikke funnet" }, { status: 404 });
    }

    const resolvedTripId = trip.id;

    let adminDb;
    try {
      adminDb = createSupabaseAdmin();
    } catch (error) {
      console.error("[inquiries] Missing Supabase admin credentials:", error);
      return NextResponse.json(
        { error: "Tjenesten er midlertidig utilgjengelig" },
        { status: 503 }
      );
    }

    let departureDates: string | null = null;

    if (departureId) {
      const { data: departure } = await readDb
        .from("departures")
        .select("start_date, end_date, trip_id")
        .eq("id", departureId)
        .eq("trip_id", resolvedTripId)
        .single();

      if (departure) {
        departureDates = `${formatDate(departure.start_date, locale)} – ${formatDate(departure.end_date, locale)}`;
      }
    }

    const { error: insertError } = await adminDb.from("inquiries").insert({
      trip_id: resolvedTripId,
      departure_id: departureId ?? null,
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      message: message?.trim() || null,
      preferred_dates: preferredDates?.trim() || null,
      group_size:
        preferredNights != null && preferredNights > 0
          ? preferredNights
          : null,
      type: "interest",
      status: "new",
      language: locale,
    });

    if (insertError) {
      console.error("[inquiries] insert error:", insertError);
      return NextResponse.json(
        { error: "Kunne ikke lagre henvendelsen" },
        { status: 500 }
      );
    }

    try {
      await sendInquiryNotification({
        name: name.trim(),
        email: email.trim(),
        phone: phone?.trim(),
        message: message?.trim(),
        tripTitle: trip.title_no,
        departureDates,
        preferredDates: preferredDates?.trim(),
        preferredNights,
      });
    } catch (emailError) {
      console.error("[inquiries] email error:", emailError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[inquiries]", error);
    return NextResponse.json({ error: "Intern serverfeil" }, { status: 500 });
  }
}
