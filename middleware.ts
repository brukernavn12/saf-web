import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/sv" || pathname.startsWith("/sv/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/sv(?=\/|$)/, "/no") || "/no";
    return NextResponse.redirect(url, 307);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(no|en)/:path*", "/sv", "/sv/:path*"],
};
