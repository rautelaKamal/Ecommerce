import qs from "query-string";

export type QueryValue = string | number | boolean | null | undefined;
export type QueryRecord = Record<string, QueryValue | QueryValue[]>

// Parse search string into an object with arrays for repeated keys
export function parseQuery(search: string) {
  const parsed = qs.parse(search, { arrayFormat: "comma", parseBooleans: true });
  return parsed as Record<string, any>;
}

export function stringifyQuery(obj: Record<string, any>) {
  return qs.stringify(obj, { arrayFormat: "comma", skipNull: true, skipEmptyString: true });
}

// Toggle a value inside an array param (multi-select)
export function toggleArrayParam(params: Record<string, any>, key: string, value: string) {
  const raw = Array.isArray(params[key]) ? params[key] : params[key] ? [params[key]] : [];
  const current = new Set<string>(raw.map((v: any) => String(v)) as string[]);
  if (current.has(value)) current.delete(value); else current.add(value);
  const arr = Array.from(current);
  if (arr.length === 0) delete params[key]; else params[key] = arr;
  return params;
}

export function setParam(params: Record<string, any>, key: string, value: QueryValue | QueryValue[]) {
  if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
    delete params[key];
  } else {
    params[key] = value;
  }
  return params;
}

export function removeParam(params: Record<string, any>, key: string) {
  delete params[key];
  return params;
}

export function makeUrl(pathname: string, params: Record<string, any>) {
  const query = stringifyQuery(params);
  return query ? `${pathname}?${query}` : pathname;
}

// -------- High-level filters for server actions ---------

export type ParsedFilters = {
  search?: string;
  gender?: string[];
  color?: string[];
  size?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: "featured" | "latest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
};

function toArray(v: unknown): string[] | undefined {
  if (v === undefined || v === null) return undefined;
  const arr = Array.isArray(v) ? v : [v];
  const out = arr.map((x) => String(x)).filter(Boolean);
  return out.length ? out : undefined;
}

export function parseFilterParams(input: Record<string, unknown>): ParsedFilters {
  const gender = toArray(input.gender);
  const color = toArray(input.color);
  const size = toArray(input.size);

  // Price can come as explicit numbers or as range tags in `price` (e.g., "0-4999").
  let priceMin = input.priceMin !== undefined ? Number(input.priceMin) : undefined;
  let priceMax = input.priceMax !== undefined ? Number(input.priceMax) : undefined;
  const ranges = toArray(input.price);
  if (ranges && ranges.length) {
    let min = Number.POSITIVE_INFINITY;
    let max = 0;
    for (const r of ranges) {
      const [a, b] = r.split("-").map((n) => Number(n));
      if (!isNaN(a)) min = Math.min(min, a);
      if (!isNaN(b)) max = Math.max(max, b);
    }
    if (min !== Number.POSITIVE_INFINITY) priceMin = min;
    if (max > 0) priceMax = max;
  }

  const sortByRaw = (input.sort || input.sortBy) as string | undefined;
  const sortBy: ParsedFilters["sortBy"] =
    sortByRaw === "price_asc" || sortByRaw === "price_desc" || sortByRaw === "featured"
      ? sortByRaw
      : sortByRaw === "newest"
      ? "latest"
      : undefined;

  const page = input.page !== undefined ? Math.max(1, Number(input.page)) : undefined;
  const limit = input.limit !== undefined ? Math.max(1, Math.min(24, Number(input.limit))) : undefined;

  const search = input.search ? String(input.search) : undefined;

  return { search, gender, color, size, priceMin, priceMax, sortBy, page, limit };
}
