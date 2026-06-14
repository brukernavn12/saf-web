import type { Locale } from "@/lib/locales";

type MessageTree = Record<string, unknown>;

async function loadRawMessages(locale: Locale): Promise<MessageTree> {
  switch (locale) {
    case "no":
      return (await import("@/messages/no.json")).default as MessageTree;
    case "en":
      return (await import("@/messages/en.json")).default as MessageTree;
    case "sv":
      return (await import("@/messages/sv.json")).default as MessageTree;
  }
}

function readNestedString(messages: MessageTree, path: string): string {
  const parts = path.split(".");
  let current: unknown = messages;

  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in current)) {
      return "";
    }
    current = (current as MessageTree)[part];
  }

  return typeof current === "string" ? current.trim() : "";
}

/** Metadata strings for the active locale only – never falls back to Norwegian. */
export async function getMetadataString(
  locale: Locale,
  path: string
): Promise<string> {
  const messages = await loadRawMessages(locale);
  return readNestedString(messages, path);
}

export async function getPageMetadataCopy(
  locale: Locale,
  page:
    | "home"
    | "trips"
    | "languedoc"
    | "about"
    | "contact"
    | "privateTrips"
): Promise<{ title: string; description: string }> {
  const [title, description] = await Promise.all([
    getMetadataString(locale, `metadata.${page}.title`),
    getMetadataString(locale, `metadata.${page}.description`),
  ]);

  return { title, description };
}

export async function getTripDetailTitleSuffix(
  locale: Locale
): Promise<string> {
  return getMetadataString(locale, "metadata.tripDetail.titleSuffix");
}
