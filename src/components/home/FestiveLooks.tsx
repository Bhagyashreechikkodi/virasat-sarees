"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Saree } from "@/data/sarees";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FestiveLooks({ products }: { products: Saree[] }) {
  const festive = products
    .filter((s) => s.isBestseller || s.occasion === "Festive" || s.occasion === "Wedding")
    .slice(0, 4);

  return (
    <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            title="Festive Looks We Love"
            subtitle="Bestsellers and celebration-ready weaves"
            align="left"
          />
          <Link
            href="/sarees"
            className="inline-flex h-11 items-center gap-1.5 text-xs font-semibold tracking-[0.16em] text-burgundy"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
          {festive.map((saree) => (
            <ProductCard key={saree.id} saree={saree} />
          ))}
        </div>
      </div>
    </section>
  );
}
