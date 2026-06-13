import { NextRequest, NextResponse } from "next/server";
import { subscribeToBrevoNewsletter } from "@/lib/brevo";
import { locales, type Locale } from "@/lib/locales";

interface NewsletterBody {
  email?: string;
  optIn?: boolean;
  locale?: Locale;
}

const LOCALES = [...locales] as Locale[];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as NewsletterBody;
    const email = body.email?.trim() ?? "";
    const locale = body.locale && LOCALES.includes(body.locale) ? body.locale : "no";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    if (!body.optIn) {
      return NextResponse.json({ error: "consent_required" }, { status: 400 });
    }

    const ok = await subscribeToBrevoNewsletter({ email, locale });

    if (!ok) {
      return NextResponse.json({ error: "subscription_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[newsletter]", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
