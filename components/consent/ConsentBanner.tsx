"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useConsent } from "@/components/consent/ConsentProvider";

/**
 * The consent notice.
 *
 * Refusing everything is a single button, in the same place and with the same
 * weight as accepting everything, because a refusal that costs more clicks than
 * an acceptance is not freely given. There is no dismiss control: closing the
 * notice without choosing would be neither consent nor refusal.
 */

const ACTION =
  "tactile rounded-[100px] px-6 py-3 font-display text-[0.72rem] font-bold tracking-[0.06em] uppercase";

function Switch({
  checked,
  onChange,
  disabled = false,
  label,
}: {
  checked: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full border border-edge transition-colors duration-300 ${
        checked ? "bg-accent" : "bg-menu-subtle"
      } ${disabled ? "opacity-60" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-surface transition-[left] duration-300 ease-snappy ${
          checked ? "left-[calc(100%-1.25rem)]" : "left-1"
        }`}
      />
    </button>
  );
}

export function ConsentBanner() {
  const { asking, panelOpen, decide, openPanel, closePanel } = useConsent();
  const [analytics, setAnalytics] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Announce the notice once it appears, without stealing focus mid reading.
  useEffect(() => {
    if (asking) headingRef.current?.focus();
  }, [asking]);

  if (!asking) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      // Hidden by the stylesheet, before paint, when a choice is already on
      // record. See CONSENT_BOOTSTRAP in lib/consent.ts.
      data-consent-notice=""
      className="fixed inset-x-0 bottom-0 z-1002 flex justify-center px-4 pb-4 max-md:px-3 max-md:pb-3"
    >
      <div className="tactile w-full max-w-[720px] rounded-[20px] p-7 shadow-[0_30px_80px_var(--theme-shadow)] max-md:p-5">
        <h2
          id="consent-title"
          ref={headingRef}
          tabIndex={-1}
          className="mb-3 font-display text-[1.05rem] font-bold tracking-[-0.01em] text-ink outline-none"
        >
          Votre vie privée
        </h2>

        <p className="mb-5 text-[0.92rem] leading-[1.65] text-muted">
          Ce site dépose des cookies strictement nécessaires à son fonctionnement, qui ne
          demandent pas votre accord. Avec votre autorisation, il mesure aussi son audience
          de façon anonyme. Rien n'est déposé tant que vous n'avez pas choisi, et votre
          choix reste modifiable à tout moment depuis le pied de page.{" "}
          <Link
            href="/confidentialite"
            className="text-accent underline underline-offset-2 transition-colors duration-300 hover:text-accent-hover"
          >
            Politique de confidentialité
          </Link>
        </p>

        {panelOpen ? (
          <div className="mb-6 flex flex-col gap-4 border-t border-edge pt-5">
            <div className="flex items-start gap-4">
              <Switch checked disabled label="Cookies strictement nécessaires, toujours actifs" />
              <div>
                <p className="text-[0.88rem] font-semibold text-ink">
                  Strictement nécessaires{" "}
                  <span className="font-normal text-muted">· toujours actifs</span>
                </p>
                <p className="text-[0.85rem] leading-[1.55] text-muted">
                  Mémorisent votre préférence de thème, clair ou sombre. Exemptés de
                  consentement car le site ne peut pas fonctionner sans eux.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Switch
                checked={analytics}
                onChange={setAnalytics}
                label="Mesure d'audience anonyme"
              />
              <div>
                <p className="text-[0.88rem] font-semibold text-ink">Mesure d'audience</p>
                <p className="text-[0.85rem] leading-[1.55] text-muted">
                  Compter les pages consultées, sans profilage publicitaire et sans revendre
                  quoi que ce soit. Désactivée par défaut.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => decide(false)} className={ACTION}>
            Tout refuser
          </button>
          <button type="button" onClick={() => decide(true)} className={ACTION}>
            Tout accepter
          </button>

          {panelOpen ? (
            <>
              <button type="button" onClick={() => decide(analytics)} className={ACTION}>
                Enregistrer mes choix
              </button>
              <button
                type="button"
                onClick={closePanel}
                className="text-[0.82rem] text-muted underline underline-offset-2 transition-colors duration-300 hover:text-accent"
              >
                Masquer le détail
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={openPanel}
              className="text-[0.82rem] text-muted underline underline-offset-2 transition-colors duration-300 hover:text-accent"
            >
              Personnaliser
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
