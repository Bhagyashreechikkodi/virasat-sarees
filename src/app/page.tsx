import { HomeHero } from "@/components/home/HomeHero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FestiveLooks } from "@/components/home/FestiveLooks";
import { ShopByCollections } from "@/components/home/ShopByCollections";
import { ShopByOccasion } from "@/components/home/ShopByOccasion";
import { VisitStores } from "@/components/home/VisitStores";
import { TrustStrip } from "@/components/home/TrustStrip";
import { getProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await getProducts();
  return (
    <>
      <HomeHero />
      <FeaturedCategories />
      <FestiveLooks products={products} />
      <ShopByCollections />
      <ShopByOccasion />
      <VisitStores />
      <TrustStrip />
    </>
  );
}
