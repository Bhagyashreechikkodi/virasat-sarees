"use client";

import { Truck, ShieldCheck, RefreshCw, Sparkles } from "lucide-react";

const PERKS = [
  {
    icon: Truck,
    title: "Free shipping",
    text: "On orders over ₹600",
  },
  {
    icon: ShieldCheck,
    title: "Authentic weaves",
    text: "Verified silk & handloom",
  },
  {
    icon: RefreshCw,
    title: "7-day returns",
    text: "Damage, wrong item, or misprints — with photos",
  },
  {
    icon: Sparkles,
    title: "Ready to ship",
    text: "Select styles in 48 hours",
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 md:grid-cols-4 lg:gap-8 lg:px-8">
        {PERKS.map((p) => (
          <div key={p.title} className="flex items-start gap-3">
            <p.icon className="mt-0.5 h-5 w-5 shrink-0 text-rose" />
            <div>
              <p className="text-sm font-semibold text-charcoal">{p.title}</p>
              <p className="mt-0.5 text-xs text-muted">{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
