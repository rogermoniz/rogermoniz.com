import { NextResponse, type NextRequest } from "next/server";

/**
 * Two jobs:
 *  1. Serve the CMS at admin.rogermoniz.com by rewriting that host onto /admin.
 *  2. Keep every /admin page behind the session cookie, so an unauthenticated
 *     request never reaches a page that can read or write content.
 */
const SESSION_COOKIE = "rm_admin";

async function expectedToken(secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("rm-admin-v1"));
  return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const url = request.nextUrl.clone();
  const isAdminHost = host.startsWith("admin.");

  // The admin subdomain serves the CMS at its root.
  if (isAdminHost && !url.pathname.startsWith("/admin")) {
    url.pathname = `/admin${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  const path = isAdminHost ? `/admin${url.pathname === "/" ? "" : url.pathname}` : url.pathname;
  if (!path.startsWith("/admin")) return NextResponse.next();
  if (path.startsWith("/admin/login")) return NextResponse.next();

  const secret = process.env.ADMIN_SESSION_SECRET;
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (secret && cookie && cookie === (await expectedToken(secret))) {
    return NextResponse.next();
  }

  const login = request.nextUrl.clone();
  login.pathname = isAdminHost ? "/login" : "/admin/login";
  login.searchParams.set("next", url.pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*", "/((?!_next|favicon|.*\\..*).*)"],
};
