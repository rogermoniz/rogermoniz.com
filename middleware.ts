import { NextResponse, type NextRequest } from "next/server";

/**
 * Keeps every /admin page behind the session cookie, so an unauthenticated
 * request never reaches a page that can read or write content.
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
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const secret = process.env.ADMIN_SESSION_SECRET;
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (secret && cookie && cookie === (await expectedToken(secret))) {
    return NextResponse.next();
  }

  const login = request.nextUrl.clone();
  login.pathname = "/admin/login";
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

/** Only the CMS is guarded; the public site never runs this. */
export const config = {
  matcher: ["/admin/:path*"],
};
