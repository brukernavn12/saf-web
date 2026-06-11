const locales = ["no", "sv", "en"] as const;
const defaultLocale = "no";
const LOCALE_COOKIE = "NEXT_LOCALE";

type Locale = (typeof locales)[number];

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

function getCookieLocale(request: Request): Locale | undefined {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(
    new RegExp(`${LOCALE_COOKIE}=(${locales.join("|")})`)
  );
  const locale = match?.[1];
  return locale && isLocale(locale) ? locale : undefined;
}

function getPreferredLocale(request: Request): Locale {
  const cookieLocale = getCookieLocale(request);
  if (cookieLocale) {
    return cookieLocale;
  }

  const accept = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const matched = locales.find((locale) => accept.includes(locale));
  return matched ?? defaultLocale;
}

export function middleware(request: Request) {
  const url = new URL(request.url);
  const segment = url.pathname.split("/")[1];

  if (segment && isLocale(segment)) {
    return;
  }

  const locale = getPreferredLocale(request);
  url.pathname = `/${locale}${url.pathname === "/" ? "" : url.pathname}`;

  return new Response(null, {
    status: 307,
    headers: {
      Location: url.toString(),
      "Set-Cookie": `${LOCALE_COOKIE}=${locale}; Path=/; SameSite=Lax`,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
