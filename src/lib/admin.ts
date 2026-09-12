import { cookies } from "next/headers";
import { last10Digits } from "@/lib/phone";

export const ADMIN_COOKIE = "rs_admin";

function readEnv(name: string): string {
  // Bracket access + trim avoids CRLF / quoted leftover mismatches on Windows.
  return String(process.env[name] ?? "").trim();
}

function adminPhones(): string[] {
  const raw = readEnv("ADMIN_PHONES") || readEnv("ADMIN_PHONE");
  const phones = raw
    .split(/[,\s]+/)
    .map((part) => last10Digits(part))
    .filter((digits) => digits.length === 10);
  return [...new Set(phones)];
}

function adminPassword(): string {
  return readEnv("ADMIN_PASSWORD");
}

export function adminCredentialsConfigured(): boolean {
  return adminPhones().length > 0 && Boolean(adminPassword());
}

export function credentialsMatch(phone: string, password: string): boolean {
  const phones = adminPhones();
  const expectedPassword = adminPassword();
  if (!phones.length || !expectedPassword) return false;
  const digits = last10Digits(phone);
  return phones.includes(digits) && password.trim() === expectedPassword;
}

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === "1";
}

export async function requireAdmin(): Promise<boolean> {
  return isAdminAuthed();
}
