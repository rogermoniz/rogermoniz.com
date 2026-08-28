import "server-only";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "rm_admin";

/**
 * The session cookie is an HMAC of a fixed string under a server secret, so a
 * valid cookie cannot be forged without the secret and the password itself is
 * never stored in the browser.
 */
export async function sessionToken(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set.");

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

/** Constant time compare, so a wrong cookie cannot be guessed byte by byte. */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function isSignedIn(): Promise<boolean> {
  const jar = await cookies();
  const value = jar.get(SESSION_COOKIE)?.value;
  if (!value) return false;
  return safeEqual(value, await sessionToken());
}

export async function checkPassword(candidate: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD is not set.");
  return safeEqual(candidate, expected);
}
