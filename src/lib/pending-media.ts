import { prisma } from "@/lib/prisma";
import { parseMediaList } from "@/lib/media";

export type PendingMedia = {
  id: string;
  url: string;
  resourceType: string;
  publicId: string | null;
  createdAt: string;
};

function contextProductId(context: unknown, metadata: unknown): string | null {
  const bags: unknown[] = [context, metadata];
  if (context && typeof context === "object" && "custom" in context) {
    bags.push((context as { custom: unknown }).custom);
  }
  for (const bag of bags) {
    if (!bag) continue;
    if (typeof bag === "string") {
      const match = bag.match(/(?:product_id|productId|saree_id)=([^|]+)/i);
      if (match?.[1]) return match[1].trim();
      continue;
    }
    if (typeof bag === "object") {
      const record = bag as Record<string, unknown>;
      const value = record.product_id ?? record.productId ?? record.saree_id;
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }
  return null;
}

export async function storeIncomingMedia(input: {
  url: string;
  resourceType?: string;
  publicId?: string | null;
  context?: unknown;
  metadata?: unknown;
}) {
  const url = input.url.trim();
  if (!url) return { stored: false as const };

  const resourceType = input.resourceType === "video" ? "video" : "image";
  const productId = contextProductId(input.context, input.metadata);

  if (productId) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (product) {
      const field = resourceType === "video" ? "videos" : "images";
      const list = parseMediaList(product[field]);
      if (!list.includes(url)) list.push(url);
      await prisma.product.update({
        where: { id: productId },
        data: { [field]: JSON.stringify(list) },
      });
      return { stored: true as const, assigned: true as const, productId };
    }
  }

  try {
    const existing = await prisma.mediaUpload.findFirst({ where: { url } });
    if (existing) return { stored: true as const, assigned: false as const, id: existing.id };

    const row = await prisma.mediaUpload.create({
      data: {
        url,
        resourceType,
        publicId: input.publicId ?? null,
        assigned: false,
      },
    });
    return { stored: true as const, assigned: false as const, id: row.id };
  } catch {
    return { stored: false as const };
  }
}

export async function getPendingMedia(): Promise<PendingMedia[]> {
  try {
    const rows = await prisma.mediaUpload.findMany({
      where: { assigned: false },
      orderBy: { createdAt: "desc" },
      take: 40,
    });
    return rows.map((row) => ({
      id: row.id,
      url: row.url,
      resourceType: row.resourceType,
      publicId: row.publicId,
      createdAt: row.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}
