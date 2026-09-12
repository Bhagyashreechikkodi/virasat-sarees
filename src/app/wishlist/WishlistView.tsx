"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { Saree } from "@/data/sarees";
import { ProductCard } from "@/components/ProductCard";
import { useWishlistStore } from "@/store/wishlistStore";

export function WishlistView({ products }: { products: Saree[] }) {
  const ids = useWishlistStore((s) => s.ids);
  const items = products.filter((s) => ids.includes(s.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav className="text-xs text-muted tracking-wide">
        <Link href="/" className="hover:text-burgundy">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-charcoal">Wishlist</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-charcoal sm:text-4xl">
            Your Favourites
          </h1>
          <p className="mt-1 text-sm text-muted">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <Link
          href="/sarees"
          className="text-xs font-semibold tracking-[0.14em] text-burgundy hover:underline"
        >
          CONTINUE SHOPPING
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center border border-dashed border-border bg-white py-20 text-center">
          <Heart className="h-10 w-10 text-muted/40" />
          <p className="mt-4 font-serif text-2xl text-charcoal">
            Your wishlist is empty
          </p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Tap the heart on any saree to save it here for later.
          </p>
          <Link
            href="/sarees"
            className="mt-6 bg-burgundy px-6 py-3 text-xs font-semibold tracking-[0.14em] text-white"
          >
            BROWSE SAREES
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
          {items.map((saree) => (
            <ProductCard key={saree.id} saree={saree} />
          ))}
        </div>
      )}
    </div>
  );
}
