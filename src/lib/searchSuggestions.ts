import {
  COLORS,
  FABRICS,
  OCCASIONS,
  sarees,
  type Saree,
} from "@/data/sarees";

export type BrowseSuggestion = {
  kind: "browse";
  id: string;
  label: string;
  hint: string;
  href: string;
};

export type ProductSuggestion = {
  kind: "product";
  id: string;
  label: string;
  hint: string;
  href: string;
};

export type SearchSuggestion = BrowseSuggestion | ProductSuggestion;

/** Easy picks when the search box is empty / focused */
export const POPULAR_SEARCHES: BrowseSuggestion[] = [
  {
    kind: "browse",
    id: "pop-wedding",
    label: "Wedding sarees",
    hint: "Occasion",
    href: "/sarees?occasion=Wedding",
  },
  {
    kind: "browse",
    id: "pop-festive",
    label: "Festive wear",
    hint: "Occasion",
    href: "/sarees?occasion=Festive",
  },
  {
    kind: "browse",
    id: "pop-party",
    label: "Party sarees",
    hint: "Occasion",
    href: "/sarees?occasion=Party",
  },
  {
    kind: "browse",
    id: "pop-silk",
    label: "Silk sarees",
    hint: "Fabric",
    href: "/sarees?fabric=Kanjeevaram%20Silk",
  },
  {
    kind: "browse",
    id: "pop-banarasi",
    label: "Banarasi",
    hint: "Fabric",
    href: "/sarees?fabric=Banarasi",
  },
  {
    kind: "browse",
    id: "pop-maroon",
    label: "Maroon / wine",
    hint: "Colour",
    href: "/sarees?color=Maroon",
  },
  {
    kind: "browse",
    id: "pop-ready",
    label: "Ready to ship",
    hint: "Quick delivery",
    href: "/sarees?ready=1",
  },
  {
    kind: "browse",
    id: "pop-sale",
    label: "Sale / offers",
    hint: "Discount",
    href: "/sarees?sale=1",
  },
];

function browseCatalog(): BrowseSuggestion[] {
  const fabricSuggestions: BrowseSuggestion[] = FABRICS.map((f) => ({
    kind: "browse",
    id: `fabric-${f}`,
    label: f,
    hint: "Fabric",
    href: `/sarees?fabric=${encodeURIComponent(f)}`,
  }));

  const occasionSuggestions: BrowseSuggestion[] = OCCASIONS.map((o) => ({
    kind: "browse",
    id: `occasion-${o}`,
    label: `${o} sarees`,
    hint: "Occasion",
    href: `/sarees?occasion=${encodeURIComponent(o)}`,
  }));

  const colorSuggestions: BrowseSuggestion[] = COLORS.map((c) => ({
    kind: "browse",
    id: `color-${c.name}`,
    label: c.name,
    hint: "Colour",
    href: `/sarees?color=${encodeURIComponent(c.name)}`,
  }));

  const extras: BrowseSuggestion[] = [
    {
      kind: "browse",
      id: "cat-petticoats",
      label: "Petticoats",
      hint: "Category",
      href: "/sarees?category=petticoats",
    },
    {
      kind: "browse",
      id: "cat-blouse",
      label: "Blouse (Unstitched)",
      hint: "Category",
      href: "/sarees?category=blouse",
    },
    {
      kind: "browse",
      id: "cat-ready",
      label: "Ready to ship",
      hint: "Quick delivery",
      href: "/sarees?ready=1",
    },
    {
      kind: "browse",
      id: "cat-sale",
      label: "Sale",
      hint: "Offers",
      href: "/sarees?sale=1",
    },
  ];

  return [
    ...extras,
    ...occasionSuggestions,
    ...fabricSuggestions,
    ...colorSuggestions,
  ];
}

const BROWSE_ALL = browseCatalog();

function matchesQuery(text: string, q: string) {
  return text.toLowerCase().includes(q);
}

function productToSuggestion(s: Saree): ProductSuggestion {
  return {
    kind: "product",
    id: s.id,
    label: s.name,
    hint: `${s.fabric} · ${s.color} · ${s.occasion}`,
    href: `/product/${s.id}`,
  };
}

/** Generic search: browse by fabric/colour/occasion first, then products */
export function getSearchSuggestions(rawQuery: string): {
  browse: BrowseSuggestion[];
  products: ProductSuggestion[];
  popular: BrowseSuggestion[];
} {
  const q = rawQuery.trim().toLowerCase();

  if (!q) {
    return {
      browse: [],
      products: [],
      popular: POPULAR_SEARCHES,
    };
  }

  const browse = BROWSE_ALL.filter(
    (b) => matchesQuery(b.label, q) || matchesQuery(b.hint, q)
  ).slice(0, 8);

  const products = sarees
    .filter(
      (s) =>
        matchesQuery(s.name, q) ||
        matchesQuery(s.fabric, q) ||
        matchesQuery(s.color, q) ||
        matchesQuery(s.occasion, q) ||
        matchesQuery(s.workType, q) ||
        matchesQuery(s.description, q)
    )
    .slice(0, 6)
    .map(productToSuggestion);

  return { browse, products, popular: [] };
}
