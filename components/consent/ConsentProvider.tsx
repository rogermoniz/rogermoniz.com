"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readConsent, updateConsentMode, writeConsent, type Consent } from "@/lib/consent";

type ConsentState = {
  consent: Consent | null;
  /** False until the stored choice has been read. */
  ready: boolean;
  /**
   * True while the reader has no valid choice on record, and true on the
   * server, so the notice is in the HTML rather than waiting for hydration.
   */
  asking: boolean;
  panelOpen: boolean;
  decide: (analytics: boolean) => void;
  openPanel: () => void;
  closePanel: () => void;
  /** Reopens the notice so a choice can be changed or withdrawn. */
  reconsider: () => void;
};

const Context = createContext<ConsentState | null>(null);

export function useConsent(): ConsentState {
  const value = useContext(Context);
  if (!value) throw new Error("useConsent must be used inside ConsentProvider.");
  return value;
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [reasking, setReasking] = useState(false);

  // Storage is only readable in the browser, so the first paint asks nothing.
  useEffect(() => {
    const stored = readConsent();
    setConsent(stored);
    if (stored) updateConsentMode(stored.analytics);
    setReady(true);
  }, []);

  const decide = useCallback((analytics: boolean) => {
    const next = writeConsent(analytics);
    setConsent(next);
    updateConsentMode(analytics);
    setPanelOpen(false);
    setReasking(false);
  }, []);

  // Kept on the root element so the stylesheet can hide the notice before the
  // first paint for a reader who has already chosen. The pre paint script in
  // the document head sets the same attribute; this keeps it honest afterwards.
  const asking = !ready || consent === null || reasking;
  useEffect(() => {
    document.documentElement.setAttribute("data-consent", asking ? "ask" : "set");
  }, [asking]);

  const value = useMemo<ConsentState>(
    () => ({
      consent,
      ready,
      asking,
      panelOpen,
      decide,
      openPanel: () => setPanelOpen(true),
      closePanel: () => setPanelOpen(false),
      reconsider: () => {
        setReasking(true);
        setPanelOpen(true);
      },
    }),
    [consent, ready, reasking, panelOpen, decide, asking],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
