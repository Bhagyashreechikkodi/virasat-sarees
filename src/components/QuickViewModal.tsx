"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatINR, type Saree } from "@/data/sarees";
import { galleryImages, remoteUnoptimized } from "@/lib/media";
import { useCartStore } from "@/store/cartStore";

import { useScrollLock } from "@/hooks/useScrollLock";

interface QuickViewModalProps {
  saree: Saree | null;
  onClose: () => void;
}

export function QuickViewModal({ saree, onClose }: QuickViewModalProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const touchStartX = useRef<number | null>(null);

  useScrollLock(!!saree);

  useEffect(() => {
    if (!saree) return;
    setActiveImage(0);
    setPincode("");
    setDeliveryMsg(null);
  }, [saree]);

  if (!saree) return null;
  const photos = galleryImages(saree.images);

  const checkPincode = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setDeliveryMsg("Please enter a valid 6-digit pincode.");
      return;
    }
    setDeliveryMsg(
      `Delivering to ${pincode} by ${new Date(
        Date.now() + 4 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })}`
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close quick view"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex max-h-[100dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[92dvh] sm:rounded-lg md:flex-row"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative w-full bg-cream md:w-1/2">
          <div
            className="relative aspect-[4/3] w-full md:aspect-[3/4]"
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
              unoptimized={remoteUnoptimized(photos[activeImage] ?? "")}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() =>
                    setActiveImage((i) => (i - 1 + photos.length) % photos.length)
                  }
                  className="icon-on-photo tap-sm pointer-events-auto absolute left-0 top-1/2 z-10 flex h-10 w-8 min-h-0 -translate-y-1/2 items-center justify-center text-charcoal"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => setActiveImage((i) => (i + 1) % photos.length)}
                  className="icon-on-photo tap-sm pointer-events-auto absolute right-0 top-1/2 z-10 flex h-10 w-8 min-h-0 -translate-y-1/2 items-center justify-center text-charcoal"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
                </button>
              </>
            )}
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto p-3">
            {photos.map((img, i) => (
              <button
                key={`${img}-${i}`}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`relative h-14 w-11 shrink-0 overflow-hidden border-2 ${
                  activeImage === i ? "border-burgundy" : "border-transparent"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  unoptimized={remoteUnoptimized(img)}
                  className="object-cover"
                  sizes="44px"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col overflow-y-auto p-4 sm:p-6 md:w-1/2">
          <p className="text-xs uppercase tracking-wider text-muted">
            {saree.fabric} · {saree.workType}
          </p>
          <h2 className="mt-1 font-serif text-2xl text-charcoal sm:text-3xl">
            {saree.name}
          </h2>
          <div className="mt-2 flex items-center gap-1.5 text-sm">
            <Star className="h-4 w-4 fill-gold text-gold" />
            <span className="font-medium">{saree.rating}</span>
            <span className="text-muted">({saree.reviewCount} reviews)</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xl font-semibold">{formatINR(saree.price)}</span>
            <span className="text-sm text-muted line-through">
              {formatINR(saree.originalPrice)}
            </span>
            <span className="rounded bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
              {saree.discountPercent}% OFF
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted">
            {saree.description}
          </p>

          <p className="mt-4 rounded border border-border bg-cream/60 px-3 py-2.5 text-sm">
            <span className="font-medium">Blouse:</span> Unstitched blouse piece
            included · Care: {saree.care}
          </p>

          <div className="mt-5">
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-burgundy" />
              Check Delivery
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                className="h-11 flex-1 border border-border px-3 text-sm outline-none focus:border-burgundy"
              />
              <button
                type="button"
                onClick={checkPincode}
                className="h-11 border border-burgundy px-4 text-sm font-medium text-burgundy"
              >
                Check
              </button>
            </div>
            {deliveryMsg && (
              <p className="mt-2 text-xs text-muted">{deliveryMsg}</p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:flex-row">
            <button
              type="button"
              onClick={() => {
                addItem(saree);
                onClose();
              }}
              className="h-12 flex-1 bg-burgundy text-sm font-semibold tracking-wide text-white"
            >
              ADD TO BAG
            </button>
            <button
              type="button"
              onClick={() => {
                addItem(saree);
                onClose();
              }}
              className="h-12 flex-1 border border-burgundy text-sm font-semibold tracking-wide text-burgundy"
            >
              BUY IT NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
