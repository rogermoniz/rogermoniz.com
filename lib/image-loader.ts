/**
 * Serves every image straight from Cloudinary at the width the layout asks for.
 *
 * Without this, `next/image` re-encodes a file Cloudinary has already encoded:
 * two lossy passes over the same photo, and a request for a width the source
 * transformation never contained, so the browser upscales a small file. One
 * encode at the right width is both sharper and cheaper.
 *
 * Transformations chain with slashes rather than commas. `srcset` is a comma
 * separated list, so a raw comma inside the URL splits one candidate into three
 * malformed ones and the browser falls back to `src`, the widest entry in the
 * set, for every image on the page. Percent encoding the comma is not a fix
 * either: Cloudinary stops applying f_auto and serves JPEG.
 */

const DELIVERY = "/image/upload/";
const VERSION = /^v\d+$/;

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const at = src.indexOf(DELIVERY);
  if (at < 0) return src;

  const base = src.slice(0, at + DELIVERY.length);
  const segments = src.slice(at + DELIVERY.length).split("/");

  // Everything before the version segment is a transformation, not the path.
  const versionAt = segments.findIndex((segment) => VERSION.test(segment));
  const existing = versionAt > 0 ? (segments[0] ?? "").split(",") : [];
  const path = (versionAt > 0 ? segments.slice(versionAt) : segments).join("/");

  const keep = existing.filter((t) => !/^[fqw]_/.test(t));
  const format = existing.find((t) => t.startsWith("f_")) ?? "f_auto";
  // The call site's intent wins: the hero marquee deliberately asks for eco.
  const q = existing.find((t) => t.startsWith("q_")) ?? (quality ? `q_${quality}` : "q_auto");

  return `${base}${[format, q, `w_${width}`, ...keep].join("/")}/${path}`;
}
