import { getProducts } from "@/lib/products";
import { WishlistView } from "./WishlistView";

export default async function WishlistPage() {
  const products = await getProducts();
  return <WishlistView products={products} />;
}
