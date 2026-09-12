"use client";

import { FormEvent, useState } from "react";
import { Hash, Phone } from "lucide-react";
import { trackOrder } from "@/app/actions/orders";
import { STORE_ADDRESS, STORE_PHONES, formatPhoneDisplay } from "@/data/contact";
import { formatINR } from "@/data/sarees";
import { ORDER_STATUSES } from "@/lib/order-status";

type Tracked = {
  orderId: string;
  status: string;
  createdAt: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
};

export function TrackOrderClient() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Tracked | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const res = await trackOrder(orderId, phone);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setResult(res.order);
  };

  return (
    <div className="min-h-[70vh] bg-[#f5f5f5]">
      <div className="bg-charcoal px-4 py-2.5 text-center text-[11px] leading-relaxed tracking-wide text-white sm:text-xs">
        Any caller or message asking for advance or extra payment is a fraudulent
        request and should not be entertained.
      </div>

      <div className="mx-auto max-w-xl px-4 py-14 sm:py-20">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
          Track Your Order
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          Enter your order details to track your order
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-3">
          <div className="flex overflow-hidden rounded-none border border-border bg-paper">
            <span className="flex w-12 items-center justify-center bg-burgundy text-white">
              <Hash className="h-4 w-4" />
            </span>
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value.toUpperCase())}
              placeholder="Enter Order ID"
              className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
              required
            />
          </div>
          <div className="flex overflow-hidden border border-border bg-paper">
            <span className="flex w-12 items-center justify-center bg-burgundy text-white">
              <Phone className="h-4 w-4" />
            </span>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="Enter Mobile"
              className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-burgundy" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full bg-burgundy text-sm font-semibold tracking-wide text-white disabled:opacity-60"
          >
            {loading ? "Tracking…" : "Track Your Order"}
          </button>
        </form>

        {result && (
          <div className="mt-8 border border-border bg-paper p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {result.orderId}
            </p>
            <p className="mt-1 font-serif text-2xl text-charcoal">{result.status}</p>
            <ol className="mt-4 flex flex-wrap gap-2">
              {ORDER_STATUSES.map((status) => (
                <li
                  key={status}
                  className={`px-2.5 py-1 text-[11px] uppercase tracking-wide ${
                    status === result.status
                      ? "bg-burgundy text-white"
                      : "bg-cream text-muted"
                  }`}
                >
                  {status}
                </li>
              ))}
            </ol>
            <ul className="mt-4 space-y-2 text-sm">
              {result.items.map((item) => (
                <li key={item.name} className="flex justify-between gap-3">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{formatINR(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-right text-sm font-semibold">
              Subtotal {formatINR(result.subtotal)}
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-border bg-[#f8e8ef] px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 text-sm text-charcoal sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            {STORE_PHONES.map((p) => (
              <p key={p}>
                <a href={`tel:+91${p}`} className="hover:text-burgundy">
                  +91 {formatPhoneDisplay(p).replace("+91 ", "")}
                </a>
              </p>
            ))}
            <p className="text-muted">{STORE_ADDRESS.short}</p>
          </div>
          <a
            href={STORE_ADDRESS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-burgundy hover:underline"
          >
            Open store on Maps
          </a>
        </div>
      </div>
    </div>
  );
}
