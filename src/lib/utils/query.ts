import qs from "query-string";

export type QueryValue = string | number | boolean | null | undefined;
export type QueryRecord = Record<string, QueryValue | QueryValue[]>

// Parse search string into an object with arrays for repeated keys
export function parseQuery(search: string) {
  const parsed = qs.parse(search, { arrayFormat: "comma", parseBooleans: true, parseNumbers: true });
  return parsed as Record<string, any>;
}

export function stringifyQuery(obj: Record<string, any>) {
  return qs.stringify(obj, { arrayFormat: "comma", skipNull: true, skipEmptyString: true });
}

// Toggle a value inside an array param (multi-select)
export function toggleArrayParam(params: Record<string, any>, key: string, value: string) {
  const current = new Set<string>(
    (Array.isArray(params[key]) ? params[key] : params[key] ? [params[key]] : []) as string[]
  );
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
