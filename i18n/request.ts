import { getRequestConfig } from "next-intl/server";
import { loadLocaleMessages } from "@/lib/i18n-messages";
import type { Locale } from "@/types";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await loadLocaleMessages(locale as Locale),
  };
});
