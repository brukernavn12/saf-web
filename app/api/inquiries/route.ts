import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import { sendInquiryNotification } from "@/lib/email";
import { formatDate } from "@/lib/utils";
import type { Locale } from "@/types";

interface InquiryBody {
  tripId: string;
  departureId?: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  locale?: Locale;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as InquiryBody;
    const {
      tripId,
      departureId,
      name,
      email,
      phone,
      message,
      locale = "no",
    } = body;

    if (!tripId || !name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
    }

    const db = createSupabaseAdmin();

    const { data: trip } = await db
      .from("trips")
      .select("id, title_no, status")
      .eq("id", tripId)
      .eq("status", "active")
      .single();

    if (!trip) {
      return NextResponse.json({ error: "Reise ikke funnet" }, { status: 404 });
    }

    let departureDates: string | null = null;

    if (departureId) {
      const { data: departure } = await db
        .from("departures")
        .select("start_date, end_date, trip_id")
        .eq("id", departureId)
        .eq("trip_id", tripId)
        .single();

      if (departure) {
        departureDates = `${formatDate(departure.start_date, locale)} – ${formatDate(departure.end_date, locale)}`;
      }
    }

    const { error: insertError } = await db.from("inquiries").insert({
      trip_id: tripId,
      departure_id: departureId ?? null,
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      message: message?.trim() || null,
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
