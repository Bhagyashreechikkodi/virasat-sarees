import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { getReviewsForProduct } from "@/lib/reviews";
import { ProductDetail } from "./ProductDetail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const saree = await getProductById(id);
  if (!saree) notFound();
  const reviews = await getReviewsForProduct(id);
  return <ProductDetail saree={saree} reviews={reviews} />;
}
