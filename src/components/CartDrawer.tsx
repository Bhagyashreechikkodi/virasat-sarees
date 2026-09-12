"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import {
  FREE_SHIPPING_THRESHOLD,
  useCartStore,
} from "@/store/cartStore";
import { formatINR } from "@/data/sarees";
import {
  buildWhatsAppOrderMessage,
  formatPhoneDisplay,
  STORE_PHONES,
  telHref,
  whatsappHref,
} from "@/data/contact";
import { placeOrder } from "@/app/actions/orders";
import { useScrollLock } from "@/hooks/useScrollLock";

type ContactStep = "choose" | "whatsapp" | "call";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const [contactStep, setContactStep] = useState<ContactStep>("choose");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const subtotal = items.reduce(
    (sum, i) => sum + i.saree.price * i.quantity,
    0
  );
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const orderMessage = useMemo(() => {
    if (items.length === 0) return "";
    return buildWhatsAppOrderMessage(
      items.map((item) => ({
        name: item.saree.name,
        quantity: item.quantity,
        lineTotal: formatINR(item.saree.price * item.quantity),
      })),
      formatINR(subtotal),
      orderId ?? undefined
    );
  }, [items, subtotal, orderId]);

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) {
      setContactStep("choose");
      setOrderError(null);
    }
  }, [isOpen]);

  const persistOrder = async (channel: "whatsapp" | "call") => {
    if (orderId) return orderId;
    const phone = customerPhone.replace(/\D/g, "").slice(-10);
    if (phone.length !== 10) {
      setOrderError("Enter your 10-digit mobile number so we can save the order.");
      return null;
    }
    setSaving(true);
    setOrderError(null);
    const res = await placeOrder({
      phone,
      channel,
      subtotal,
      items: items.map((item) => ({
        productId: item.saree.id,
        name: item.saree.name,
        quantity: item.quantity,
        price: item.saree.price,
      })),
    });
    setSaving(false);
    if (!res.ok) {
      setOrderError(res.error);
      return "continue";
    }
    setOrderId(res.orderId);
    return res.orderId;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Close cart"
        onClick={closeCart}
      />
      <aside className="android-drawer absolute right-0 top-0 flex w-full max-w-md flex-col bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-burgundy" />
            <h2 className="font-serif text-2xl font-medium tracking-tight">Your bag</h2>
            <span className="text-sm text-muted">({items.length})</span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-11 w-11 items-center justify-center"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-border px-4 py-3">
          {remaining > 0 ? (
            <p className="text-xs text-muted">
              Add{" "}
              <span className="font-semibold text-burgundy">
                {formatINR(remaining)}
              </span>{" "}
              more for Free Express Delivery
            </p>
          ) : (
            <p className="text-xs font-medium text-success">
              Free Express Delivery unlocked!
            </p>
          )}
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
            <div
              className="h-full bg-burgundy transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShoppingBag className="h-10 w-10 text-muted/40" />
              <p className="text-sm text-muted">Your bag is empty</p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 h-11 bg-burgundy px-5 text-sm font-medium text-white"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li
                  key={`${item.saree.id}-${item.blouseOption}`}
                  className="flex gap-3"
                >
                  <Link
                    href={`/product/${item.saree.id}`}
                    onClick={closeCart}
                    className="relative h-24 w-[4.5rem] shrink-0 overflow-hidden bg-cream"
                  >
                    <Image
                      src={item.saree.images[0]}
                      alt={item.saree.name}
                      fill
                      className="object-cover"
                      sizes="72px"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link
                        href={`/product/${item.saree.id}`}
                        onClick={closeCart}
                        className="line-clamp-2 text-sm font-medium"
                      >
                        {item.saree.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.saree.id, item.blouseOption)
                        }
                        className="flex h-10 w-10 shrink-0 items-center justify-center text-muted"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted">
                      Blouse: Unstitched piece included
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          className="flex h-10 w-10 items-center justify-center"
                          onClick={() =>
                            updateQuantity(
                              item.saree.id,
                              item.blouseOption,
                              item.quantity - 1
                            )
                          }
                          aria-label="Decrease"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="flex h-10 w-10 items-center justify-center"
                          onClick={() =>
                            updateQuantity(
                              item.saree.id,
                              item.blouseOption,
                              item.quantity + 1
                            )
                          }
                          aria-label="Increase"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold">
                        {formatINR(item.saree.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-2.5 border-t border-border px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold">{formatINR(subtotal)}</span>
            </div>

            {contactStep === "choose" && (
              <>
                <p className="text-xs text-muted">
                  Place your order on WhatsApp or call us — we&apos;ll confirm
                  availability and payment. Your Order ID is saved for tracking.
                </p>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={customerPhone}
                  onChange={(e) =>
                    setCustomerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="Your 10-digit mobile number"
                  className="h-12 w-full border border-border px-3 text-sm outline-none"
                />
                {orderId && (
                  <p className="text-xs font-medium text-success">
                    Order saved as {orderId}. Use it on Track Order.
                  </p>
                )}
                {orderError && (
                  <p className="text-xs text-burgundy">{orderError}</p>
                )}
                <button
                  type="button"
                  disabled={saving}
                  onClick={async () => {
                    const id = await persistOrder("whatsapp");
                    if (id) setContactStep("whatsapp");
                  }}
                  className="flex h-12 w-full items-center justify-center gap-2 bg-[#25D366] text-sm font-semibold tracking-wide text-white disabled:opacity-60"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  {saving ? "SAVING ORDER…" : "ORDER ON WHATSAPP"}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={async () => {
                    const id = await persistOrder("call");
                    if (id) setContactStep("call");
                  }}
                  className="flex h-12 w-full items-center justify-center gap-2 bg-burgundy text-sm font-semibold tracking-wide text-white disabled:opacity-60"
                >
                  <Phone className="h-4 w-4" />
                  CALL TO ORDER
                </button>
                <button
                  type="button"
                  onClick={closeCart}
                  className="h-11 w-full border border-border text-sm font-medium tracking-wide text-charcoal"
                >
                  CONTINUE SHOPPING
                </button>
              </>
            )}

            {(contactStep === "whatsapp" || contactStep === "call") && (
              <>
                <button
                  type="button"
                  onClick={() => setContactStep("choose")}
                  className="flex items-center gap-1 text-xs font-medium text-muted"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
                <p className="text-sm font-semibold text-charcoal">
                  {contactStep === "whatsapp"
                    ? "Choose a WhatsApp number"
                    : "Choose a number to call"}
                </p>
                <p className="text-xs text-muted">Tap a number to connect.</p>
                <div className="grid gap-2">
                  {STORE_PHONES.map((phone) =>
                    contactStep === "whatsapp" ? (
                      <a
                        key={phone}
                        href={whatsappHref(orderMessage, phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 items-center justify-center gap-2 border border-[#25D366] bg-[#25D366]/10 text-sm font-semibold text-[#128C7E]"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        {formatPhoneDisplay(phone)}
                      </a>
                    ) : (
                      <a
                        key={phone}
                        href={telHref(phone)}
                        className="flex h-12 items-center justify-center gap-2 border border-burgundy bg-burgundy/5 text-sm font-semibold text-burgundy"
                      >
                        <Phone className="h-4 w-4" />
                        {formatPhoneDisplay(phone)}
                      </a>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
