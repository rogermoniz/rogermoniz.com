const BASE = "https://res.cloudinary.com/dfbuajiyj/image/upload";

type Transform = {
  width: number;
  /** "eco" trades a little fidelity for bytes; used by the hero marquee. */
  quality?: "auto" | "auto:eco";
};

/**
 * Builds a Cloudinary delivery URL. Sizes live at the call site so a component
 * asks for the width it actually renders, rather than inheriting whatever the
 * original markup happened to hardcode.
 */
export function cloudinary(path: string, { width, quality = "auto" }: Transform): string {
  return `${BASE}/f_auto,q_${quality},w_${width}/${path}`;
}
