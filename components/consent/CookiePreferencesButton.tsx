"use client";

import { useConsent } from "@/components/consent/ConsentProvider";
import { CookieIcon } from "@/components/primitives/SocialIcons";

/** The way back to the notice, so a choice can be changed or withdrawn. */
export function CookiePreferencesButton({ className }: { className?: string }) {
  const { reconsider } = useConsent();

  return (
    <button type="button" onClick={reconsider} className={className}>
      <CookieIcon className="size-[15px]" /> Cookies
    </button>
  );
}
