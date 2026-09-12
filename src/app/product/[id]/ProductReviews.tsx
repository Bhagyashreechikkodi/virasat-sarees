"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { addCustomerReview } from "@/app/actions/reviews";
import type { StoreReview } from "@/lib/reviews";
import { useAuthStore } from "@/store/authStore";

export function ProductReviews({
  productId,
  reviews,
}: {
  productId: string;
  reviews: StoreReview[];
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [author, setAuthor] = useState(user?.name ?? "");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (user?.name) setAuthor(user.name);
  }, [user?.name]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    const res = await addCustomerReview({
      productId,
      author: author || user?.name || "",
      text,
      rating,
    });
    setPending(false);
    if (!res.ok) {
      setMessage(res.error);
      return;
    }
    setText("");
    setMessage("Thank you — your review is now live.");
    router.refresh();
  };

  return (
    <section className="mx-auto mt-14 max-w-7xl border-t border-border px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="font-serif text-2xl text-charcoal">Reviews</h2>
      <ul className="mt-6 space-y-4">
        {reviews.map((review) => (
          <li key={review.id} className="border border-border bg-paper px-4 py-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{review.author}</span>
              <span className="inline-flex items-center gap-1 text-rose">
                <Star className="h-3.5 w-3.5 fill-rose text-rose" />
                {review.rating}
              </span>
            </div>
            <p className="mt-2 text-sm font-light leading-relaxed text-charcoal/80">
              {review.text}
            </p>
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="mt-8 max-w-lg space-y-3 border border-border bg-paper p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em]">Write a review</h3>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name"
          required
          className="h-11 w-full border border-border px-3 text-sm"
        />
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            Rating
          </span>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="h-11 w-full border border-border px-3 text-sm"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n === 1 ? "" : "s"}
              </option>
            ))}
          </select>
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="How was the saree, drape, colour, and finish?"
          rows={4}
          required
          className="w-full border border-border px-3 py-2 text-sm"
        />
        {message && <p className="text-sm text-burgundy">{message}</p>}
        <button
          type="submit"
          disabled={pending}
          className="h-11 bg-burgundy px-5 text-sm font-semibold text-white"
        >
          {pending ? "Saving…" : "Submit review"}
        </button>
      </form>
    </section>
  );
}
