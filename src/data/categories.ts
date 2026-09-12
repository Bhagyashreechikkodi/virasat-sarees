export const PRODUCT_CATEGORIES = [
  "Sarees",
  "Petticoats",
  "Blouse (Unstitched)",
  "Ready to Ship",
  "Sale",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const CATEGORY_SLUGS: Record<string, ProductCategory> = {
  sarees: "Sarees",
  petticoats: "Petticoats",
  blouse: "Blouse (Unstitched)",
  "blouse-unstitched": "Blouse (Unstitched)",
  "ready-to-ship": "Ready to Ship",
  ready: "Ready to Ship",
  sale: "Sale",
};

export function isProductCategory(value: string): value is ProductCategory {
  return (PRODUCT_CATEGORIES as readonly string[]).includes(value);
}

export function resolveCategory(
  raw: string | null | undefined,
): ProductCategory | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (isProductCategory(trimmed)) return trimmed;
  const slug = trimmed.toLowerCase().replace(/\s+/g, "-");
  return CATEGORY_SLUGS[slug];
}
