"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Share2, X } from "lucide-react";

export function AndroidInstallHint() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isAndroid = /Android/i.test(ua);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS legacy
      window.navigator.standalone === true;
    const dismissed = sessionStorage.getItem("rs-android-hint") === "1";
    // Don't cover product sticky CTAs
    const onProduct = pathname?.startsWith("/product/");
    if (isAndroid && !isStandalone && !dismissed && !onProduct) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [pathname]);

  if (!show) return null;

  return (
    <div className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[45] rounded-lg border border-border bg-white p-3 shadow-lg sm:hidden">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
          <Share2 className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-charcoal">
            Install Virasat Sarees
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">
            Open in Chrome, tap the menu (⋮), then{" "}
            <span className="font-medium text-charcoal">Add to Home screen</span>{" "}
            for the Virasat Sarees app experience.
          </p>
        </div>
        <button
          type="button"
          className="flex h-9 w-9 shrink-0 items-center justify-center text-muted"
          aria-label="Dismiss"
          onClick={() => {
            sessionStorage.setItem("rs-android-hint", "1");
            setShow(false);
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
