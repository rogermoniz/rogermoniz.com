export const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? "dfbuajiyj";

const BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

/** A preview URL for the editor, deliberately small. */
export function previewUrl(path: string, width = 480): string {
  return `${BASE}/f_auto,q_auto,w_${width}/${path.replace(/^\/+/, "")}`;
}

/**
 * Accepts whatever the editor pastes: a full delivery URL, a URL carrying
 * transformations, or the bare path we actually store.
 */
export function normalisePath(input: string): string {
  const value = input.trim();
  if (!value) return "";
  const match = value.match(/\/image\/upload\/(.*)$/);
  const tail = match?.[1];
  if (!tail) return value.replace(/^\/+/, "");
  // Everything before the version segment is a transformation, not the path.
  const rest = tail.split("/");
  const start = rest.findIndex((part) => /^v\d+$/.test(part));
  return (start >= 0 ? rest.slice(start) : rest).join("/");
}

export function uploadEnabled(): boolean {
  return Boolean(process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}
