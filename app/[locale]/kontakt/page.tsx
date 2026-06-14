import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/kontakt/ContactForm";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/lib/locales";
import { getPageMetadataCopy } from "@/lib/seo-messages";
import { buildPageMetadata } from "@/lib/seo";

const CONTACT = {
  elisabeth: { display: "+47 90 11 74 35", tel: "+4790117435" },
  mortenNo: { display: "+47 48 00 60 70", tel: "+4748006070" },
  mortenFr: { display: "+33 06 37 52 81 48", tel: "+33637528148" },
  email: "info@smakenavfrankrike.no",
} as const;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const { title, description } = await getPageMetadataCopy(locale, "contact");

  return buildPageMetadata({
    locale,
    pathname: "/kontakt",
    title,
    description,
  });
}

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

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
            <ContactForm />
          </div>
        </div>
      </div>
    </Section>
  );
}
