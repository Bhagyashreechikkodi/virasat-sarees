import type { BlouseOption, Fabric, Occasion, Saree, WorkType } from "@/data/sarees";
import { sarees } from "@/data/sarees";
import { galleryImages, parseMediaList } from "@/lib/media";
import { prisma } from "@/lib/prisma";
import {
  ensureDefaultReviews,
  ratingFromReviews,
} from "@/lib/reviews";

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function discountFromPrices(price: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function withCatalogDefaults(saree: Omit<Saree, "videos" | "category"> & {
  videos?: string[];
  category?: string;
}): Saree {
  return {
    ...saree,
    videos: saree.videos ?? [],
    category: saree.category ?? "Sarees",
  };
}

export function rowToSaree(row: {
  id: string;
  name: string;
  description: string;
  fabric: string;
  color: string;
  colorHex: string;
  occasion: string;
  workType: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  isBestseller: boolean;
  isNew: boolean;
  readyToShip: boolean;
  images: string;
  videos?: string | null;
  category?: string | null;
  blouseOptions: string;
  care: string;
}): Saree {
  const images = galleryImages(parseMediaList(row.images));
  const videos = parseMediaList(row.videos ?? "[]");
  const blouse = parseJsonArray(row.blouseOptions) as BlouseOption[];
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    fabric: row.fabric as Fabric,
    color: row.color,
    colorHex: row.colorHex,
    occasion: row.occasion as Occasion,
    workType: row.workType as WorkType,
    price: row.price,
    originalPrice: row.originalPrice,
    discountPercent: row.discountPercent || discountFromPrices(row.price, row.originalPrice),
    rating: row.rating,
    reviewCount: row.reviewCount,
    isBestseller: row.isBestseller,
    isNew: row.isNew,
    readyToShip: row.readyToShip,
    images: images.length ? images : ["/icons/icon-192.png"],
    videos,
    category: row.category?.trim() || "Sarees",
    blouseOptions: blouse.length ? blouse : ["Unstitched"],
    care: row.care,
  };
}

function catalogFallback(): Saree[] {
  return sarees.map((saree) => withCatalogDefaults(saree));
}

async function seedIfEmpty() {
  const count = await prisma.product.count();
  if (count > 0) return;
  await prisma.product.createMany({
    data: sarees.map((saree) => ({
      id: saree.id,
      name: saree.name,
      description: saree.description,
      fabric: saree.fabric,
      color: saree.color,
      colorHex: saree.colorHex,
      occasion: saree.occasion,
      workType: saree.workType,
      price: saree.price,
      originalPrice: saree.originalPrice,
      discountPercent: saree.discountPercent,
      rating: saree.rating,
      reviewCount: saree.reviewCount,
      isBestseller: saree.isBestseller,
      isNew: saree.isNew,
      readyToShip: saree.readyToShip,
      images: JSON.stringify(saree.images),
      videos: JSON.stringify(saree.videos ?? []),
      category: saree.category ?? "Sarees",
      blouseOptions: JSON.stringify(saree.blouseOptions),
      care: saree.care,
    })),
  });
}

async function applyReviewStats(products: Saree[]): Promise<Saree[]> {
  try {
    await ensureDefaultReviews();
    const rows = await prisma.review.findMany({
      select: { productId: true, rating: true },
    });
    const byProduct = new Map<string, number[]>();
    const defaults: number[] = [];
    for (const row of rows) {
      if (!row.productId) {
        defaults.push(row.rating);
        continue;
      }
      const list = byProduct.get(row.productId) ?? [];
      list.push(row.rating);
      byProduct.set(row.productId, list);
    }
    return products.map((product) => {
      const own = byProduct.get(product.id);
      const stats = ratingFromReviews(
        (own?.length ? own : defaults).map((rating) => ({ rating })),
      );
      return { ...product, rating: stats.rating, reviewCount: stats.reviewCount };
    });
  } catch {
    return products;
  }
}

export async function getProducts(): Promise<Saree[]> {
  try {
    await seedIfEmpty();
    const rows = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (rows.length) return applyReviewStats(rows.map(rowToSaree));
  } catch {
    // Keep the storefront working if the database is unavailable.
  }
  return catalogFallback();
}

export async function getProductById(id: string): Promise<Saree | undefined> {
  try {
    const row = await prisma.product.findUnique({ where: { id } });
    if (row) {
      const [product] = await applyReviewStats([rowToSaree(row)]);
      return product;
    }
  } catch {
    // fall through
  }
  return catalogFallback().find((s) => s.id === id);
}

export { discountFromPrices };
