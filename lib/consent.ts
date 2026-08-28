/**
 * Consent, as the CNIL asks for it.
 *
 * Refusing is one click, exactly like accepting. Nothing optional runs before a
 * choice is made. The choice is recorded with the moment it was given and the
 * version of the notice it was given against, and it lapses after six months so
 * the reader is asked again rather than being bound indefinitely.
 */

export const CONSENT_KEY = "rm-consent";

/** Bump when the purposes change: an old choice no longer answers a new question. */
export const CONSENT_VERSION = 1;

/** The CNIL's guidance is to ask again after six months. */
const MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000;

export type Consent = {
  /** Audience measurement. Strictly necessary storage is never optional. */
  analytics: boolean;
  version: number;
  /** ISO timestamp, so the record says when the choice was made. */
  at: string;
};

function isConsent(value: unknown): value is Consent {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.analytics === "boolean" &&
    typeof candidate.version === "number" &&
    typeof candidate.at === "string"
  );
}

/** Returns null when there is no usable choice, which is when we must ask. */
export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isConsent(parsed)) return null;
    if (parsed.version !== CONSENT_VERSION) return null;

    const age = Date.now() - Date.parse(parsed.at);
    if (!Number.isFinite(age) || age > MAX_AGE_MS) return null;

    return parsed;
  } catch {
    // A browser that refuses storage is a browser we ask again, not one we track.
    return null;
  }
}

export function writeConsent(analytics: boolean): Consent {
  const consent: Consent = { analytics, version: CONSENT_VERSION, at: new Date().toISOString() };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // Storage denied: the choice holds for this page view and is asked again.
  }
  return consent;
}

/**
 * Google Consent Mode. Declared denied before any tag can run, so a tag that
 * loads early still stores nothing until the reader says otherwise.
 */
export const CONSENT_DEFAULTS = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});`;

export function updateConsentMode(analytics: boolean): void {
  const layer = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
  if (!layer) return;
  layer.push(["consent", "update", { analytics_storage: analytics ? "granted" : "denied" }]);
}
