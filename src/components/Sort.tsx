"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { parseQuery, setParam, makeUrl } from "@/lib/utils/query";

const OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price (Low → High)", value: "price_asc" },
  { label: "Price (High → Low)", value: "price_desc" },
];

export default function Sort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(() => parseQuery(searchParams.toString()), [searchParams]);
  const current = (params["sort"] as string) || "featured";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = { ...params };
    setParam(next, "sort", e.target.value);
    setParam(next, "page", 1);
    router.push(makeUrl(pathname, next), { scroll: false });
  }

  return (
    <label className="inline-flex items-center gap-2 text-body-medium">
      <span className="hidden sm:inline">Sort by</span>
      <select
        aria-label="Sort products"
        className="rounded-md border border-light-300 bg-light-100 px-3 py-2 text-body focus:outline-none focus:ring-2 focus:ring-dark-500"
        value={current}
        onChange={onChange}
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
