"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { isAdminAuthed } from "@/lib/admin";
import {
  cloudinaryConfigured,
  uploadBufferToCloudinary,
} from "@/lib/cloudinary";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".m4v"]);

function safeExt(name: string) {
  const ext = path.extname(name).toLowerCase();
  return ext.length <= 8 ? ext : "";
}

export async function uploadProductMedia(formData: FormData) {
  if (!(await isAdminAuthed())) {
    return { ok: false as const, error: "Unauthorized." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "Choose a file to upload." };
  }

  const ext = safeExt(file.name);
  const kind = formData.get("kind") === "video" ? "video" : "image";
  if (kind === "image" && !IMAGE_EXT.has(ext)) {
    return { ok: false as const, error: "Use jpg, png, webp, gif, or avif." };
  }
  if (kind === "video" && !VIDEO_EXT.has(ext)) {
    return { ok: false as const, error: "Use mp4, webm, mov, or m4v." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (cloudinaryConfigured()) {
    try {
      const uploaded = await uploadBufferToCloudinary(buffer, {
        resourceType: kind,
        filename: file.name,
      });
      return { ok: true as const, url: uploaded.secure_url };
    } catch {
      return {
        ok: false as const,
        error: "Cloudinary upload failed. Check credentials or paste a URL instead.",
      };
    }
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const filename = `${randomUUID()}${ext}`;
  await writeFile(path.join(dir, filename), buffer);

  return { ok: true as const, url: `/uploads/${filename}` };
}
