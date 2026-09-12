import { MapPin, Navigation } from "lucide-react";
import { STORE_ADDRESS, STORE_PHONES, formatPhoneDisplay, telHref } from "@/data/contact";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function VisitStores() {
  return (
    <section className="bg-cream px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          title="Visit Our Store"
          subtitle="Walk in for a drape, or open the map for directions"
        />

        <div className="luxury-card mt-12 px-6 py-10 sm:px-12">
          <div className="flex gap-4">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-rose" />
            <div>
              <p className="font-serif text-3xl text-charcoal">Virasat Sarees</p>
              <div className="mt-3 space-y-0.5 text-sm leading-relaxed text-muted">
                {STORE_ADDRESS.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <ul className="mt-5 space-y-1 text-sm text-charcoal">
                {STORE_PHONES.map((phone) => (
                  <li key={phone}>
                    <a href={telHref(phone)} className="hover:text-burgundy">
                      {formatPhoneDisplay(phone)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a
            href={STORE_ADDRESS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 bg-burgundy text-sm font-semibold tracking-[0.14em] text-white sm:w-auto sm:px-8"
          >
            <Navigation className="h-4 w-4" />
            Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
