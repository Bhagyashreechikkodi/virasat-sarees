"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";

const OCCASIONS = [
  {
    name: "Festive",
    href: "/sarees?collection=festive",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
  },
  {
    name: "Wedding",
    href: "/sarees?collection=wedding",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
  },
  {
    name: "Party",
    href: "/sarees?collection=party",
    image:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=80",
  },
  {
    name: "Casual",
    href: "/sarees?collection=casual",
    image:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
  },
];

export function ShopByOccasion() {
  return (
    <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading title="Shop By Occasion" />
        <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {OCCASIONS.map((o) => (
            <Link key={o.name} href={o.href} className="group relative block">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#ebe4da]">
                <Image
                  src={o.image}
                  alt={o.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <span className="block font-serif text-2xl text-paper sm:text-3xl">
                    {o.name}
                  </span>
                  <span className="mt-1 block text-[11px] font-medium tracking-[0.16em] text-gold-soft">
                    Shop now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
