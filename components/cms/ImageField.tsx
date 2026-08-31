"use client";

import { useId, useRef, useState } from "react";
import { normalisePath, previewUrl } from "@/lib/cms/cloudinary";

const CONTROL =
  "w-full rounded-lg border border-edge bg-surface px-4 py-3 font-body text-[0.95rem] text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_4px_rgb(216_171_82_/_0.1)]";

const CHIP =
  "rounded-full border border-edge px-3.5 py-1.5 font-display text-[0.62rem] font-bold tracking-[1px] uppercase transition-colors duration-200 hover:border-accent hover:text-accent disabled:opacity-50";

export function ImageField({
  name,
  value,
  required,
  library,
  canUpload,
  onChange,
}: {
  /** Empty when the value is carried by a parent editor rather than the form. */
  name: string;
  value: string;
  required: boolean;
  library: readonly string[];
  canUpload: boolean;
  onChange?: (path: string) => void;
}) {
  const [path, setPathState] = useState(value);

  /**
   * The field follows the value it is given.
   *
   * It used to read it once and keep its own copy, which held while the field
   * was the only thing writing to it and broke the moment a list moved
   * underneath it: two pictures swapped places in the data and both fields went
   * on showing the picture they had opened with, so a reorder looked like it had
   * done nothing while it had in fact worked. Setting state during the render
   * that noticed the change is React's own answer to this, and costs one extra
   * render of this field alone.
   */
  const [given, setGiven] = useState(value);
  if (given !== value) {
    setGiven(value);
    setPathState(value);
  }

  function setPath(next: string) {
    setPathState(next);
    onChange?.(next);
  }
  const [browsing, setBrowsing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const inputId = useId();

  async function upload(file: File) {
    setBusy(true);
    setStatus("Envoi en cours…");
    try {
      const body = new FormData();
      body.set("file", file);
      const response = await fetch("/api/cms/upload", { method: "POST", body });
      const payload = (await response.json()) as { path?: string; error?: string };
      if (!response.ok || !payload.path) throw new Error(payload.error ?? "Envoi impossible.");
      setPath(payload.path);
      setStatus("Image envoyée. Pensez à enregistrer.");
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : "Envoi impossible.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-4">
        <div className="size-20 shrink-0 overflow-hidden rounded-lg border border-edge bg-menu-subtle">
          {path ? (
            /* Cloudinary is not in the image optimiser's allowlist for admin
               previews, and a thumbnail here needs no optimisation. */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl(path, 200)}
              alt=""
              className="size-full object-cover"
              onError={(event) => {
                event.currentTarget.style.opacity = "0";
              }}
            />
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            id={inputId}
            {...(name ? { name } : {})}
            type="text"
            value={path}
            required={required}
            onChange={(event) => setPath(event.target.value)}
            onBlur={(event) => setPath(normalisePath(event.target.value))}
            placeholder="v1779962864/exemple_abc123.webp"
            className={`${CONTROL} font-mono text-xs`}
          />
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setBrowsing((open) => !open)} className={CHIP}>
              {browsing ? "Fermer" : "Choisir dans le site"}
            </button>
            {canUpload ? (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => fileInput.current?.click()}
                  className={CHIP}
                >
                  {busy ? "Envoi…" : "Téléverser"}
                </button>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void upload(file);
                    event.target.value = "";
                  }}
                />
              </>
            ) : null}
            {path ? (
              <button type="button" onClick={() => setPath("")} className={CHIP}>
                Retirer
              </button>
            ) : null}
          </div>
          {status ? <p className="text-xs text-muted">{status}</p> : null}
          {!canUpload ? (
            <p className="text-xs text-muted">
              Collez un lien Cloudinary : le chemin est extrait automatiquement.
            </p>
          ) : null}
        </div>
      </div>

      {browsing ? (
        <div className="max-h-72 overflow-y-auto rounded-xl border border-edge p-3">
          <div className="grid grid-cols-6 gap-2 max-md:grid-cols-4">
            {library.map((candidate) => (
              <button
                key={candidate}
                type="button"
                title={candidate}
                onClick={() => {
                  setPath(candidate);
                  setBrowsing(false);
                }}
                className={`aspect-square overflow-hidden rounded-md border transition-colors duration-200 ${
                  candidate === path ? "border-accent" : "border-edge hover:border-accent"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl(candidate, 160)} alt="" loading="lazy" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
