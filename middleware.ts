import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const locales = ["no", "sv", "en"] as const;
const defaultLocale = "no";
const LOCALE_HEADER = "X-NEXT-INTL-LOCALE";
const LOCALE_COOKIE = "NEXT_LOCALE";

type Locale = (typeof locales)[number];

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

function getPreferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) {
    return cookie;
  }

  const accept = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const matched = locales.find((locale) => accept.includes(locale));
  return matched ?? defaultLocale;
}

function withLocaleHeader(request: NextRequest, locale: Locale) {
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, locale);
  return headers;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.split("/")[1];

  if (segment && isLocale(segment)) {
    const response = NextResponse.next({
      request: { headers: withLocaleHeader(request, segment) },
    });
    response.cookies.set(LOCALE_COOKIE, segment, {
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
