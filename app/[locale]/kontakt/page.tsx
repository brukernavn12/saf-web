"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";

const CONTACT = {
  elisabeth: { display: "+47 90 11 74 35", tel: "+4790117435" },
  mortenNo: { display: "+47 48 00 60 70", tel: "+4748006070" },
  mortenFr: { display: "+33 06 37 52 81 48", tel: "+33637528148" },
  email: "info@smakenavfrankrike.no",
} as const;

export default function ContactPage() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <Section>
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-4xl text-primary md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-text/70">{t("description")}</p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <aside>
            <dl className="space-y-5 text-base leading-relaxed text-text/80">
              <div>
                <dt className="font-medium text-primary">{t("elisabeth")}</dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${CONTACT.elisabeth.tel}`}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    {CONTACT.elisabeth.display}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-primary">{t("morten")}</dt>
                <dd className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <a
                    href={`tel:${CONTACT.mortenNo.tel}`}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    {CONTACT.mortenNo.display}
                  </a>
                  <span className="text-text/40" aria-hidden>
                    /
                  </span>
                  <a
                    href={`tel:${CONTACT.mortenFr.tel}`}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    {CONTACT.mortenFr.display}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-primary">{t("emailLabel")}</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    {CONTACT.email}
                  </a>
                </dd>
              </div>
            </dl>
          </aside>

          <div>
            {submitted ? (
              <p className="rounded border border-primary/10 bg-primary/5 p-6 text-primary">
                {t("success")}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input label={t("name")} name="name" required />
                <Input label={t("email")} name="email" type="email" required />
                <Input label={t("phone")} name="phone" type="tel" />
                <Textarea label={t("message")} name="message" required />
                <Button type="submit" variant="ghost">
                  {t("submit")}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
