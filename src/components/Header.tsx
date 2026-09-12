"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { STORE_ADDRESS } from "@/data/contact";
import { getSearchSuggestions } from "@/lib/searchSuggestions";
import { useScrollLock } from "@/hooks/useScrollLock";

const NAV_LINKS = [
  { href: "/sarees", label: "Sarees" },
  { href: "/collections", label: "Collections" },
  { href: "/sarees?occasion=Festive", label: "Festive" },
  { href: "/sarees?occasion=Wedding", label: "Wedding" },
  { href: "/sarees?category=petticoats", label: "Petticoats" },
  { href: "/sarees?category=blouse", label: "Blouse" },
  { href: "/sarees?sale=1", label: "Sale" },
  { href: "/bulk-order", label: "Bulk Order" },
  { href: "/track-order", label: "Track Order" },
];

export function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const openCart = useCartStore((s) => s.openCart);
  const cartCount = useCartStore((s) =>
    s.items.reduce((n, i) => n + i.quantity, 0)
  );
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const suggestions = useMemo(() => getSearchSuggestions(query), [query]);
  const hasTypedResults =
    suggestions.browse.length > 0 || suggestions.products.length > 0;
  const showSearchPanel =
    searchOpen &&
    (query.trim().length === 0 || hasTypedResults || query.trim().length > 0);

  useEffect(() => setMounted(true), []);

  useScrollLock(mobileNav);

  useEffect(() => {
    const onDoc = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (profileRef.current && !profileRef.current.contains(t)) {
        setProfileOpen(false);
      }
      if (searchWrapRef.current && !searchWrapRef.current.contains(t)) {
        if (window.matchMedia("(min-width: 768px)").matches) {
          setSearchOpen(false);
        }
      }
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  const submitSearch = (e?: FormEvent) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) {
      setSearchOpen(true);
      return;
    }
    closeSearch();
    router.push(`/sarees?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-50 overflow-x-clip border-b border-border/70 bg-paper/95 backdrop-blur-md safe-pt">
      <div className="mx-auto flex w-full min-w-0 max-w-[1400px] items-center gap-1 px-2 py-2 sm:gap-2 sm:px-6 sm:py-3 lg:px-8">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center lg:hidden sm:h-11 sm:w-11"
            aria-label="Open menu"
            onClick={() => setMobileNav(true)}
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <Link href="/" className="min-w-0 shrink">
            <span className="block truncate font-serif text-[1.15rem] font-medium tracking-tight text-burgundy sm:text-[1.75rem]">
              Virasat Sarees
            </span>
          </Link>

          <nav className="ml-8 hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.08em] text-charcoal/80 transition-colors hover:text-burgundy"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-0 sm:gap-1">
            <div className="relative mr-1 hidden md:block" ref={searchWrapRef}>
              <form
                onSubmit={submitSearch}
                className="flex w-56 items-center gap-2 border border-border bg-paper px-3 py-2 lg:w-72"
              >
                <Search className="h-4 w-4 shrink-0 text-muted" />
                <input
                  type="search"
                  placeholder="Search by colour, fabric, occasion..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </form>
              {showSearchPanel && (
                <SearchDropdown
                  query={query}
                  suggestions={suggestions}
                  onPick={closeSearch}
                  onSeeAll={() => submitSearch()}
                />
              )}
            </div>

            <button
              type="button"
              className="flex h-10 w-10 shrink-0 flex-col items-center justify-center sm:h-11 sm:w-11 md:hidden"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                className={`flex h-10 w-10 shrink-0 flex-col items-center justify-center text-charcoal sm:h-11 sm:min-w-11 sm:w-auto sm:px-1 ${
                  profileOpen ? "text-burgundy" : ""
                }`}
                aria-label="Profile"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((v) => !v)}
              >
                <User className="h-5 w-5" />
                <span className="mt-0.5 hidden text-[10px] font-semibold tracking-wide sm:block">
                  Profile
                </span>
                {profileOpen && (
                  <span className="absolute inset-x-1 bottom-0 h-0.5 bg-burgundy sm:inset-x-2" />
                )}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-[60] w-[min(17.5rem,calc(100vw-1rem))] border border-border bg-paper shadow-xl">
                  <div className="px-4 pb-3 pt-4">
                    <p className="text-sm font-bold text-charcoal">
                      {mounted && user ? `Hi, ${user.name}` : "Welcome"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {mounted && user
                        ? `+91 ${user.phone}`
                        : "To access account and manage orders"}
                    </p>
                    {!(mounted && user) ? (
                      <Link
                        href="/login"
                        onClick={() => setProfileOpen(false)}
                        className="mt-3 flex h-10 items-center justify-center border border-border text-xs font-bold tracking-wide text-burgundy hover:border-burgundy"
                      >
                        LOGIN / SIGNUP
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="mt-3 flex h-10 w-full items-center justify-center border border-border text-xs font-bold tracking-wide text-burgundy hover:border-burgundy"
                      >
                        SIGN OUT
                      </button>
                    )}
                  </div>
                  <div className="border-t border-border py-1">
                    <ProfileLink
                      href="/track-order"
                      onClick={() => setProfileOpen(false)}
                    >
                      Track Order
                    </ProfileLink>
                    <ProfileLink
                      href="/wishlist"
                      onClick={() => setProfileOpen(false)}
                    >
                      Wishlist
                    </ProfileLink>
                    <ProfileLink
                      href="/#contact"
                      onClick={() => setProfileOpen(false)}
                    >
                      Contact Us
                    </ProfileLink>
                    <ProfileLink
                      href="/sarees?sale=1"
                      onClick={() => setProfileOpen(false)}
                    >
                      Sale
                    </ProfileLink>
                  </div>
                  <div className="border-t border-border py-1">
                    <ProfileLink
                      href="/collections"
                      onClick={() => setProfileOpen(false)}
                    >
                      Collections
                    </ProfileLink>
                    <ProfileLink
                      href="/sarees?ready=1"
                      onClick={() => setProfileOpen(false)}
                    >
                      Ready to Ship
                    </ProfileLink>
                    <div className="px-4 py-2.5 text-xs leading-relaxed text-muted">
                      <p className="font-medium text-charcoal">Store</p>
                      <p className="mt-0.5">{STORE_ADDRESS.short}</p>
                      <a
                        href={STORE_ADDRESS.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block font-medium text-burgundy"
                        onClick={() => setProfileOpen(false)}
                      >
                        Open in Google Maps
                      </a>
                      <p className="mt-2">Free shipping on orders over ₹600</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/wishlist"
              className="relative flex h-10 w-10 shrink-0 flex-col items-center justify-center sm:h-11 sm:min-w-11 sm:w-auto sm:px-1"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              <span className="mt-0.5 hidden text-[10px] font-semibold tracking-wide sm:block">
                Wishlist
              </span>
              {mounted && wishlistCount > 0 && (
                <span className="absolute right-0 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] font-semibold text-white sm:right-1">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="relative flex h-10 w-10 shrink-0 flex-col items-center justify-center sm:h-11 sm:min-w-11 sm:w-auto sm:px-1"
              aria-label="Open bag"
              onClick={() => openCart()}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="mt-0.5 hidden text-[10px] font-semibold tracking-wide sm:block">
                Bag
              </span>
              {mounted && cartCount > 0 && (
                <span className="absolute right-0 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] font-semibold text-white sm:right-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-border px-3 py-3 md:hidden">
            <form
              onSubmit={submitSearch}
              className="flex items-center gap-2 border border-border bg-paper px-3 py-3"
            >
              <Search className="h-4 w-4 shrink-0 text-muted" />
              <input
                type="search"
                placeholder="Try wedding, maroon, silk..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full min-w-0 bg-transparent text-base outline-none"
                autoFocus
              />
            </form>
            <div className="mt-2 max-h-80 overflow-y-auto border border-border bg-paper">
              <SearchResultsList
                query={query}
                suggestions={suggestions}
                onPick={closeSearch}
                onSeeAll={() => submitSearch()}
              />
            </div>
          </div>
        )}

      {mobileNav && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMobileNav(false)}
          />
          <div className="android-drawer absolute left-0 top-0 flex w-[min(100%,19rem)] flex-col bg-paper shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <span className="font-serif text-xl font-medium tracking-tight text-burgundy">
                Virasat Sarees
              </span>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center"
                aria-label="Close"
                onClick={() => setMobileNav(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileNav(false)}
                  className="block rounded-md px-3 py-3.5 text-base font-medium active:bg-cream"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-3 border-border" />
              <Link
                href="/wishlist"
                onClick={() => setMobileNav(false)}
                className="block rounded-md px-3 py-3.5 text-base font-medium"
              >
                Wishlist {mounted && wishlistCount > 0 ? `(${wishlistCount})` : ""}
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileNav(false)}
                className="block rounded-md px-3 py-3.5 text-base font-medium"
              >
                {user ? `Hi, ${user.name}` : "Login / Sign up"}
              </Link>
              {mounted && user && (
                <button
                  type="button"
                  className="block w-full rounded-md px-3 py-3.5 text-left text-base font-medium text-burgundy"
                  onClick={() => {
                    logout();
                    setMobileNav(false);
                  }}
                >
                  Sign out
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

function ProfileLink({
  href,
  children,
  onClick,
  badge,
  external,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  badge?: string;
  external?: boolean;
}) {
  const className =
    "flex items-center justify-between px-4 py-2.5 text-sm text-charcoal/90 hover:bg-cream";
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={className}
      >
        <span>{children}</span>
        {badge && (
          <span className="rounded bg-burgundy px-1.5 py-0.5 text-[10px] font-bold text-white">
            {badge}
          </span>
        )}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={className}>
      <span>{children}</span>
      {badge && (
        <span className="rounded bg-burgundy px-1.5 py-0.5 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}

function SearchDropdown({
  query,
  suggestions,
  onPick,
  onSeeAll,
}: {
  query: string;
  suggestions: ReturnType<typeof getSearchSuggestions>;
  onPick: () => void;
  onSeeAll: () => void;
}) {
  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto border border-border bg-paper shadow-lg">
      <SearchResultsList
        query={query}
        suggestions={suggestions}
        onPick={onPick}
        onSeeAll={onSeeAll}
      />
    </div>
  );
}

function SearchResultsList({
  query,
  suggestions,
  onPick,
  onSeeAll,
}: {
  query: string;
  suggestions: ReturnType<typeof getSearchSuggestions>;
  onPick: () => void;
  onSeeAll: () => void;
}) {
  const q = query.trim();
  const popular = suggestions.popular;
  const browse = suggestions.browse;
  const products = suggestions.products;

  if (!q) {
    return (
      <div className="py-2">
        <p className="px-3 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
          Popular searches
        </p>
        <p className="px-3 pb-2 text-xs text-muted">
          Don&apos;t know the name? Pick a colour, fabric, or occasion.
        </p>
        {popular.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={onPick}
            className="flex items-center justify-between border-b border-border/70 px-3 py-3 text-sm last:border-0 hover:bg-cream"
          >
            <span className="font-medium text-charcoal">{item.label}</span>
            <span className="text-[11px] text-muted">{item.hint}</span>
          </Link>
        ))}
      </div>
    );
  }

  if (browse.length === 0 && products.length === 0) {
    return (
      <div className="px-3 py-4 text-sm text-muted">
        No matches. Try “wedding”, “maroon”, “silk”, or “banarasi”.
        <button
          type="button"
          onClick={onSeeAll}
          className="mt-2 block font-medium text-burgundy"
        >
          Search all sarees for “{q}”
        </button>
      </div>
    );
  }

  return (
    <div className="py-1">
      {browse.length > 0 && (
        <>
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Browse
          </p>
          {browse.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={onPick}
              className="flex items-center justify-between px-3 py-2.5 text-sm hover:bg-cream"
            >
              <span>{item.label}</span>
              <span className="text-[11px] text-muted">{item.hint}</span>
            </Link>
          ))}
        </>
      )}
      {products.length > 0 && (
        <>
          <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Products
          </p>
          {products.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={onPick}
              className="block border-t border-border/60 px-3 py-2.5 text-sm hover:bg-cream"
            >
              <p className="font-medium">{item.label}</p>
              <p className="text-xs text-muted">{item.hint}</p>
            </Link>
          ))}
        </>
      )}
      <button
        type="button"
        onClick={onSeeAll}
        className="w-full border-t border-border px-3 py-3 text-left text-sm font-semibold text-burgundy hover:bg-cream"
      >
        See all results for “{q}”
      </button>
    </div>
  );
}
