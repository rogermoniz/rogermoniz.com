const BASE = "https://res.cloudinary.com/dfbuajiyj/image/upload";

type Transform = {
  width: number;
  /** "eco" trades a little fidelity for bytes; used by the hero marquee. */
  quality?: "auto" | "auto:eco";
};

/**
 * The stored form of a picture, whichever way it was written down.
 *
 * The editor accepts a pasted Cloudinary link as readily as the bare path, and
 * some rows have been stored each way, so a component that simply glued the
 * stored value onto the delivery prefix produced a URL with a second URL
 * inside it and an image that never loaded. Reading it here means no component
 * has to care, and neither does whoever is filling the field.
 */
function storedPath(value: string): string {
  const tail = value.match(/\/image\/upload\/(.*)$/)?.[1];
  if (!tail) return value.replace(/^\/+/, "");
  const parts = tail.split("/");
  const version = parts.findIndex((part) => /^v\d+$/.test(part));
  return (version >= 0 ? parts.slice(version) : parts).join("/");
}

/**
 * Builds a Cloudinary delivery URL. Sizes live at the call site so a component
 * asks for the width it actually renders, rather than inheriting whatever the
 * original markup happened to hardcode.
 */
export function cloudinary(path: string, { width, quality = "auto" }: Transform): string {
  return `${BASE}/f_auto,q_${quality},w_${width}/${storedPath(path)}`;
}
