import { DEFAULT_CUSTOMER_REVIEWS } from "@/data/default-reviews";
import { prisma } from "@/lib/prisma";

export type StoreReview = {
  id: string;
  productId: string | null;
  author: string;
  text: string;
  rating: number;
  source: "admin" | "customer";
  createdAt: string;
};

function toStoreReview(row: {
  id: string;
  productId: string | null;
  author: string;
  text: string;
  rating: number;
  source: string;
  createdAt: Date;
}): StoreReview {
  return {
    id: row.id,
    productId: row.productId,
    author: row.author,
    text: row.text,
    rating: row.rating,
    source: row.source === "admin" ? "admin" : "customer",
    createdAt: row.createdAt.toISOString(),
  };
}

export function ratingFromReviews(reviews: { rating: number }[]): {
  rating: number;
  reviewCount: number;
} {
  if (!reviews.length) return { rating: 0, reviewCount: 0 };
  const sum = reviews.reduce((n, r) => n + r.rating, 0);
  return {
    rating: Math.round((sum / reviews.length) * 10) / 10,
    reviewCount: reviews.length,
  };
}

export async function ensureDefaultReviews() {
  const count = await prisma.review.count();
  if (count > 0) return;
  await prisma.review.createMany({
    data: DEFAULT_CUSTOMER_REVIEWS.map((review) => ({
      productId: null,
      author: review.author,
      text: review.text,
      rating: review.rating,
      source: "customer",
    })),
  });
}

export async function getSiteDefaultReviews(): Promise<StoreReview[]> {
  try {
    await ensureDefaultReviews();
    const rows = await prisma.review.findMany({
      where: { productId: null },
      orderBy: { createdAt: "asc" },
    });
    if (rows.length) return rows.map(toStoreReview);
  } catch {
    // fall through
  }
  return DEFAULT_CUSTOMER_REVIEWS.map((review, i) => ({
    id: `default-${i}`,
    productId: null,
    author: review.author,
    text: review.text,
    rating: review.rating,
    source: "customer" as const,
    createdAt: new Date().toISOString(),
  }));
}

export async function getReviewsForProduct(productId: string): Promise<StoreReview[]> {
  try {
    await ensureDefaultReviews();
    const own = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });
    if (own.length) return own.map(toStoreReview);
  } catch {
    // fall through to defaults
  }
  return getSiteDefaultReviews();
}

export async function getHomeReviews(limit = 8): Promise<StoreReview[]> {
  try {
    await ensureDefaultReviews();
    const rows = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    if (rows.length) return rows.map(toStoreReview);
  } catch {
    // fall through
  }
  return getSiteDefaultReviews();
}

export async function getAllReviews(): Promise<StoreReview[]> {
  try {
    await ensureDefaultReviews();
    const rows = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toStoreReview);
  } catch {
    return [];
  }
}

export async function syncProductRating(productId: string) {
  const rows = await prisma.review.findMany({
    where: { productId },
    select: { rating: true },
  });
  const stats = rows.length
    ? ratingFromReviews(rows)
    : ratingFromReviews(await getSiteDefaultReviews());
  await prisma.product.update({
    where: { id: productId },
    data: { rating: stats.rating, reviewCount: stats.reviewCount },
  });
}
