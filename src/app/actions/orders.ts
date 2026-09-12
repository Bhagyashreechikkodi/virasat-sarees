"use server";

import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/admin";
import { isOrderStatus, type OrderStatus } from "@/lib/order-status";
import { last10Digits } from "@/lib/phone";

function generateOrderId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `RS-${n}`;
}

export async function placeOrder(input: {
  phone: string;
  channel: "whatsapp" | "call";
  items: { productId: string; name: string; quantity: number; price: number }[];
  subtotal: number;
}) {
  const phone = last10Digits(input.phone);
  if (phone.length !== 10) {
    return { ok: false as const, error: "Enter a valid 10-digit mobile number." };
  }
  if (!input.items.length) {
    return { ok: false as const, error: "Your bag is empty." };
  }

  try {
    let orderId = generateOrderId();
    for (let i = 0; i < 8; i++) {
      const exists = await prisma.order.findUnique({ where: { orderId } });
      if (!exists) break;
      orderId = generateOrderId();
    }

    const order = await prisma.order.create({
      data: {
        orderId,
        phone,
        status: "Placed",
        channel: input.channel,
        subtotal: input.subtotal,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return { ok: true as const, orderId: order.orderId };
  } catch {
    return {
      ok: false as const,
      error: "Could not save the order. You can still message us on WhatsApp.",
    };
  }
}

export async function trackOrder(orderIdRaw: string, phoneRaw: string) {
  const orderId = orderIdRaw.trim().toUpperCase();
  const phone = last10Digits(phoneRaw);
  if (!orderId || phone.length !== 10) {
    return { ok: false as const, error: "Enter your Order ID and 10-digit mobile number." };
  }

  try {
    const order = await prisma.order.findFirst({
      where: { orderId, phone },
      include: { items: true },
    });
    if (!order) {
      return {
        ok: false as const,
        error: "No order found for that ID and mobile number.",
      };
    }
    return {
      ok: true as const,
      order: {
        orderId: order.orderId,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: order.subtotal,
      },
    };
  } catch {
    return { ok: false as const, error: "Tracking is temporarily unavailable." };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  if (!(await isAdminAuthed())) {
    return { ok: false as const, error: "Unauthorized." };
  }
  if (!isOrderStatus(status)) {
    return { ok: false as const, error: "Invalid status." };
  }
  await prisma.order.update({
    where: { orderId },
    data: { status: status as OrderStatus },
  });
  return { ok: true as const };
}
