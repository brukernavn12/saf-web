import { NextRequest, NextResponse } from "next/server";
import { sendContactNotification } from "@/lib/email";

interface ContactBody {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactBody;
    const { name, email, phone, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
    }

    await sendContactNotification({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim(),
      message: message.trim(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json({ error: "Intern serverfeil" }, { status: 500 });
  }
}
