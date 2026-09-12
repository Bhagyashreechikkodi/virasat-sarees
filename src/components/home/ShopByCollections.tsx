"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { COLLECTIONS } from "@/data/collections";
import { SectionHeading } from "@/components/ui/SectionHeading";

const FEATURED = COLLECTIONS.filter((c) =>
  ["wedding", "party", "casual"].includes(c.slug)
);

export function ShopByCollections() {
  return (
    <section className="bg-paper px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading
            title="Shop By Collections"
            subtitle="Woven for the wardrobe you actually wear"
            align="left"
          />
          <Link
            href="/collections"
            className="inline-flex h-11 items-center text-xs font-semibold tracking-[0.16em] text-burgundy"
          >
            View all
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:h-[620px] lg:grid-rows-2 xl:h-[700px]">
          {FEATURED.map((col, i) => (
            <motion.div
              key={col.slug}
              className={i === 0 ? "lg:row-span-2" : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={col.href}
                className="group relative block h-full min-h-[260px] overflow-hidden sm:min-h-[320px]"
              >
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-9">
                  <p className="font-serif text-2xl text-paper sm:text-3xl lg:text-4xl">
                    {col.title}
                  </p>
                  <p className="mt-1.5 max-w-sm text-sm text-white/75">
                    {col.subtitle}
                  </p>
                  <span className="mt-5 inline-block border-b border-gold-soft/70 pb-0.5 text-[11px] font-semibold tracking-[0.16em] text-gold-soft">
                    Shop now
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
