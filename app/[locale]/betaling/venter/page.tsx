import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { PaymentWaitingClient } from "@/components/payment/PaymentWaitingClient";
import type { Locale } from "@/types";

export default function PaymentWaitingPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);

  return (
    <Suspense>
      <PaymentWaitingClient />
    </Suspense>
  );
}
