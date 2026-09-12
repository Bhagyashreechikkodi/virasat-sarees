export type Fabric =
  | "Kanjeevaram Silk"
  | "Organza"
  | "Banarasi"
  | "Chiffon"
  | "Georgette"
  | "Chanderi";

export type Occasion = "Festive" | "Party" | "Wedding" | "Casual";

export type WorkType = "Zari" | "Embroidered" | "Printed" | "Handloom";

export type BlouseOption = "Unstitched";

export interface Saree {
  id: string;
  name: string;
  fabric: Fabric;
  color: string;
  colorHex: string;
  occasion: Occasion;
  workType: WorkType;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  isBestseller: boolean;
  isNew: boolean;
  readyToShip: boolean;
  images: string[];
  videos?: string[];
  category?: string;
  blouseOptions: BlouseOption[];
  description: string;
  care: string;
}

export const FABRICS: Fabric[] = [
  "Kanjeevaram Silk",
  "Organza",
  "Banarasi",
  "Chiffon",
  "Georgette",
  "Chanderi",
];

export const OCCASIONS: Occasion[] = ["Festive", "Party", "Wedding", "Casual"];

export const WORK_TYPES: WorkType[] = [
  "Zari",
  "Embroidered",
  "Printed",
  "Handloom",
];

export const COLORS: { name: string; hex: string }[] = [
  { name: "Maroon", hex: "#800020" },
  { name: "Wine", hex: "#722F37" },
  { name: "Red", hex: "#B91C1C" },
  { name: "Coral", hex: "#FF6F61" },
  { name: "Peach", hex: "#FFCBA4" },
  { name: "Pink", hex: "#E8A0BF" },
  { name: "Magenta", hex: "#C2185B" },
  { name: "Purple", hex: "#6B3FA0" },
  { name: "Lavender", hex: "#B57EDC" },
  { name: "Royal Blue", hex: "#1E3A8A" },
  { name: "Navy", hex: "#0A1628" },
  { name: "Teal", hex: "#0F766E" },
  { name: "Emerald", hex: "#046307" },
  { name: "Olive", hex: "#6B8E23" },
  { name: "Mustard", hex: "#E1AD01" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Orange", hex: "#E67E22" },
  { name: "Beige", hex: "#D4C4A8" },
  { name: "Cream", hex: "#F5F0E6" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Grey", hex: "#9CA3AF" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Black", hex: "#1A1A1A" },
  { name: "White", hex: "#FFFFFF" },
];

export const sarees: Saree[] = [
  {
    id: "rs-001",
    name: "Mustard Yellow Silk Blend Zari Saree",
    fabric: "Kanjeevaram Silk",
    color: "Mustard",
    colorHex: "#E1AD01",
    occasion: "Festive",
    workType: "Zari",
    price: 2499,
    originalPrice: 4999,
    discountPercent: 50,
    rating: 4.6,
    reviewCount: 214,
    isBestseller: true,
    isNew: false,
    readyToShip: true,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
    ],
    blouseOptions: ["Unstitched"],
    description:
      "A radiant mustard Kanjeevaram silk blend saree with rich zari borders, crafted for festive gatherings and celebrations.",
    care: "Dry Clean Only",
  },
  {
    id: "rs-002",
    name: "Deep Maroon Banarasi Brocade Saree",
    fabric: "Banarasi",
    color: "Maroon",
    colorHex: "#800020",
    occasion: "Wedding",
    workType: "Zari",
    price: 8999,
    originalPrice: 12999,
    discountPercent: 31,
    rating: 4.8,
    reviewCount: 389,
    isBestseller: true,
    isNew: false,
    readyToShip: true,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    ],
    blouseOptions: ["Unstitched"],
    description:
      "Timeless Banarasi brocade in deep maroon with intricate gold motifs — a bridal favourite.",
    care: "Dry Clean Only",
  },
  {
    id: "rs-003",
    name: "Ivory Organza Floral Embroidered Saree",
    fabric: "Organza",
    color: "Ivory",
    colorHex: "#FFFFF0",
    occasion: "Party",
    workType: "Embroidered",
    price: 4599,
    originalPrice: 6999,
    discountPercent: 34,
    rating: 4.5,
    reviewCount: 156,
    isBestseller: false,
    isNew: true,
    readyToShip: true,
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    ],
    blouseOptions: ["Unstitched"],
    description:
      "Sheer ivory organza with delicate floral embroidery — ethereal for cocktail evenings.",
    care: "Dry Clean Only",
  },
  {
    id: "rs-004",
    name: "Emerald Green Georgette Sequined Saree",
    fabric: "Georgette",
    color: "Emerald",
    colorHex: "#046307",
    occasion: "Party",
    workType: "Embroidered",
    price: 3299,
    originalPrice: 5499,
    discountPercent: 40,
    rating: 4.4,
    reviewCount: 98,
    isBestseller: false,
    isNew: true,
    readyToShip: false,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
    ],
    blouseOptions: ["Unstitched"],
    description:
      "Fluid emerald georgette with shimmering sequin work for dazzling party nights.",
    care: "Dry Clean Only",
  },
  {
    id: "rs-005",
    name: "Royal Blue Chiffon Printed Saree",
    fabric: "Chiffon",
    color: "Royal Blue",
    colorHex: "#1E3A8A",
    occasion: "Casual",
    workType: "Printed",
    price: 1899,
    originalPrice: 2999,
    discountPercent: 37,
    rating: 4.3,
    reviewCount: 267,
    isBestseller: true,
    isNew: false,
    readyToShip: true,
    images: [
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80",
    ],
    blouseOptions: ["Unstitched"],
    description:
      "Lightweight royal blue chiffon with elegant prints — perfect for everyday elegance.",
    care: "Gentle Hand Wash / Dry Clean",
  },
  {
    id: "rs-006",
    name: "Blush Pink Chanderi Handloom Saree",
    fabric: "Chanderi",
    color: "Pink",
    colorHex: "#E8A0BF",
    occasion: "Festive",
    workType: "Handloom",
    price: 3799,
    originalPrice: 5299,
    discountPercent: 28,
    rating: 4.7,
    reviewCount: 142,
    isBestseller: false,
    isNew: false,
    readyToShip: true,
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
    ],
    blouseOptions: ["Unstitched"],
    description:
      "Soft blush pink Chanderi handloom with subtle gold checks and traditional charm.",
    care: "Dry Clean Only",
  },
  {
    id: "rs-007",
    name: "Classic Black Georgette Zari Border Saree",
    fabric: "Georgette",
    color: "Black",
    colorHex: "#1A1A1A",
    occasion: "Party",
    workType: "Zari",
    price: 2799,
    originalPrice: 4199,
    discountPercent: 33,
    rating: 4.5,
    reviewCount: 201,
    isBestseller: true,
    isNew: false,
    readyToShip: true,
    images: [
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    ],
    blouseOptions: ["Unstitched"],
    description:
      "Sleek black georgette with a refined zari border — evening-ready sophistication.",
    care: "Dry Clean Only",
  },
  {
    id: "rs-008",
    name: "Crimson Red Kanjeevaram Temple Border Saree",
    fabric: "Kanjeevaram Silk",
    color: "Red",
    colorHex: "#B91C1C",
    occasion: "Wedding",
    workType: "Zari",
    price: 11999,
    originalPrice: 15999,
    discountPercent: 25,
    rating: 4.9,
    reviewCount: 412,
    isBestseller: true,
    isNew: false,
    readyToShip: false,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
    ],
    blouseOptions: ["Unstitched"],
    description:
      "Heritage Kanjeevaram in crimson with temple borders — the quintessential wedding saree.",
    care: "Dry Clean Only",
  },
  {
    id: "rs-009",
    name: "Teal Organza Foil Printed Saree",
    fabric: "Organza",
    color: "Teal",
    colorHex: "#0F766E",
    occasion: "Festive",
    workType: "Printed",
    price: 2999,
    originalPrice: 4499,
    discountPercent: 33,
    rating: 4.2,
    reviewCount: 87,
    isBestseller: false,
    isNew: true,
    readyToShip: true,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
    ],
    blouseOptions: ["Unstitched"],
    description:
      "Teal organza with metallic foil prints that catch the light at every festive step.",
    care: "Dry Clean Only",
  },
  {
    id: "rs-010",
    name: "Gold Tissue Banarasi Weave Saree",
    fabric: "Banarasi",
    color: "Gold",
    colorHex: "#D4AF37",
    occasion: "Wedding",
    workType: "Zari",
    price: 7499,
    originalPrice: 9999,
    discountPercent: 25,
    rating: 4.7,
    reviewCount: 178,
    isBestseller: false,
    isNew: false,
    readyToShip: true,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    ],
    blouseOptions: ["Unstitched"],
    description:
      "Lustrous gold tissue Banarasi with classic weave patterns for bridal ensembles.",
    care: "Dry Clean Only",
  },
  {
    id: "rs-011",
    name: "Ivory Chanderi Embroidered Border Saree",
    fabric: "Chanderi",
    color: "Ivory",
    colorHex: "#FFFFF0",
    occasion: "Casual",
    workType: "Embroidered",
    price: 2599,
    originalPrice: 3899,
    discountPercent: 33,
    rating: 4.4,
    reviewCount: 124,
    isBestseller: false,
    isNew: true,
    readyToShip: true,
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80",
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
    ],
    blouseOptions: ["Unstitched"],
    description:
      "Breathable ivory Chanderi with embroidered borders — graceful for daytime occasions.",
    care: "Dry Clean Only",
  },
  {
    id: "rs-012",
    name: "Wine Maroon Chiffon Embroidered Saree",
    fabric: "Chiffon",
    color: "Maroon",
    colorHex: "#800020",
    occasion: "Festive",
    workType: "Embroidered",
    price: 2199,
    originalPrice: 3499,
    discountPercent: 37,
    rating: 4.6,
    reviewCount: 305,
    isBestseller: true,
    isNew: false,
    readyToShip: true,
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=80",
    ],
    blouseOptions: ["Unstitched"],
    description:
      "Wine maroon chiffon with fine embroidery — a festive essential for celebrations.",
    care: "Gentle Hand Wash / Dry Clean",
  },
];

export function getSareeById(id: string): Saree | undefined {
  return sarees.find((s) => s.id === id);
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
