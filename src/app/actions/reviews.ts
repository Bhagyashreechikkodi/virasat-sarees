"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthed } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { ensureDefaultReviews, syncProductRating } from "@/lib/reviews";

function parseRating(value: unknown) {
  const rating = Number(value);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return null;
  return rating;
}

async function revalidateReviews(productId: string | null) {
  revalidatePath("/");
  revalidatePath("/sarees");
  revalidatePath("/admin");
  if (productId) revalidatePath(`/product/${productId}`);
}

export async function addAdminReview(input: {
  productId: string;
  author: string;
  text: string;
  rating: number;
}) {
  if (!(await isAdminAuthed())) {
    return { ok: false as const, error: "Unauthorized." };
  }
  const productId = input.productId.trim();
  const author = input.author.trim();
  const text = input.text.trim();
  const rating = parseRating(input.rating);
  if (!productId) return { ok: false as const, error: "Choose a product." };
  if (!author) return { ok: false as const, error: "Name is required." };
  if (!text) return { ok: false as const, error: "Comment is required." };
  if (!rating) return { ok: false as const, error: "Rating must be 1–5." };

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return { ok: false as const, error: "Product not found." };

  await prisma.review.create({
    data: { productId, author, text, rating, source: "admin" },
  });
  await syncProductRating(productId);
  await revalidateReviews(productId);
  return { ok: true as const };
}

export async function addCustomerReview(input: {
  productId: string;
  author: string;
  text: string;
  rating: number;
}) {
  const productId = input.productId.trim();
  const author = input.author.trim();
  const text = input.text.trim();
  const rating = parseRating(input.rating);
  if (!productId) return { ok: false as const, error: "Missing product." };
  if (author.length < 2) return { ok: false as const, error: "Please enter your name." };
  if (text.length < 8) return { ok: false as const, error: "Please write a short comment." };
  if (!rating) return { ok: false as const, error: "Choose a rating from 1 to 5." };

  try {
    await ensureDefaultReviews();
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return { ok: false as const, error: "Product not found." };

    await prisma.review.create({
      data: { productId, author, text, rating, source: "customer" },
    });
    await syncProductRating(productId);
    await revalidateReviews(productId);
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Could not save the review. Try again." };
  }
}
