"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StoreReview } from "@/lib/reviews";

export function CustomerReviews({ reviews }: { reviews: StoreReview[] }) {
  const cards = reviews.slice(0, 8);
  return (
    <section className="bg-paper px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Customer Reviews"
          subtitle="Loved by women who dress for the moment"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((r, i) => (
            <motion.blockquote
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex flex-col border border-border bg-paper px-5 py-7"
            >
              <p className="inline-flex items-center gap-1 text-rose">
                {Array.from({ length: r.rating }).map((_, star) => (
                  <Star key={star} className="h-3.5 w-3.5 fill-rose text-rose" />
                ))}
              </p>
              <p className="mt-3 font-serif text-lg leading-relaxed text-charcoal">
                “{r.text}”
              </p>
              <footer className="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-rose">
                {r.author}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
