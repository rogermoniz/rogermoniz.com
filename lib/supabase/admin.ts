import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Write client for the CMS. Uses the secret key, which bypasses row level
 * security, so it must only ever be constructed inside a server action or
 * route handler that has already checked the admin session.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  throw new Error("CMS is not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.");
}

export const supabaseAdmin = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
