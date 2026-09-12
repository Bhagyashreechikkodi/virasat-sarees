"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1800&q=85",
    kicker: "Festive edit",
    headline: "Silks woven for the season",
    sub: "Kanjeevaram, Banarasi and organza — pieces made for celebrations that linger.",
    cta: "Explore sarees",
    href: "/sarees",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1800&q=85",
    kicker: "Wedding atelier",
    headline: "Heirloom weaves, new light",
    sub: "Maroon, ivory and antique zari for the moments you will remember longest.",
    cta: "Shop wedding",
    href: "/sarees?collection=wedding",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1800&q=85",
    kicker: "Ready to ship",
    headline: "From Athani, within 48 hours",
    sub: "Handpicked pieces leaving our store quickly — still finished with care.",
    cta: "Shop now",
    href: "/sarees?ready=1",
  },
];

export function HomeHero() {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchOnControl = useRef(false);

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const t = setInterval(() => go(1), 6500);
    return () => clearInterval(t);
  }, [go]);

  const slide = SLIDES[index];

  return (
    <section
      className="relative h-[min(88dvh,820px)] min-h-[560px] w-full overflow-hidden bg-ink sm:min-h-[640px]"
      onTouchStart={(e) => {
        const target = e.target as HTMLElement;
        touchOnControl.current = !!target.closest("a, button");
        touchStartX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchOnControl.current || touchStartX.current == null) {
          touchStartX.current = null;
          return;
        }
        const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchStartX.current = null;
      }}
    >
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={s.image}
            alt=""
            fill
            preload={i === 0}
            className="object-cover object-[center_18%] scale-[1.03]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/25" />
        </div>
      ))}

      <div className="relative z-10 flex h-full items-end pb-20 sm:items-center sm:pb-0">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl bg-paper/95 px-5 py-6 shadow-[0_20px_50px_rgba(26,18,20,0.18)] sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none">
            <p className="font-serif text-4xl font-medium uppercase tracking-[0.14em] text-rose sm:text-6xl sm:tracking-[0.16em] sm:text-gold-soft md:text-7xl md:tracking-[0.18em]">
              Virasat Sarees
            </p>
            <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.28em] text-rose/80 sm:text-gold-soft/80">
              Athani · Belagavi · {slide.kicker}
            </p>
            <h1 className="mt-3 font-serif text-[2.35rem] font-medium leading-[1.1] text-charcoal sm:mt-5 sm:text-5xl sm:text-paper md:text-6xl">
              {slide.headline}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:mt-4 sm:text-base sm:text-white/75">
              {slide.sub}
            </p>
            <div className="mt-7 flex w-full flex-col gap-3 sm:max-w-md sm:flex-row">
              <Link
                href={slide.href}
                className="inline-flex h-12 items-center justify-center gap-2 bg-burgundy px-7 text-xs font-semibold tracking-[0.16em] text-white"
              >
                {slide.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/sarees?sale=1"
                className="inline-flex h-12 items-center justify-center border border-burgundy/25 px-7 text-xs font-semibold tracking-[0.16em] text-burgundy sm:border-white/50 sm:text-white"
              >
                View sale
              </Link>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => go(-1)}
        className="icon-on-photo icon-on-photo-invert absolute left-1 top-1/2 z-20 flex h-11 w-10 -translate-y-1/2 items-center justify-center text-white sm:left-4 sm:w-11"
      >
        <ArrowLeft className="h-6 w-6" strokeWidth={2} />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => go(1)}
        className="icon-on-photo icon-on-photo-invert absolute right-1 top-1/2 z-20 flex h-11 w-10 -translate-y-1/2 items-center justify-center text-white sm:right-4 sm:w-11"
      >
        <ArrowRight className="h-6 w-6" strokeWidth={2} />
      </button>

      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`tap-sm h-2 min-h-0 rounded-full transition-all ${
              i === index ? "w-7 bg-paper" : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>

    </section>
  );
}
