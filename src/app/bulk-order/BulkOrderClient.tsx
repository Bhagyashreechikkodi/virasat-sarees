"use client";

import { FormEvent, useState } from "react";
import { submitBulkInquiry } from "@/app/actions/inquiries";

const PRODUCT_OPTIONS = [
  "Kanjeevaram Silk Sarees",
  "Banarasi Sarees",
  "Organza / Chiffon / Georgette",
  "Wedding & Bridal edit",
  "Festive collection",
  "Mixed catalogue / other",
];

export function BulkOrderClient() {
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    const form = e.currentTarget;
    const res = await submitBulkInquiry(new FormData(form));
    setLoading(false);
    if (!res.ok) {
      setStatus("error");
      setError(res.error);
      return;
    }
    setStatus("ok");
    setError(null);
    form.reset();
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:py-20">
      <h1 className="text-center text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
        B2B Query Form
      </h1>
      <p className="mt-2 text-center text-sm text-muted">
        Fill the form to inquiry
      </p>

      <form onSubmit={onSubmit} className="mt-10 space-y-4">
        <input
          name="fullName"
          required
          placeholder="Full Name"
          className="h-12 w-full rounded-full border border-border bg-paper px-5 text-sm outline-none focus:border-burgundy"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email Id"
          className="h-12 w-full rounded-full border border-border bg-paper px-5 text-sm outline-none focus:border-burgundy"
        />
        <div className="flex h-12 overflow-hidden rounded-full border border-border bg-paper">
          <span className="flex items-center gap-1.5 px-4 text-sm text-muted">
            +91
          </span>
          <input
            name="phone"
            type="tel"
            inputMode="numeric"
            required
            placeholder="Phone Number"
            className="min-w-0 flex-1 bg-transparent pr-5 text-sm outline-none"
          />
        </div>
        <input
          name="businessName"
          required
          placeholder="Business Name"
          className="h-12 w-full rounded-full border border-border bg-paper px-5 text-sm outline-none focus:border-burgundy"
        />
        <select
          name="productsInterested"
          required
          defaultValue=""
          className="h-12 w-full rounded-full border border-border bg-paper px-5 text-sm outline-none focus:border-burgundy"
        >
          <option value="" disabled>
            Products Interested In
          </option>
          {PRODUCT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          name="estimatedQuantity"
          placeholder="Estimated Quantity needed"
          className="h-12 w-full rounded-full border border-border bg-paper px-5 text-sm outline-none focus:border-burgundy"
        />
        <textarea
          name="comments"
          rows={3}
          placeholder="Additional Requests or Comments"
          className="w-full rounded-[1.5rem] border border-border bg-paper px-5 py-3 text-sm outline-none focus:border-burgundy"
        />
        {error && (
          <p className="text-center text-sm text-burgundy" role="alert">
            {error}
          </p>
        )}
        {status === "ok" && (
          <p className="text-center text-sm text-success">
            Thank you. We will contact you shortly about your bulk enquiry.
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mx-auto flex h-12 w-48 items-center justify-center rounded-full bg-charcoal text-sm font-semibold tracking-wide text-white disabled:opacity-60"
        >
          {loading ? "Submitting…" : "Submit"}
        </button>
      </form>
    </div>
  );
}
