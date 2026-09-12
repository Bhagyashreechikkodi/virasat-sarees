"use client";

const OFFERS = [
  "Free shipping on orders over ₹600",
  "Returns & exchanges in 7 days — only for damage, wrong item, or misprints (photos required)",
  "Ready to ship in 48 hours",
  "Order via WhatsApp or call",
];

export function PromoTicker() {
  const line = [...OFFERS, ...OFFERS].join("     ·     ");

  return (
    <div className="overflow-hidden bg-burgundy-deep py-2 text-white/90">
      <div className="animate-marquee whitespace-nowrap text-[11px] font-medium tracking-[0.14em] sm:text-xs">
        <span className="inline-block px-4">{line}</span>
        <span className="inline-block px-4" aria-hidden>
          {line}
        </span>
      </div>
    </div>
  );
}
