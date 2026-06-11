import { createResendClient } from "@/lib/resend";

interface InquiryNotificationParams {
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  tripTitle: string;
  departureDates?: string | null;
  preferredDates?: string | null;
  preferredNights?: number | null;
}

export async function sendInquiryNotification(
  params: InquiryNotificationParams
): Promise<void> {
  const organizerEmail = process.env.ORGANIZER_EMAIL?.trim();
  const fromEmail =
    process.env.RESEND_FROM?.trim() || "Languedoc <onboarding@resend.dev>";

  if (!organizerEmail) {
    console.warn("[email] ORGANIZER_EMAIL not set – skipping notification");
    return;
  }

  const resend = createResendClient();

  const lines = [
    `Ny interessehenvendelse for ${params.tripTitle}`,
    "",
    `Navn: ${params.name}`,
    `E-post: ${params.email}`,
  ];

  if (params.phone) lines.push(`Telefon: ${params.phone}`);
  if (params.departureDates) lines.push(`Avgang: ${params.departureDates}`);
  if (params.preferredNights) {
    lines.push(`Ønsket antall netter: ${params.preferredNights}`);
  }
  if (params.preferredDates) {
    lines.push(`Foretrukket periode: ${params.preferredDates}`);
  }
  if (params.message) lines.push("", "Melding:", params.message);

  await resend.emails.send({
    from: fromEmail,
    to: organizerEmail,
    replyTo: params.email,
    subject: `Interesse: ${params.tripTitle}`,
    text: lines.join("\n"),
  });
}

interface DepositConfirmationParams {
  to: string;
  name: string;
  tripTitle: string;
  depositEur: number;
  orderId: string;
}

export async function sendDepositConfirmation(
  params: DepositConfirmationParams
): Promise<void> {
  const fromEmail =
    process.env.RESEND_FROM?.trim() || "Languedoc <onboarding@resend.dev>";

  try {
    const resend = createResendClient();
    await resend.emails.send({
      from: fromEmail,
      to: params.to,
      subject: `Depositum mottatt – ${params.tripTitle}`,
      text: [
        `Hei ${params.name},`,
        "",
        `Takk for depositumet på €${params.depositEur} for ${params.tripTitle}.`,
        `Referanse: ${params.orderId}`,
        "",
        "Vi tar kontakt med mer informasjon om reisen.",
        "",
        "Vennlig hilsen",
        "Elisabeth og Morten – Languedoc",
      ].join("\n"),
    });
  } catch (error) {
    console.error("[email] deposit confirmation failed:", error);
  }
}
