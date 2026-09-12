"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import {
  COLORS,
  FABRICS,
  OCCASIONS,
  type Fabric,
  type Occasion,
  type Saree,
} from "@/data/sarees";
import { RETURNS_POLICY_SHORT } from "@/data/policies";
import { resolveCategory } from "@/data/categories";
import { getCollectionBySlug } from "@/data/collections";
import {
  DEFAULT_FILTERS,
  FilterSidebar,
  type Filters,
} from "@/components/FilterSidebar";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewModal } from "@/components/QuickViewModal";

type SortKey =
  | "featured"
  | "relevant"
  | "price-asc"
  | "price-desc"
  | "newest";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "relevant", label: "Most relevant" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "newest", label: "Date, new to old" },
];

function applyFilters(
  list: Saree[],
  filters: Filters,
  options: {
    readyOnly: boolean;
    saleOnly: boolean;
    occasion?: Occasion;
    category?: string;
  }
) {
  return list.filter((s) => {
    const category = s.category ?? "Sarees";
    if (options.category && category !== options.category) return false;
    if (options.readyOnly && !s.readyToShip && category !== "Ready to Ship") return false;
    if (options.saleOnly && s.discountPercent < 30 && category !== "Sale") return false;
    if (options.occasion && s.occasion !== options.occasion) return false;
    if (filters.fabrics.length && !filters.fabrics.includes(s.fabric))
      return false;
    if (filters.colors.length && !filters.colors.includes(s.color))
      return false;
    if (filters.occasions.length && !filters.occasions.includes(s.occasion))
      return false;
    if (filters.workTypes.length && !filters.workTypes.includes(s.workType))
      return false;
    if (s.price > filters.maxPrice) return false;
    return true;
  });
}

function sortSarees(list: Saree[], sort: SortKey) {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "newest":
      return copy.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case "relevant":
      return copy.sort((a, b) => b.rating - a.rating);
    default:
      return copy.sort(
        (a, b) =>
          Number(b.isBestseller) - Number(a.isBestseller) ||
          b.rating - a.rating
      );
  }
}

export function SareesCollection({ products }: { products: Saree[] }) {
  const searchParams = useSearchParams();
  const readyOnly = searchParams.get("ready") === "1";
  const saleOnly = searchParams.get("sale") === "1";
  const collectionSlug = searchParams.get("collection");
  const occasionParam = searchParams.get("occasion") as Occasion | null;
  const fabricParam = searchParams.get("fabric");
  const colorParam = searchParams.get("color");
  const qParam = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const categoryFilter = resolveCategory(searchParams.get("category"));
  const collection = collectionSlug
    ? getCollectionBySlug(collectionSlug)
    : undefined;
  const occasionFilter =
    collection?.occasion ??
    (occasionParam &&
    ["Festive", "Party", "Wedding", "Casual"].includes(occasionParam)
      ? occasionParam
      : undefined);

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("featured");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [quickView, setQuickView] = useState<Saree | null>(null);
  const [descOpen, setDescOpen] = useState(false);

  useEffect(() => {
    const next: Filters = { ...DEFAULT_FILTERS };
    if (fabricParam && (FABRICS as string[]).includes(fabricParam)) {
      next.fabrics = [fabricParam as Fabric];
    }
    if (colorParam && COLORS.some((c) => c.name === colorParam)) {
      next.colors = [colorParam];
    }
    if (
      occasionParam &&
      ["Festive", "Party", "Wedding", "Casual"].includes(occasionParam)
    ) {
      next.occasions = [occasionParam as Occasion];
    }
    setFilters(next);
  }, [fabricParam, colorParam, occasionParam]);

  const filtered = useMemo(() => {
    let list = applyFilters(products, filters, {
      readyOnly,
      saleOnly,
      occasion: occasionFilter,
      category: categoryFilter,
    });
    if (qParam) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(qParam) ||
          s.fabric.toLowerCase().includes(qParam) ||
          s.color.toLowerCase().includes(qParam) ||
          s.occasion.toLowerCase().includes(qParam) ||
          s.workType.toLowerCase().includes(qParam) ||
          (s.category ?? "Sarees").toLowerCase().includes(qParam)
      );
    }
    return sortSarees(list, sort);
  }, [products, filters, sort, readyOnly, saleOnly, occasionFilter, categoryFilter, qParam]);

  const pageTitle =
    collection?.title ??
    (categoryFilter && categoryFilter !== "Sarees"
      ? categoryFilter
      : fabricParam
        ? `${fabricParam} Sarees`
        : colorParam
          ? `${colorParam} Sarees`
          : readyOnly
            ? "Ready to Ship"
            : saleOnly
              ? "Sale"
              : occasionFilter
                ? `${occasionFilter} Sarees`
                : qParam
                  ? `Results for “${searchParams.get("q")}”`
                  : "Sarees for Women");

  const isDefaultCollection = pageTitle === "Sarees for Women";

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-[1400px] px-3 pb-16 sm:px-6 lg:px-8">
        <div className="border-b border-border py-6 sm:py-8">
          <nav className="text-xs text-muted">
            <Link href="/" className="hover:text-burgundy">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal">{pageTitle}</span>
          </nav>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-charcoal sm:text-3xl">
            {pageTitle}
          </h1>
          <p className={`mt-3 max-w-3xl font-sans text-sm font-light leading-relaxed text-muted ${descOpen ? "" : "line-clamp-3"}`}>
            {collection?.description ??
              (isDefaultCollection
                ? "Sarees that feel instantly dressed — comfort, tradition, and style in one drape. Virasat Sarees brings together a versatile collection of sarees for women, from Kanjeevaram and Banarasi weaves to organza, chiffon, and georgette. Fresh options for festive, wedding, party, and everyday wear, finished with an unstitched blouse piece. Browse by colour, fabric, or occasion, then order on WhatsApp or call."
                : `Handpicked luxury weaves for every celebration. Free shipping on orders over ₹600. ${RETURNS_POLICY_SHORT}.`)}
          </p>
          {isDefaultCollection && (
            <button
              type="button"
              className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-burgundy"
              onClick={() => setDescOpen((v) => !v)}
            >
              {descOpen ? "Read less" : "Read more"}
            </button>
          )}
        </div>

        <div className="mt-5 flex gap-8">
          <FilterSidebar
            catalog={products}
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(DEFAULT_FILTERS)}
            mobileOpen={mobileFilters}
            onMobileClose={() => setMobileFilters(false)}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileFilters(true)}
                className="inline-flex h-11 items-center gap-2 border border-border bg-paper px-3 text-sm font-medium lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </button>

              <p className="text-sm text-muted">
                <span className="font-semibold text-charcoal">
                  {filtered.length}
                </span>{" "}
                products
              </p>

              <div className="ml-auto flex min-w-0 items-center gap-2">
                <label htmlFor="sort" className="hidden text-xs text-muted sm:inline">
                  Sort
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-11 min-w-0 flex-1 border border-border bg-paper px-3 text-sm outline-none focus:border-burgundy sm:flex-none sm:min-w-[220px]"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="border border-dashed border-border bg-cream py-20 text-center">
                <p className="text-lg font-medium">No sarees match your filters</p>
                <button
                  type="button"
                  className="mt-4 text-sm font-medium text-burgundy underline"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map((saree) => (
                  <ProductCard
                    key={saree.id}
                    saree={saree}
                    onQuickView={setQuickView}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {isDefaultCollection && <CollectionSeoLinks catalog={products} />}
      </div>

      <QuickViewModal saree={quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}

function CollectionSeoLinks({ catalog }: { catalog: Saree[] }) {
  const shopColors = COLORS.filter((c) =>
    catalog.some((s) => s.color === c.name)
  );
  return (
    <div className="mt-16 space-y-8 border-t border-border pt-10 text-sm">
      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-charcoal">
          Shop by color
        </h2>
        <p className="mt-3 flex flex-wrap gap-x-1 gap-y-2 text-muted">
          {shopColors.map((c, i) => (
            <span key={c.name}>
              <Link href={`/sarees?color=${encodeURIComponent(c.name)}`} className="hover:text-burgundy">
                {c.name} Sarees
              </Link>
              {i < shopColors.length - 1 ? <span className="px-1.5">|</span> : null}
            </span>
          ))}
        </p>
      </section>
      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-charcoal">
          Shop by fabric
        </h2>
        <p className="mt-3 flex flex-wrap gap-x-1 gap-y-2 text-muted">
          {FABRICS.map((f, i) => (
            <span key={f}>
              <Link href={`/sarees?fabric=${encodeURIComponent(f)}`} className="hover:text-burgundy">
                {f} Sarees
              </Link>
              {i < FABRICS.length - 1 ? <span className="px-1.5">|</span> : null}
            </span>
          ))}
        </p>
      </section>
      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-charcoal">
          Shop by occasion
        </h2>
        <p className="mt-3 flex flex-wrap gap-x-1 gap-y-2 text-muted">
          {OCCASIONS.map((o, i) => (
            <span key={o}>
              <Link href={`/sarees?occasion=${encodeURIComponent(o)}`} className="hover:text-burgundy">
                {o} Sarees
              </Link>
              {i < OCCASIONS.length - 1 ? <span className="px-1.5">|</span> : null}
            </span>
          ))}
        </p>
      </section>
    </div>
  );
}
