"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { formatINR, type Saree } from "@/data/sarees";
import { galleryImages, remoteUnoptimized } from "@/lib/media";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface ProductCardProps {
  saree: Saree;
  onQuickView?: (saree: Saree) => void;
}

export function ProductCard({ saree, onQuickView }: ProductCardProps) {
  const [imgIndex, setImgIndex] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.ids.includes(saree.id));
  const gallery = galleryImages(saree.images);
  const canSlide = gallery.length > 1;
  const touchStartX = useRef<number | null>(null);
  const touchOnControl = useRef(false);
  const didSwipe = useRef(false);

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + gallery.length) % gallery.length);
  };

  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % gallery.length);
  };

  return (
    <article className="flex flex-col">
      <div
        className="group relative aspect-[2/3] overflow-hidden bg-[#f0ebe4]"
        onTouchStart={(e) => {
          const target = e.target as HTMLElement;
          touchOnControl.current = !!target.closest("button");
          touchStartX.current = e.changedTouches[0]?.clientX ?? null;
          didSwipe.current = false;
        }}
        onTouchEnd={(e) => {
          if (touchOnControl.current || touchStartX.current == null || !canSlide) {
            touchStartX.current = null;
            return;
          }
          const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
          if (Math.abs(dx) > 40) {
            didSwipe.current = true;
            setImgIndex((i) =>
              dx < 0
                ? (i + 1) % gallery.length
                : (i - 1 + gallery.length) % gallery.length
            );
          }
          touchStartX.current = null;
        }}
      >
        <Link
          href={`/product/${saree.id}`}
          className="absolute inset-0 block overflow-hidden"
          onClick={(e) => {
            if (didSwipe.current) {
              e.preventDefault();
              didSwipe.current = false;
            }
          }}
        >
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{
              width: `${gallery.length * 100}%`,
              transform: `translateX(-${(imgIndex * 100) / gallery.length}%)`,
            }}
          >
            {gallery.map((src, i) => (
              <div
                key={`${saree.id}-${i}`}
                className="relative h-full shrink-0"
                style={{ width: `${100 / gallery.length}%` }}
              >
                <Image
                  src={src}
                  alt={i === 0 ? saree.name : ""}
                  fill
                  unoptimized={remoteUnoptimized(src)}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Link>

        {canSlide && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="icon-on-photo tap-sm pointer-events-auto absolute left-0 top-1/2 z-30 flex h-10 w-8 min-h-0 -translate-y-1/2 items-center justify-center text-charcoal sm:w-10"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="icon-on-photo tap-sm pointer-events-auto absolute right-0 top-1/2 z-30 flex h-10 w-8 min-h-0 -translate-y-1/2 items-center justify-center text-charcoal sm:w-10"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
            </button>
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {gallery.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 w-1 rounded-full ${
                    i === imgIndex ? "bg-paper" : "bg-white/45"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="pointer-events-none absolute left-0 top-2.5 z-10 flex flex-col gap-1">
          {saree.isBestseller && (
            <span className="w-fit bg-burgundy px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
              Bestseller
            </span>
          )}
          {saree.discountPercent >= 20 && (
            <span className="w-fit bg-paper px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-rose">
              {saree.discountPercent}% off
            </span>
          )}
        </div>

        <button
          type="button"
          className="icon-on-photo tap-sm absolute right-1 top-1 z-20 flex h-10 w-10 min-h-0 items-center justify-center"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(saree.id)}
        >
          <Heart
            className={`h-5 w-5 ${
              wished ? "fill-burgundy text-burgundy" : "text-charcoal"
            }`}
            strokeWidth={2}
          />
        </button>
      </div>

      <div className="mt-2.5 flex flex-1 flex-col gap-0.5">
        <Link
          href={`/product/${saree.id}`}
          className="line-clamp-2 font-sans text-[13px] font-light leading-snug text-charcoal hover:text-burgundy sm:text-sm"
        >
          {saree.name}
        </Link>
        <p className="text-[11px] text-muted">{saree.fabric}</p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm font-semibold text-charcoal">
            {formatINR(saree.price)}
          </span>
          <span className="text-xs text-muted line-through">
            {formatINR(saree.originalPrice)}
          </span>
          <span className="text-xs font-semibold text-rose">
            {saree.discountPercent}% off
          </span>
        </div>
        {saree.reviewCount > 0 && (
          <p className="text-[11px] text-muted">
            {saree.reviewCount} {saree.reviewCount === 1 ? "review" : "reviews"}
          </p>
        )}

        <div className="mt-2.5 flex gap-2">
          <button
            type="button"
            onClick={() => addItem(saree)}
            className="flex h-10 flex-1 items-center justify-center border border-charcoal bg-paper text-[11px] font-semibold uppercase tracking-[0.1em] text-charcoal active:bg-cream"
          >
            Add to bag
          </button>
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(saree)}
              className="hidden h-10 border border-border bg-paper px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-charcoal sm:inline-flex sm:items-center"
            >
              View
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
