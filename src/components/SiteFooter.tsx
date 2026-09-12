import Link from "next/link";
import { STORE_ADDRESS, STORE_PHONES } from "@/data/contact";
import { RETURNS_POLICY_SHORT } from "@/data/policies";

export function SiteFooter() {
  const phones = STORE_PHONES;

  return (
    <footer className="mt-auto border-t border-border bg-cream text-charcoal">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-light uppercase tracking-[0.2em] text-charcoal">
              Explore more
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>
                <Link href="/sarees" className="hover:text-burgundy">
                  Sarees
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-burgundy">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/sarees?ready=1" className="hover:text-burgundy">
                  Ready to Ship
                </Link>
              </li>
              <li>
                <Link href="/sarees?sale=1" className="hover:text-burgundy">
                  Sale
                </Link>
              </li>
              <li>
                <Link href="/bulk-order" className="hover:text-burgundy">
                  Bulk Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-light uppercase tracking-[0.2em] text-charcoal">
              Discover
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>
                <Link href="/#contact" className="hover:text-burgundy">
                  Visit our store
                </Link>
              </li>
              <li>
                <a
                  href={STORE_ADDRESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-burgundy"
                >
                  Store locator
                </a>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-burgundy">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/sarees?occasion=Wedding" className="hover:text-burgundy">
                  Wedding edit
                </Link>
              </li>
            </ul>
            <div className="mt-6 space-y-1 text-sm leading-relaxed text-muted">
              <p className="font-medium text-charcoal">Store address</p>
              <p>
                {STORE_ADDRESS.lines[0]},
                <br />
                {STORE_ADDRESS.lines[1]},
                <br />
                {STORE_ADDRESS.lines[2]}
              </p>
            </div>
          </div>

          <div id="contact">
            <p className="text-xs font-light uppercase tracking-[0.2em] text-charcoal">
              Customer experience
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li>{RETURNS_POLICY_SHORT}</li>
              <li>Free shipping over ₹600</li>
              <li>Order via WhatsApp or call — no online checkout</li>
              <li>
                <Link href="/track-order" className="hover:text-burgundy">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/bulk-order" className="hover:text-burgundy">
                  B2B Enquiry
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-burgundy">
                  Login / Account
                </Link>
              </li>
              {phones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:+91${phone}`} className="hover:text-burgundy">
                    +91 {phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © 2026 Virasat Sarees. All rights reserved.
          </p>
          <p className="text-xs text-muted">{STORE_ADDRESS.short}</p>
        </div>
      </div>
    </footer>
  );
}
