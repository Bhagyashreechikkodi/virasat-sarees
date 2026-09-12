"use client";

import { ChevronDown, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  COLORS,
  FABRICS,
  OCCASIONS,
  WORK_TYPES,
  type Fabric,
  type Occasion,
  type Saree,
  type WorkType,
} from "@/data/sarees";
import { useScrollLock } from "@/hooks/useScrollLock";

export interface Filters {
  fabrics: Fabric[];
  colors: string[];
  occasions: Occasion[];
  workTypes: WorkType[];
  maxPrice: number;
}

export const DEFAULT_FILTERS: Filters = {
  fabrics: [],
  colors: [],
  occasions: [],
  workTypes: [],
  maxPrice: 16000,
};

interface FilterSidebarProps {
  catalog: Saree[];
  filters: Filters;
  onChange: (next: Filters) => void;
  onClear: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-3.5">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-[11px] font-light uppercase tracking-[0.22em] text-charcoal">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-3 space-y-1.5">{children}</div>}
    </div>
  );
}

function toggleIn<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

export function FilterSidebar({
  catalog,
  filters,
  onChange,
  onClear,
  mobileOpen,
  onMobileClose,
}: FilterSidebarProps) {
  const countBy = (pred: (s: Saree) => boolean) => catalog.filter(pred).length;
  useScrollLock(!!mobileOpen);
  const [colorExpanded, setColorExpanded] = useState(false);
  const [fabricExpanded, setFabricExpanded] = useState(false);

  const colorOptions = useMemo(() => {
    return COLORS.map((c) => ({
      ...c,
      count: catalog.filter((s) => s.color === c.name).length,
    })).filter((c) => c.count > 0);
  }, [catalog]);

  const fabricOptions = useMemo(() => {
    return FABRICS.map((fabric) => ({
      fabric,
      count: catalog.filter((s) => s.fabric === fabric).length,
    })).filter((f) => f.count > 0);
  }, [catalog]);

  const visibleColors = colorExpanded ? colorOptions : colorOptions.slice(0, 6);
  const visibleFabrics = fabricExpanded
    ? fabricOptions
    : fabricOptions.slice(0, 5);

  const content = (
    <div className="flex h-full flex-col">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-[12px] font-light uppercase tracking-[0.28em] text-charcoal">
          Filter
        </h2>
        {onMobileClose && (
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center lg:hidden"
            onClick={onMobileClose}
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <Section title="Size">
          <p className="py-1.5 text-[13px] font-light text-muted">
            Free size — unstitched blouse piece included
          </p>
        </Section>

        <Section title="Fabric">
          {visibleFabrics.map(({ fabric, count }) => (
            <label
              key={fabric}
              className="flex cursor-pointer items-center gap-2 py-1.5 text-[13px]"
            >
              <input
                type="checkbox"
                checked={filters.fabrics.includes(fabric)}
                onChange={() =>
                  onChange({
                    ...filters,
                    fabrics: toggleIn(filters.fabrics, fabric),
                  })
                }
                className="h-4 w-4 accent-burgundy"
              />
              <span className="flex-1">{fabric}</span>
              <span className="text-xs text-muted">({count})</span>
            </label>
          ))}
          {fabricOptions.length > 5 && (
            <button
              type="button"
              className="pt-1 text-xs font-medium text-burgundy"
              onClick={() => setFabricExpanded((v) => !v)}
            >
              {fabricExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </Section>

        <Section title="Colors">
          <div className="flex flex-col gap-2">
            {visibleColors.map((c) => {
              const active = filters.colors.includes(c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      colors: toggleIn(filters.colors, c.name),
                    })
                  }
                  className="flex min-h-11 items-center gap-2.5 text-left"
                >
                  <span
                    className={`h-6 w-6 shrink-0 rounded-full border ${
                      active ? "border-charcoal ring-1 ring-charcoal" : "border-border"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-hidden
                  />
                  <span className={`flex-1 text-[13px] ${active ? "font-semibold" : ""}`}>
                    {c.name}
                  </span>
                  <span className="text-xs text-muted">({c.count})</span>
                </button>
              );
            })}
          </div>
          {colorOptions.length > 6 && (
            <button
              type="button"
              className="pt-1 text-xs font-medium text-burgundy"
              onClick={() => setColorExpanded((v) => !v)}
            >
              {colorExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </Section>

        <Section title="Occasion">
          {OCCASIONS.map((o) => {
            const count = countBy((s) => s.occasion === o);
            return (
              <label
                key={o}
                className="flex cursor-pointer items-center gap-2 py-1.5 text-[13px]"
              >
                <input
                  type="checkbox"
                  checked={filters.occasions.includes(o)}
                  onChange={() =>
                    onChange({
                      ...filters,
                      occasions: toggleIn(filters.occasions, o),
                    })
                  }
                  className="h-4 w-4 accent-burgundy"
                />
                <span className="flex-1">{o} Wear</span>
                <span className="text-xs text-muted">({count})</span>
              </label>
            );
          })}
        </Section>

        <Section title="Pattern and Print">
          {WORK_TYPES.map((w) => {
            const count = countBy((s) => s.workType === w);
            return (
              <label
                key={w}
                className="flex cursor-pointer items-center gap-2 py-1.5 text-[13px]"
              >
                <input
                  type="checkbox"
                  checked={filters.workTypes.includes(w)}
                  onChange={() =>
                    onChange({
                      ...filters,
                      workTypes: toggleIn(filters.workTypes, w),
                    })
                  }
                  className="h-4 w-4 accent-burgundy"
                />
                <span className="flex-1">{w}</span>
                <span className="text-xs text-muted">({count})</span>
              </label>
            );
          })}
        </Section>

        <Section title="Price">
          <input
            type="range"
            min={1500}
            max={16000}
            step={100}
            value={filters.maxPrice}
            onChange={(e) =>
              onChange({ ...filters, maxPrice: Number(e.target.value) })
            }
            className="w-full"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>₹1,500</span>
            <span>Up to ₹{filters.maxPrice.toLocaleString("en-IN")}</span>
          </div>
        </Section>
      </div>

      <div className="sticky bottom-0 mt-4 flex gap-2 border-t border-border bg-paper pt-3">
        <button
          type="button"
          onClick={onClear}
          className="h-11 flex-1 border border-border text-sm font-medium"
        >
          Clear All
        </button>
        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="h-11 flex-1 bg-burgundy text-sm font-medium text-white lg:hidden"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden w-[240px] shrink-0 lg:block">{content}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close filters"
            onClick={onMobileClose}
          />
          <div className="android-drawer absolute right-0 top-0 flex w-full max-w-sm flex-col bg-paper p-4 shadow-xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
