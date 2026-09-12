"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { COLLECTIONS } from "@/data/collections";

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <nav className="text-xs text-muted tracking-wide">
        <Link href="/" className="hover:text-burgundy">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-charcoal">Collections</span>
      </nav>

      <div className="mt-6 max-w-2xl">
        <p className="text-[11px] uppercase tracking-[0.28em] text-rose">
          Signature stories
        </p>
        <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight text-charcoal sm:text-5xl">
          Our collections
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Explore curated edits for weddings, festivities, parties, and everyday
          elegance — each weave chosen for Virasat Sarees.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTIONS.map((col, i) => (
          <motion.div
            key={col.slug}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link href={col.href} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe4da]">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-serif text-2xl text-white">{col.title}</p>
                  <p className="mt-1 text-sm text-white/80">{col.subtitle}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/65">
                    {col.description}
                  </p>
                  <span className="mt-4 inline-block border-b border-gold-soft/70 pb-0.5 text-[11px] font-semibold tracking-[0.16em] text-gold-soft">
                    Shop now
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
