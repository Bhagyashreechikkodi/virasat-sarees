export type CollectionSlug = "wedding" | "party" | "festive" | "casual" | "ready" | "sale";

export interface Collection {
  slug: CollectionSlug;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  image: string;
  occasion?: "Wedding" | "Party" | "Festive" | "Casual";
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "wedding",
    title: "Wedding Edit",
    subtitle: "Heirloom Banarasi & Kanjeevaram",
    description:
      "Bridal and trousseau-ready weaves in maroon, gold, and ivory for your most precious ceremonies.",
    href: "/sarees?collection=wedding",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&q=80",
    occasion: "Wedding",
  },
  {
    slug: "party",
    title: "Party Soft Glam",
    subtitle: "Organza & Georgette nights",
    description:
      "Shimmering organza and fluid georgette for cocktail evenings and celebration nights.",
    href: "/sarees?collection=party",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&q=80",
    occasion: "Party",
  },
  {
    slug: "festive",
    title: "Festive Favourites",
    subtitle: "Zari borders & celebration silks",
    description:
      "Bright festive silks and embroidered pieces made for Diwali, Navratri, and family gatherings.",
    href: "/sarees?collection=festive",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80",
    occasion: "Festive",
  },
  {
    slug: "casual",
    title: "Everyday Ethereal",
    subtitle: "Chiffon & Chanderi ease",
    description:
      "Breathable chiffon and soft Chanderi for daytime grace and effortless daily ethnic wear.",
    href: "/sarees?collection=casual",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=900&q=80",
    occasion: "Casual",
  },
  {
    slug: "ready",
    title: "Ready to Ship",
    subtitle: "Dispatched within 48 hours",
    description:
      "Handpicked pieces leaving our atelier quickly — elegance without the wait.",
    href: "/sarees?ready=1",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&q=80",
  },
  {
    slug: "sale",
    title: "Sale Edit",
    subtitle: "Up to 50% off selected weaves",
    description:
      "Limited-time prices on bestsellers and seasonal favourites. Free shipping on orders over ₹600.",
    href: "/sarees?sale=1",
    image:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=900&q=80",
  },
];

export function getCollectionBySlug(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}
