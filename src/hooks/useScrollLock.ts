"use client";

import { useEffect } from "react";

let lockCount = 0;

function applyLock() {
  if (typeof document === "undefined") return;
  document.body.style.overflow = lockCount > 0 ? "hidden" : "";
}

/** Ref-counted body scroll lock — safe when multiple overlays open */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lockCount += 1;
    applyLock();
    return () => {
      lockCount = Math.max(0, lockCount - 1);
      applyLock();
    };
  }, [locked]);
}
