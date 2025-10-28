"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { parseQuery, toggleArrayParam, setParam, makeUrl } from "@/lib/utils/query";

type Option = { label: string; value: string; swatch?: string };

const GENDERS: Option[] = [
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Unisex", value: "unisex" },
];

const SIZES: Option[] = [
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "10", value: "10" },
  { label: "11", value: "11" },
  { label: "12", value: "12" },
];

const COLORS: Option[] = [
  { label: "Black", value: "black", swatch: "#000000" },
  { label: "White", value: "white", swatch: "#ffffff" },
  { label: "Red", value: "red", swatch: "#ef4444" },
  { label: "Blue", value: "blue", swatch: "#1e40af" },
  { label: "Green", value: "green", swatch: "#10b981" },
  { label: "Grey", value: "gray", swatch: "#6b7280" },
];

const PRICES: Option[] = [
  { label: "₹0 – ₹4,999", value: "0-4999" },
  { label: "₹5,000 – ₹9,999", value: "5000-9999" },
  { label: "₹10,000 – ₹14,999", value: "10000-14999" },
  { label: "₹15,000+", value: "15000-100000" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="border-b border-light-300 py-4">
      <button
        className="flex w-full items-center justify-between text-heading-4 text-dark-900"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className="text-body">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </section>
  );
}

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawer, setDrawer] = useState(false);

  const params = useMemo(() => parseQuery(searchParams.toString()), [searchParams]);

  const pushParams = useCallback(
    (next: Record<string, any>) => {
      const url = makeUrl(pathname, next);
      router.push(url, { scroll: false });
    },
    [pathname, router]
  );

  const toggle = (key: string, value: string) => {
    const next = toggleArrayParam({ ...params }, key, value);
    setParam(next, "page", 1); // reset pagination
    pushParams(next);
  };

  const isChecked = (key: string, value: string) => {
    const v = params[key];
    if (!v) return false;
    return Array.isArray(v) ? v.includes(value) : v === value;
  };

  const clearAll = () => pushParams({});

  return (
    <>
      {/* Mobile trigger */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <button
          onClick={() => setDrawer(true)}
          className="rounded-md bg-light-200 px-3 py-2 text-body-medium ring-1 ring-light-300"
          aria-haspopup="dialog"
        >
          Filters
        </button>
      </div>

      {/* Sidebar */}
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-20 rounded-xl bg-light-100 p-4 ring-1 ring-light-300">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-heading-3">Filters</h2>
            <button onClick={clearAll} className="text-caption text-dark-600 underline">Clear</button>
          </div>
          <Section title="Gender">
            {GENDERS.map((o) => (
              <label key={o.value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-dark-900"
                  checked={isChecked("gender", o.value)}
                  onChange={() => toggle("gender", o.value)}
                />
                <span className="text-body">{o.label}</span>
              </label>
            ))}
          </Section>
          <Section title="Size">
            {SIZES.map((o) => (
              <label key={o.value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-dark-900"
                  checked={isChecked("size", o.value)}
                  onChange={() => toggle("size", o.value)}
                />
                <span className="text-body">{o.label}</span>
              </label>
            ))}
          </Section>
          <Section title="Color">
            {COLORS.map((o) => (
              <label key={o.value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-dark-900"
                  checked={isChecked("color", o.value)}
                  onChange={() => toggle("color", o.value)}
                />
                <span className="inline-flex items-center gap-2 text-body">
                  {o.swatch && (
                    <span className="inline-block h-3 w-3 rounded-full ring-1 ring-light-400" style={{ backgroundColor: o.swatch }} />
                  )}
                  {o.label}
                </span>
              </label>
            ))}
          </Section>
          <Section title="Price Range">
            {PRICES.map((o) => (
              <label key={o.value} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-dark-900"
                  checked={isChecked("price", o.value)}
                  onChange={() => toggle("price", o.value)}
                />
                <span className="text-body">{o.label}</span>
              </label>
            ))}
          </Section>
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal>
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-light-100 p-4 ring-1 ring-light-300">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-heading-3">Filters</h2>
              <button onClick={() => setDrawer(false)} className="text-body">Close</button>
            </div>
            <div className="h-[80vh] overflow-y-auto pr-2">
              {/* Reuse the same groups */}
              <Section title="Gender">
                {GENDERS.map((o) => (
                  <label key={o.value} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-dark-900"
                      checked={isChecked("gender", o.value)}
                      onChange={() => toggle("gender", o.value)}
                    />
                    <span className="text-body">{o.label}</span>
                  </label>
                ))}
              </Section>
              <Section title="Size">
                {SIZES.map((o) => (
                  <label key={o.value} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-dark-900"
                      checked={isChecked("size", o.value)}
                      onChange={() => toggle("size", o.value)}
                    />
                    <span className="text-body">{o.label}</span>
                  </label>
                ))}
              </Section>
              <Section title="Color">
                {COLORS.map((o) => (
                  <label key={o.value} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-dark-900"
                      checked={isChecked("color", o.value)}
                      onChange={() => toggle("color", o.value)}
                    />
                    <span className="inline-flex items-center gap-2 text-body">
                      {o.swatch && (
                        <span className="inline-block h-3 w-3 rounded-full ring-1 ring-light-400" style={{ backgroundColor: o.swatch }} />
                      )}
                      {o.label}
                    </span>
                  </label>
                ))}
              </Section>
              <Section title="Price Range">
                {PRICES.map((o) => (
                  <label key={o.value} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-dark-900"
                      checked={isChecked("price", o.value)}
                      onChange={() => toggle("price", o.value)}
                    />
                    <span className="text-body">{o.label}</span>
                  </label>
                ))}
              </Section>
            </div>
            <button onClick={() => setDrawer(false)} className="mt-3 w-full rounded-md bg-dark-900 py-2 text-body-medium text-light-100">Apply</button>
          </div>
        </div>
      )}
    </>
  );
}
