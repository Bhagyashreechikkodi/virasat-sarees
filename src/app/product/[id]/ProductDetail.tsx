"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, MapPin, Star } from "lucide-react";
import { formatINR, type Saree } from "@/data/sarees";
import { RETURNS_POLICY_BODY } from "@/data/policies";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { ProductReviews } from "./ProductReviews";
import type { StoreReview } from "@/lib/reviews";
import { galleryImages, remoteUnoptimized } from "@/lib/media";

export function ProductDetail({
  saree,
  reviews,
}: {
  saree: Saree;
  reviews: StoreReview[];
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.ids.includes(saree.id));
  const photos = galleryImages(saree.images);

  const checkPincode = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryMsg("Please enter a valid 6-digit pincode.");
      return;
    }
    setDeliveryMsg(
      `Estimated delivery to ${pincode}: ${new Date(
        Date.now() + 4 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })}`
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted">
        <Link href="/" className="hover:text-burgundy transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/collections" className="hover:text-burgundy transition-colors">
          Collections
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/sarees" className="hover:text-burgundy transition-colors">
          Sarees
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-charcoal line-clamp-1">{saree.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <div
            className="relative aspect-[2/3] overflow-hidden bg-[#ebe4da]"
            onTouchStart={(e) => {
              touchStartX.current = e.changedTouches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current == null || photos.length < 2) {
                touchStartX.current = null;
                return;
              }
              const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
              if (Math.abs(dx) > 40) {
                setActiveImage((i) =>
                  dx < 0
                    ? (i + 1) % photos.length
                    : (i - 1 + photos.length) % photos.length
                );
              }
              touchStartX.current = null;
            }}
          >
            <Image
              src={photos[activeImage]}
              alt={saree.name}
              fill
              priority
              unoptimized={remoteUnoptimized(photos[activeImage])}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() =>
                    setActiveImage((i) => (i - 1 + photos.length) % photos.length)
                  }
                  className="icon-on-photo tap-sm pointer-events-auto absolute left-0 top-1/2 z-10 flex h-10 w-10 min-h-0 -translate-y-1/2 items-center justify-center text-charcoal"
                >
                  <ChevronLeft className="h-6 w-6" strokeWidth={2.25} />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => setActiveImage((i) => (i + 1) % photos.length)}
                  className="icon-on-photo tap-sm pointer-events-auto absolute right-0 top-1/2 z-10 flex h-10 w-10 min-h-0 -translate-y-1/2 items-center justify-center text-charcoal"
                >
                  <ChevronRight className="h-6 w-6" strokeWidth={2.25} />
                </button>
              </>
            )}
          </div>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            {photos.map((img, i) => (
              <button
                key={`${img}-${i}`}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`relative h-24 w-16 shrink-0 overflow-hidden border-2 ${
                  activeImage === i ? "border-burgundy" : "border-transparent"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  unoptimized={remoteUnoptimized(img)}
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
          {(saree.videos ?? []).length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Videos
              </p>
              {(saree.videos ?? []).map((src, i) => (
                <video
                  key={`${src}-${i}`}
                  src={src}
                  controls
                  playsInline
                  className="w-full bg-black"
                  preload="metadata"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-light uppercase tracking-[0.2em] text-muted">
            {saree.fabric} · {saree.occasion}
          </p>
          <h1 className="mt-2 font-serif text-3xl leading-tight text-charcoal sm:text-4xl">
            {saree.name}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 fill-rose text-rose" />
            <span className="font-medium">{saree.rating}</span>
            <span className="text-muted">({saree.reviewCount} reviews)</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-semibold">{formatINR(saree.price)}</span>
            <span className="text-muted line-through">
              {formatINR(saree.originalPrice)}
            </span>
            <span className="rounded bg-success/10 px-2.5 py-1 text-sm font-semibold text-success">
              {saree.discountPercent}% OFF
            </span>
          </div>

          <p className="mt-5 font-sans text-sm font-light leading-relaxed text-charcoal/80">
            {saree.description}
          </p>

          <div className="mt-6 border border-border bg-paper p-4 text-sm font-light space-y-1">
            <p>
              <span className="font-medium">Fabric composition:</span>{" "}
              {saree.fabric} with {saree.workType.toLowerCase()} detailing
            </p>
            <p>
              <span className="font-medium">Care instructions:</span> {saree.care}
            </p>
            <p>
              <span className="font-medium">Color:</span> {saree.color}
            </p>
          </div>

          <div className="mt-6 border border-border bg-paper px-4 py-3 text-sm">
            <span className="font-medium text-charcoal">Blouse:</span>{" "}
            Unstitched blouse piece included
          </div>

          <div className="mt-4 border border-burgundy/15 bg-burgundy/5 px-4 py-3 text-sm">
            <p className="font-semibold text-charcoal">Returns & exchanges — 7 days</p>
            <p className="mt-1 font-light leading-relaxed text-muted">
              {RETURNS_POLICY_BODY}
            </p>
          </div>

          <div className="mt-6">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-burgundy" />
              Enter pincode to check delivery date
            </p>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit pincode"
                className="flex-1 border border-border bg-paper px-3 py-2.5 text-sm outline-none focus:border-burgundy"
              />
              <button
                type="button"
                onClick={checkPincode}
                className="rounded-md border border-burgundy px-4 py-2.5 text-sm font-medium text-burgundy hover:bg-burgundy hover:text-white"
              >
                Check
              </button>
            </div>
            {deliveryMsg && (
              <p className="mt-2 text-xs text-muted">{deliveryMsg}</p>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 pb-24 sm:flex-row sm:pb-0">
            <button
              type="button"
              onClick={() => addItem(saree)}
              className="flex-1 min-h-11 rounded-md bg-burgundy py-3.5 text-sm font-semibold tracking-wide text-white hover:bg-burgundy/90"
            >
              ADD TO BAG
            </button>
            <button
              type="button"
              onClick={() => addItem(saree)}
              className="flex-1 min-h-11 rounded-md border border-burgundy py-3.5 text-sm font-semibold tracking-wide text-burgundy hover:bg-cream"
            >
              BUY IT NOW
            </button>
          </div>
          <button
            type="button"
            onClick={() => toggleWishlist(saree.id)}
            className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted active:text-burgundy"
          >
            <Heart
              className={`h-4 w-4 ${wished ? "fill-burgundy text-burgundy" : ""}`}
            />
            {wished ? "Saved to Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border bg-white px-3 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-pb sm:hidden">
        <button
          type="button"
          onClick={() => toggleWishlist(saree.id)}
          className="inline-flex min-h-12 min-w-12 items-center justify-center border border-border text-burgundy active:bg-cream"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-5 w-5 ${wished ? "fill-burgundy text-burgundy" : ""}`}
          />
        </button>
        <button
          type="button"
          onClick={() => addItem(saree)}
          className="min-h-12 flex-1 bg-burgundy text-xs font-semibold tracking-wide text-white active:bg-burgundy/90"
        >
          ADD TO BAG
        </button>
      </div>

      <ProductReviews productId={saree.id} reviews={reviews} />
    </div>
  );
}
