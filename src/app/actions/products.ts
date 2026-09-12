"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin";
import { discountFromPrices } from "@/lib/products";
import { galleryImages, parseMediaList } from "@/lib/media";
import { isProductCategory } from "@/data/categories";
import { FABRICS, OCCASIONS, WORK_TYPES } from "@/data/sarees";

function slugId(name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
  const suffix = Math.floor(100 + Math.random() * 900);
  return `rs-${base || "saree"}-${suffix}`;
}

export type ProductInput = {
  id?: string;
  name: string;
  description: string;
  fabric: string;
  color: string;
  colorHex: string;
  occasion: string;
  workType: string;
  category: string;
  price: number;
  originalPrice: number;
  images: string;
  videos: string;
  isBestseller: boolean;
  isNew: boolean;
  readyToShip: boolean;
  care: string;
};

export async function upsertProduct(input: ProductInput) {
  if (!(await isAdminAuthed())) {
    return { ok: false as const, error: "Unauthorized." };
  }
  const name = input.name.trim();
  if (!name) return { ok: false as const, error: "Name is required." };
  const images = galleryImages(parseMediaList(input.images));
  if (!images.length) return { ok: false as const, error: "Add at least one image URL or upload." };
  const videos = parseMediaList(input.videos ?? "");
  const category = isProductCategory(input.category) ? input.category : "Sarees";

  const price = Number(input.price);
  const originalPrice = Number(input.originalPrice) || price;
  const id = input.id?.trim() || slugId(name);
  const readyToShip = category === "Ready to Ship" ? true : input.readyToShip;

  const data = {
    name,
    description: input.description.trim(),
    fabric: (FABRICS as string[]).includes(input.fabric) ? input.fabric : "Kanjeevaram Silk",
    color: input.color.trim() || "Maroon",
    colorHex: input.colorHex.trim() || "#800020",
    occasion: (OCCASIONS as string[]).includes(input.occasion) ? input.occasion : "Festive",
    workType: (WORK_TYPES as string[]).includes(input.workType) ? input.workType : "Zari",
    category,
    price,
    originalPrice,
    discountPercent: discountFromPrices(price, originalPrice),
    isBestseller: input.isBestseller,
    isNew: input.isNew,
    readyToShip,
    images: JSON.stringify(images),
    videos: JSON.stringify(videos),
    blouseOptions: JSON.stringify(["Unstitched"]),
    care: input.care.trim() || "Dry Clean Only",
  };

  await prisma.product.upsert({
    where: { id },
    create: { id, rating: 0, reviewCount: 0, ...data },
    update: data,
  });

  revalidatePath("/");
  revalidatePath("/sarees");
  revalidatePath(`/product/${id}`);
  revalidatePath("/admin");
  return { ok: true as const, id };
}
