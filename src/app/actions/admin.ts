"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  ADMIN_COOKIE,
  adminCredentialsConfigured,
  credentialsMatch,
} from "@/lib/admin";
import { last10Digits } from "@/lib/phone";

export async function adminLogin(
  _prev: { ok: true } | { ok: false; error: string } | null,
  formData: FormData,
) {
  const phone = last10Digits(String(formData.get("phone") ?? ""));
  const password = String(formData.get("password") ?? "").trim();

  if (!adminCredentialsConfigured()) {
    return {
      ok: false as const,
      error:
        "Admin credentials are not loaded. Add ADMIN_PHONES and ADMIN_PASSWORD to .env.local and restart npm run dev.",
    };
  }

  if (!credentialsMatch(phone, password)) {
    return { ok: false as const, error: "Invalid phone or password." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function adminLogout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  revalidatePath("/admin");
}
