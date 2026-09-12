import { createHash, timingSafeEqual } from "crypto";
import { revalidatePath } from "next/cache";
import { storeIncomingMedia } from "@/lib/pending-media";

export const runtime = "nodejs";

type CloudinaryNotification = {
  notification_type?: string;
  secure_url?: string;
  url?: string;
  resource_type?: string;
  public_id?: string;
  context?: unknown;
  metadata?: unknown;
  resources?: CloudinaryNotification[];
};

function signaturesMatch(expectedHex: string, provided: string) {
  const a = Buffer.from(expectedHex, "utf8");
  const b = Buffer.from(provided, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function verifySignature(rawBody: string, request: Request): boolean {
  const secret = process.env.CLOUDINARY_WEBHOOK_SECRET?.trim();
  if (!secret) return true;

  const timestamp = request.headers.get("x-cld-timestamp") ?? "";
  const signature = request.headers.get("x-cld-signature") ?? "";
  if (!timestamp || !signature) return false;

  const expected = createHash("sha1")
    .update(rawBody + timestamp + secret)
    .digest("hex");
  return signaturesMatch(expected, signature);
}

function collectAssets(payload: CloudinaryNotification): CloudinaryNotification[] {
  if (Array.isArray(payload.resources) && payload.resources.length) {
    return payload.resources;
  }
  return [payload];
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifySignature(rawBody, request)) {
    return Response.json({ ok: false, error: "Invalid signature." }, { status: 401 });
  }

  let payload: CloudinaryNotification;
  try {
    payload = JSON.parse(rawBody) as CloudinaryNotification;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  if (payload.notification_type && payload.notification_type !== "upload") {
    return Response.json({ ok: true, ignored: payload.notification_type });
  }

  let stored = 0;
  for (const asset of collectAssets(payload)) {
    const url = asset.secure_url || asset.url;
    if (!url) continue;
    const result = await storeIncomingMedia({
      url,
      resourceType: asset.resource_type,
      publicId: asset.public_id,
      context: asset.context,
      metadata: asset.metadata,
    });
    if (result.stored) stored += 1;
  }

  if (stored) {
    revalidatePath("/admin");
  }

  return Response.json({ ok: true, stored });
}
