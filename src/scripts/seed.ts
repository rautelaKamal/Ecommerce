 import "dotenv/config";
 import { getDb, schema } from "@/db/client";

async function main() {
  const db = getDb();

  // Optional: clear existing products for idempotent seeding in dev
  // Caution: this deletes all products
  await db.delete(schema.products);

  const items = [
    {
      name: "Nike Air Force 1 '07",
      brand: "Nike",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80&auto=format&fit=crop",
      priceCents: 9999,
    },
    {
      name: "Nike Air Max 270",
      brand: "Nike",
      imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80&auto=format&fit=crop",
      priceCents: 12999,
    },
    {
      name: "Nike React Infinity Run",
      brand: "Nike",
      imageUrl: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=1200&q=80&auto=format&fit=crop",
      priceCents: 14999,
    },
    {
      name: "Nike Dunk Low",
      brand: "Nike",
      imageUrl: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=1200&q=80&auto=format&fit=crop",
      priceCents: 10999,
    },
  ];

  await db.insert(schema.products).values(items);

  const count = (await db.select({ id: schema.products.id }).from(schema.products)).length;
  console.log(`Seeded products: ${count}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
