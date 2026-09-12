"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  name: string;
  phone: string;
}

interface AuthState {
  user: AuthUser | null;
  login: (
    phone: string,
    password: string,
    name?: string
  ) => { ok: boolean; error?: string };
  logout: () => void;
  isLoggedIn: () => boolean;
}

function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  // Accept 10-digit Indian mobile, or 12-digit with 91 prefix
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  return digits;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (phone, password, name) => {
        const normalized = normalizePhone(phone);
        if (!/^[6-9]\d{9}$/.test(normalized)) {
          return {
            ok: false,
            error: "Enter a valid 10-digit Indian mobile number.",
          };
        }
        if (password.length < 6) {
          return { ok: false, error: "Password must be at least 6 characters." };
        }
        set({
          user: {
            phone: normalized,
            name: name?.trim() || `User ${normalized.slice(-4)}`,
          },
        });
        return { ok: true };
      },
      logout: () => set({ user: null }),
      isLoggedIn: () => !!get().user,
    }),
    { name: "royal-silks-auth-v2" }
  )
);
