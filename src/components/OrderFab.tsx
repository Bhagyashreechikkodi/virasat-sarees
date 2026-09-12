"use client";

import { useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import {
  formatPhoneDisplay,
  ORDER_STATUS_WHATSAPP_TEXT,
  STORE_PHONES,
  telHref,
  whatsappHref,
} from "@/data/contact";
import { useScrollLock } from "@/hooks/useScrollLock";

export function OrderFab() {
  const [open, setOpen] = useState<"whatsapp" | "call" | null>(null);
  useScrollLock(open !== null);

  return (
    <>
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-3 z-[70] flex flex-col gap-2 sm:right-5">
        <button
          type="button"
          aria-label="Order on WhatsApp"
          onClick={() => setOpen("whatsapp")}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20"
        >
          <MessageCircle className="h-5 w-5 fill-white" />
        </button>
        <button
          type="button"
          aria-label="Call the store"
          onClick={() => setOpen("call")}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-burgundy text-white shadow-lg shadow-black/20"
        >
          <Phone className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Close"
            onClick={() => setOpen(null)}
          />
          <div className="android-drawer absolute bottom-0 left-0 right-0 mx-auto w-full max-w-md rounded-t-2xl bg-cream px-5 pb-8 pt-4 shadow-2xl sm:bottom-8 sm:rounded-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-rose">
                  Virasat Sarees
                </p>
                <h3 className="mt-1 font-serif text-2xl text-charcoal">
                  {open === "whatsapp" ? "WhatsApp order" : "Call the store"}
                </h3>
              </div>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center"
                aria-label="Close"
                onClick={() => setOpen(null)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-muted">
              Choose a number to {open === "whatsapp" ? "continue on WhatsApp" : "place the call"}.
            </p>
            <ul className="mt-4 space-y-2">
              {STORE_PHONES.map((phone) => (
                <li key={phone}>
                  <a
                    href={
                      open === "whatsapp"
                        ? whatsappHref(ORDER_STATUS_WHATSAPP_TEXT, phone)
                        : telHref(phone)
                    }
                    target={open === "whatsapp" ? "_blank" : undefined}
                    rel={open === "whatsapp" ? "noopener noreferrer" : undefined}
                    className="flex h-12 items-center justify-between border border-border bg-white px-4 text-sm font-medium text-charcoal"
                    onClick={() => setOpen(null)}
                  >
                    <span>{formatPhoneDisplay(phone)}</span>
                    <span className="text-[11px] uppercase tracking-wide text-burgundy">
                      {open === "whatsapp" ? "Chat" : "Call"}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
