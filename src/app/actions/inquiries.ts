"use server";

import { prisma } from "@/lib/prisma";
import { last10Digits } from "@/lib/phone";

export async function submitBulkInquiry(formData: FormData) {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = last10Digits(String(formData.get("phone") ?? ""));
  const businessName = String(formData.get("businessName") ?? "").trim();
  const productsInterested = String(formData.get("productsInterested") ?? "").trim();
  const estimatedQuantity = String(formData.get("estimatedQuantity") ?? "").trim();
  const comments = String(formData.get("comments") ?? "").trim();

  if (!fullName || !email || phone.length !== 10 || !businessName) {
    return { ok: false as const, error: "Please fill name, email, phone, and business name." };
  }
  if (!productsInterested) {
    return { ok: false as const, error: "Select the products you are interested in." };
  }

  try {
    await prisma.bulkInquiry.create({
      data: {
        fullName,
        email,
        phone,
        businessName,
        productsInterested,
        estimatedQuantity,
        comments,
      },
    });
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "Could not submit enquiry. Please call us instead." };
  }
}
