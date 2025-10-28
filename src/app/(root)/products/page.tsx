import Filters from "@/src/components/Filters";
import Sort from "@/src/components/Sort";
import Card from "@/src/components/Card";

export const dynamic = "force-dynamic";

// Mocked product dataset. Mirrors schema-ish fields and aligns with /public/shoes assets.
// Prices in INR (rupees). We'll pass string prices so Card doesn't add $.
const MOCK_PRODUCTS = [
  {
    id: "p1",
    name: "Nike Air Max 1",
    gender: "men",
    colors: ["black", "white", "red"],
    sizes: ["7", "8", "9", "10"],
    price: 9999,
    image: "/shoes/shoe-1.jpg",
    createdAt: new Date("2025-01-02"),
  },
  {
    id: "p2",
    name: "Nike Court Vision Low",
    gender: "women",
    colors: ["blue", "white"],
    sizes: ["6", "7", "8", "9", "10"].filter(Boolean) as string[],
    price: 7999,
    image: "/shoes/shoe-2.webp",
    createdAt: new Date("2025-02-12"),
  },
  {
    id: "p3",
    name: "Nike Air Max SYSTM",
    gender: "unisex",
    colors: ["red", "gray"],
    sizes: ["8", "9", "10", "11"],
    price: 11999,
    image: "/shoes/shoe-3.webp",
    createdAt: new Date("2025-03-20"),
  },
  {
    id: "p4",
    name: "Nike Air Force 1",
    gender: "men",
    colors: ["white", "green"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    price: 12999,
    image: "/shoes/shoe-4.webp",
    createdAt: new Date("2025-03-25"),
  },
  {
    id: "p5",
    name: "Nike ZoomX Vaporfly",
    gender: "women",
    colors: ["green", "blue"],
    sizes: ["7", "8", "9"],
    price: 15999,
    image: "/shoes/shoe-5.avif",
    createdAt: new Date("2025-04-03"),
  },
  {
    id: "p6",
    name: "Nike Legend Essential",
    gender: "unisex",
    colors: ["gray", "black"],
    sizes: ["8", "9", "10"],
    price: 5499,
    image: "/shoes/shoe-6.avif",
    createdAt: new Date("2025-01-28"),
  },
  {
    id: "p7",
    name: "Nike Blazer Low '77",
    gender: "women",
    colors: ["blue", "white"],
    sizes: ["6", "7", "8", "9"].filter(Boolean) as string[],
    price: 8999,
    image: "/shoes/shoe-7.avif",
    createdAt: new Date("2025-02-05"),
  },
  {
    id: "p8",
    name: "Nike Dunk Low Retro",
    gender: "men",
    colors: ["green", "yellow", "white"],
    sizes: ["7", "8", "9", "10"],
    price: 10999,
    image: "/shoes/shoe-8.avif",
    createdAt: new Date("2025-02-20"),
  },
];

function inRange(price: number, range: string) {
  const [min, max] = range.split("-").map((n) => Number(n));
  return price >= (min || 0) && price <= (max || Number.MAX_SAFE_INTEGER);
}

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function applyFilters(list: typeof MOCK_PRODUCTS, params: Record<string, any>) {
  let out = [...list];
  const genders = (params.gender ? (Array.isArray(params.gender) ? params.gender : [params.gender]) : []) as string[];
  const colors = (params.color ? (Array.isArray(params.color) ? params.color : [params.color]) : []) as string[];
  const sizes = (params.size ? (Array.isArray(params.size) ? params.size : [params.size]) : []) as string[];
  const prices = (params.price ? (Array.isArray(params.price) ? params.price : [params.price]) : []) as string[];

  if (genders.length) out = out.filter((p) => genders.includes(p.gender));
  if (colors.length) out = out.filter((p) => colors.some((c) => p.colors.includes(c)));
  if (sizes.length) out = out.filter((p) => sizes.some((s) => p.sizes.includes(s)));
  if (prices.length) out = out.filter((p) => prices.some((r) => inRange(p.price, r)));

  const sort = (params.sort as string) || "featured";
  if (sort === "price_asc") out.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") out.sort((a, b) => b.price - a.price);
  else if (sort === "newest") out.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  // featured = leave order as is

  return out;
}

function ActiveBadges({ params }: { params: Record<string, any> }) {
  const entries: string[] = [];
  const add = (label: string) => entries.push(label);
  const listy = (v: unknown) => (Array.isArray(v) ? v : v ? [v] : []);
  listy(params.gender).forEach((g) => add(String(g)));
  listy(params.color).forEach((c) => add(String(c)));
  listy(params.size).forEach((s) => add(`Size: ${s}`));
  listy(params.price).forEach((r) => add(`₹${r.replace("-", "–₹")}`));
  if (!entries.length) return null;
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {entries.map((e, i) => (
        <span key={i} className="rounded-full bg-light-200 px-3 py-1 text-caption ring-1 ring-light-300">
          {e}
        </span>
      ))}
    </div>
  );
}

export default async function Page({ searchParams }: { searchParams: Record<string, any> }) {
  // Server-side filtering using URL params
  const params = Object.fromEntries(Object.entries(searchParams).map(([k, v]) => [k, v]));
  const items = applyFilters(MOCK_PRODUCTS, params);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-heading-2">New</h1>
        <Sort />
      </div>
      <div className="flex items-start gap-6">
        <Filters />
        <main className="flex-1">
          <ActiveBadges params={params} />
          {items.length === 0 ? (
            <p className="text-body">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((p) => (
                <Card
                  key={p.id}
                  title={p.name}
                  description={`${p.gender.charAt(0).toUpperCase() + p.gender.slice(1)}'s Shoes`}
                  meta={[`${p.colors.length} Color`, `${p.sizes.length} Size`]} 
                  imageSrc={p.image}
                  price={formatINR(p.price)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
