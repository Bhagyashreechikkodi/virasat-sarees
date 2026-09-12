import { isAdminAuthed } from "@/lib/admin";
import { getPendingMedia } from "@/lib/pending-media";
import { getProducts } from "@/lib/products";
import { getAllReviews } from "@/lib/reviews";
import { prisma } from "@/lib/prisma";
import { AdminDashboard, AdminLogin } from "./AdminApp";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin | Virasat Sarees",
};

export default async function AdminPage() {
  const authed = await isAdminAuthed();
  if (!authed) return <AdminLogin />;

  const products = await getProducts();
  const reviews = await getAllReviews();
  const pendingMedia = await getPendingMedia();
  let orders: {
    orderId: string;
    phone: string;
    status: string;
    channel: string;
    subtotal: number;
    createdAt: string;
    items: { name: string; quantity: number }[];
  }[] = [];
  let inquiries: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    businessName: string;
    productsInterested: string;
    estimatedQuantity: string;
    comments: string;
    createdAt: string;
  }[] = [];

  try {
    const [orderRows, inquiryRows] = await Promise.all([
      prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.bulkInquiry.findMany({ orderBy: { createdAt: "desc" } }),
    ]);
    orders = orderRows.map((o) => ({
      orderId: o.orderId,
      phone: o.phone,
      status: o.status,
      channel: o.channel,
      subtotal: o.subtotal,
      createdAt: o.createdAt.toISOString(),
      items: o.items.map((i) => ({ name: i.name, quantity: i.quantity })),
    }));
    inquiries = inquiryRows.map((i) => ({
      id: i.id,
      fullName: i.fullName,
      email: i.email,
      phone: i.phone,
      businessName: i.businessName,
      productsInterested: i.productsInterested,
      estimatedQuantity: i.estimatedQuantity,
      comments: i.comments,
      createdAt: i.createdAt.toISOString(),
    }));
  } catch {
    // Dashboard still lists products from fallback catalog.
  }

  return (
    <AdminDashboard
      products={products}
      orders={orders}
      inquiries={inquiries}
      reviews={reviews}
      pendingMedia={pendingMedia}
    />
  );
}
