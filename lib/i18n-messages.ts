import type { Locale } from "@/types";

type MessageNode = string | MessageTree;
type MessageTree = { [key: string]: MessageNode };

function isMessageTree(value: unknown): value is MessageTree {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasMessageValue(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

/** Deep-merge locale messages onto Norwegian base; missing or empty values use Norwegian. */
export function mergeMessagesWithFallback(
  base: MessageTree,
  override: MessageTree
): MessageTree {
  const result: MessageTree = { ...base };

  for (const key of Object.keys(base)) {
    const baseValue = base[key];
    const overrideValue = override[key];

    if (isMessageTree(baseValue)) {
      result[key] = isMessageTree(overrideValue)
        ? mergeMessagesWithFallback(baseValue, overrideValue)
        : baseValue;
      continue;
    }

    if (hasMessageValue(overrideValue)) {
      result[key] = overrideValue;
    } else if (typeof baseValue === "string") {
      result[key] = baseValue;
    }
  }

  for (const key of Object.keys(override)) {
    if (!(key in base)) {
      result[key] = override[key];
    }
  }

  return result;
}

/** Sync en/sv message files: add missing keys and empty values from no.json. */
export function syncMessagesFromNorwegian(
  noMessages: MessageTree,
  localeMessages: MessageTree
): { messages: MessageTree; addedKeys: string[] } {
  const addedKeys: string[] = [];
  const result = syncNode(noMessages, localeMessages, "", addedKeys);
  return { messages: result, addedKeys };
}

function syncNode(
  noNode: MessageTree,
  localeNode: MessageTree,
  prefix: string,
  addedKeys: string[]
): MessageTree {
  const result: MessageTree = { ...localeNode };

  for (const key of Object.keys(noNode)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const noValue = noNode[key];
    const localeValue = localeNode[key];

    if (isMessageTree(noValue)) {
      const child =
        localeValue && isMessageTree(localeValue)
          ? localeValue
          : {};
      const syncedChild = syncNode(noValue, child, path, addedKeys);
      if (!(key in localeNode) || !isMessageTree(localeValue)) {
        addedKeys.push(path);
      }
      result[key] = syncedChild;
      continue;
    }

    if (!(key in localeNode)) {
      result[key] = noValue;
      addedKeys.push(path);
    } else if (
      typeof noValue === "string" &&
      typeof localeValue === "string" &&
      localeValue.trim() === "" &&
      noValue.trim() !== ""
    ) {
      result[key] = noValue;
      addedKeys.push(path);
    }
  }

  return result;
}

export async function loadLocaleMessages(locale: Locale): Promise<MessageTree> {
  const noMessages = (await import("@/messages/no.json")).default as MessageTree;

  if (locale === "no") {
    return noMessages;
  }

  const localeMessages = (await import(`@/messages/${locale}.json`))
    .default as MessageTree;

  return mergeMessagesWithFallback(noMessages, localeMessages);
}
