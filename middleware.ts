import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["no", "sv", "en"] as const;
const defaultLocale = "no";
const LOCALE_COOKIE = "NEXT_LOCALE";

type Locale = (typeof locales)[number];

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

function getCookieLocale(request: NextRequest): Locale | undefined {
  const locale = request.cookies.get(LOCALE_COOKIE)?.value;
  return locale && isLocale(locale) ? locale : undefined;
}

function getPreferredLocale(request: NextRequest): Locale {
  const cookieLocale = getCookieLocale(request);
  if (cookieLocale) {
    return cookieLocale;
  }

  const accept = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const matched = locales.find((locale) => accept.includes(locale));
  return matched ?? defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.split("/")[1];

  if (segment && isLocale(segment)) {
    return NextResponse.next();
  }

  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url, 307);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
