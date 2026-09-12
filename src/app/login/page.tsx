"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Eye, EyeOff, Lock, Phone, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const existing = useAuthStore((s) => s.user);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = login(
      phone,
      password,
      mode === "register" ? name : undefined
    );
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Unable to sign in.");
      return;
    }
    router.push("/sarees");
  };

  if (existing) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
        <p className="font-serif text-3xl font-medium text-burgundy">Welcome back</p>
        <p className="mt-2 text-sm text-muted">
          You&apos;re signed in as{" "}
          <span className="font-medium text-charcoal">{existing.name}</span> (+91{" "}
          {existing.phone})
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/sarees"
            className="bg-burgundy px-6 py-3 text-xs font-semibold tracking-[0.14em] text-white"
          >
            CONTINUE SHOPPING
          </Link>
          <Link
            href="/wishlist"
            className="border border-burgundy px-6 py-3 text-xs font-semibold tracking-[0.14em] text-burgundy"
          >
            VIEW WISHLIST
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[75vh] overflow-hidden bg-cream">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 20%, rgba(92,29,42,0.08), transparent 42%), radial-gradient(circle at 82% 78%, rgba(181,109,94,0.14), transparent 36%)",
        }}
      />
      <div className="relative mx-auto grid max-w-5xl gap-0 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div className="hidden flex-col justify-center bg-burgundy-deep px-10 py-16 text-white lg:flex">
          <p className="text-[11px] uppercase tracking-[0.28em] text-rose/80">
            Athani · Belagavi
          </p>
          <p className="mt-3 font-serif text-4xl font-medium tracking-tight text-paper">
            Virasat Sarees
          </p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
            Sign in with your mobile number to save favourites and manage
            orders easily.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/65">
            <li>Sync wishlist across devices</li>
            <li>Faster order confirmation</li>
            <li>Early access to sale edits</li>
          </ul>
        </div>

        <div className="border border-border bg-paper px-6 py-10 sm:px-10 lg:py-16">
          <h1 className="font-serif text-3xl font-medium text-charcoal">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {mode === "login"
              ? "Sign in with your phone number and password."
              : "Join Virasat Sarees using your mobile number."}
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {mode === "register" && (
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold tracking-wide uppercase text-muted">
                  Full name
                </span>
                <div className="flex items-center gap-2 border border-border px-3 py-2.5">
                  <User className="h-4 w-4 text-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="w-full text-sm outline-none"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold tracking-wide uppercase text-muted">
                Phone number
              </span>
              <div className="flex items-center gap-2 border border-border px-3 py-2.5">
                <Phone className="h-4 w-4 text-muted" />
                <span className="text-sm text-muted">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  required
                  placeholder="10-digit mobile number"
                  className="w-full text-sm outline-none"
                  autoComplete="tel"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold tracking-wide uppercase text-muted">
                Password
              </span>
              <div className="flex items-center gap-2 border border-border px-3 py-2.5">
                <Lock className="h-4 w-4 text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full text-sm outline-none"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-muted hover:text-charcoal"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>

            {error && (
              <p className="text-sm text-burgundy" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-burgundy py-3.5 text-xs font-semibold tracking-[0.16em] text-white hover:bg-burgundy/90 disabled:opacity-60"
            >
              {loading
                ? "PLEASE WAIT…"
                : mode === "login"
                  ? "SIGN IN"
                  : "CREATE ACCOUNT"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  className="font-medium text-burgundy hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already a member?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="font-medium text-burgundy hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
