import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import Card from "@/components/Card";
import { getAllProducts } from "@/lib/actions/product";
import { parseFilterParams } from "@/lib/utils/query";

export const dynamic = "force-dynamic";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
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
  const paramsObj = Object.fromEntries(Object.entries(searchParams).map(([k, v]) => [k, v]));
  const filters = parseFilterParams(paramsObj);
  const { products, totalCount } = await getAllProducts(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-heading-2">New</h1>
        <Sort />
      </div>
      <div className="flex items-start gap-6">
        <Filters />
        <main className="flex-1">
          <ActiveBadges params={paramsObj} />
          {products.length === 0 ? (
            <p className="text-body">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const inr = p.minPrice ? Number(p.minPrice) * 83 : undefined;
                return (
                <Card
                  key={p.id}
                  title={p.name}
                  description={"Nike Shoes"}
                  meta={[]}
                  imageSrc={p.images?.[0] || "/shoes/shoe-1.jpg"}
                  price={inr}
                />
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
