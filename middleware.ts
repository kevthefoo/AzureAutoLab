import { NextResponse, type NextRequest } from "next/server";

const ALLOW_PREFIXES = ["/setup", "/api/setup", "/_next", "/favicon", "/icon"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow these paths through, even if setup isn't complete
  if (ALLOW_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const setupOk = req.cookies.get("setup-ok")?.value;
  if (setupOk === "1") {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/setup";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
