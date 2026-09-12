"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthed } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function dismissPendingMedia(id: string) {
  if (!(await isAdminAuthed())) {
    return { ok: false as const, error: "Unauthorized." };
  }
  await prisma.mediaUpload.delete({ where: { id } }).catch(() => undefined);
  revalidatePath("/admin");
  return { ok: true as const };
}
