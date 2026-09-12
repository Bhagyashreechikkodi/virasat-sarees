"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

const CATEGORIES = [
  {
    name: "Sarees",
    href: "/sarees",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=700&q=80",
  },
  {
    name: "Petticoats",
    href: "/sarees?category=petticoats",
    image:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=700&q=80",
  },
  {
    name: "Blouse",
    href: "/sarees?category=blouse",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=80",
  },
  {
    name: "Ready to Ship",
    href: "/sarees?ready=1",
    image:
      "https://images.unsplash.com/photo-1583391733981-8b685c5ece64?w=700&q=80",
  },
  {
    name: "Sale",
    href: "/sarees?sale=1",
    image:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=700&q=80",
  },
];

export function FeaturedCategories() {
  return (
    <section className="bg-paper px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title="Featured Categories"
          subtitle="Ethnic essentials, chosen for drape, colour and occasion"
        />

        <div className="mt-14 flex gap-4 overflow-x-auto no-scrollbar pb-2 md:grid md:grid-cols-5 md:gap-5 md:overflow-visible">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              className="w-[9.5rem] shrink-0 sm:w-44 md:w-auto"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
            >
              <Link href={cat.href} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#ebe4da]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 44vw, 20vw"
                  />
                </div>
                <span className="mt-3 block text-center text-sm font-semibold uppercase tracking-[0.12em] text-charcoal sm:text-[15px]">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
