import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Read only Supabase client, server side.
 *
 * The site never writes: every content table is public-select with no insert
 * or update policy, so the publishable key can only read. Throwing here rather
 * than returning null means a missing environment variable fails the build,
 * instead of silently prerendering empty pages.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error(
    "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
  );
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
