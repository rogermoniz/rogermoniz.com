import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/cms/auth";
import { CLOUD_NAME, uploadEnabled } from "@/lib/cms/cloudinary";

/**
 * Signs and forwards one upload to Cloudinary. The secret stays on the server,
 * so the browser never holds a credential that could upload to the account.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (!uploadEnabled()) {
    return NextResponse.json({ error: "Le téléversement n'est pas configuré." }, { status: 501 });
  }

  const incoming = await request.formData();
  const file = incoming.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 });
  }

  const apiKey = process.env.CLOUDINARY_API_KEY as string;
  const apiSecret = process.env.CLOUDINARY_API_SECRET as string;
  const folder = process.env.CLOUDINARY_FOLDER ?? "";
  const timestamp = Math.floor(Date.now() / 1000);

  const signed: Record<string, string> = { timestamp: String(timestamp) };
  if (folder) signed.folder = folder;
  const toSign = Object.keys(signed)
    .sort()
    .map((key) => `${key}=${signed[key]}`)
    .join("&");

  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(toSign + apiSecret));
  const signature = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");

  const outgoing = new FormData();
  outgoing.set("file", file);
  outgoing.set("api_key", apiKey);
  outgoing.set("signature", signature);
  for (const [key, value] of Object.entries(signed)) outgoing.set(key, value);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: outgoing,
  });
  const payload = (await response.json()) as {
    version?: number;
    public_id?: string;
    format?: string;
    error?: { message?: string };
  };

  if (!response.ok || !payload.public_id) {
    return NextResponse.json(
      { error: payload.error?.message ?? "Cloudinary a refusé le fichier." },
      { status: 502 },
    );
  }

  return NextResponse.json({ path: `v${payload.version}/${payload.public_id}.${payload.format}` });
}
