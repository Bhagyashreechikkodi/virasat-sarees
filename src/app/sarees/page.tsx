import { Suspense } from "react";
import { getProducts } from "@/lib/products";
import { SareesCollection } from "./SareesCollection";

export const metadata = {
  title: "Sarees for Women | Virasat Sarees",
  description:
    "Shop Kanjeevaram, Banarasi, Organza, Chiffon & more luxury sarees. Free shipping over ₹600. Order via WhatsApp or call.",
};

export default async function SareesPage() {
  const products = await getProducts();
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted">
          Loading collection…
        </div>
      }
    >
      <SareesCollection products={products} />
    </Suspense>
  );
}
