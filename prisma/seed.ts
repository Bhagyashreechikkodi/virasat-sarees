import { PrismaClient } from "../src/generated/prisma";
import { sarees } from "../src/data/sarees";

const prisma = new PrismaClient();

async function main() {
  for (const saree of sarees) {
    await prisma.product.upsert({
      where: { id: saree.id },
      update: {},
      create: {
        id: saree.id,
        name: saree.name,
        description: saree.description,
        fabric: saree.fabric,
        color: saree.color,
        colorHex: saree.colorHex,
        occasion: saree.occasion,
        workType: saree.workType,
        price: saree.price,
        originalPrice: saree.originalPrice,
        discountPercent: saree.discountPercent,
        rating: saree.rating,
        reviewCount: saree.reviewCount,
        isBestseller: saree.isBestseller,
        isNew: saree.isNew,
        readyToShip: saree.readyToShip,
        images: JSON.stringify(saree.images),
        videos: JSON.stringify(saree.videos ?? []),
        category: saree.category ?? "Sarees",
        blouseOptions: JSON.stringify(saree.blouseOptions),
        care: saree.care,
      },
    });
  }

  const reviewCount = await prisma.review.count();
  if (reviewCount === 0) {
    const { DEFAULT_CUSTOMER_REVIEWS } = await import("../src/data/default-reviews");
    await prisma.review.createMany({
      data: DEFAULT_CUSTOMER_REVIEWS.map((review) => ({
        productId: null,
        author: review.author,
        text: review.text,
        rating: review.rating,
        source: "customer",
      })),
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
