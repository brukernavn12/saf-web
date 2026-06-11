"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function PaymentWaitingClient() {
  const t = useTranslations("payment");
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!orderId || attempts >= 10) return;

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/payment/status?orderId=${orderId}`);
      const { status } = await res.json();

      if (status === "captured") {
        router.replace("/betaling/suksess");
      } else if (status === "cancelled" || status === "failed") {
        router.replace("/betaling/avbrutt");
      } else {
        setAttempts((a) => a + 1);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [orderId, attempts, router]);

  return (
    <div className="mx-auto max-w-md px-6 py-32 text-center">
      <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-accent" />
      <h1 className="font-serif text-2xl text-primary">{t("waitingTitle")}</h1>
      <p className="mt-3 text-sm text-text/70">{t("waitingDescription")}</p>
    </div>
  );
}
