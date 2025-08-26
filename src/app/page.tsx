 import Image from "next/image";
 import { getDb, schema } from "@/db/client";
 import { desc } from "drizzle-orm";

 export default async function Home() {
   let products: Array<{
     id: number;
     name: string;
     brand: string;
     imageUrl: string;
     priceCents: number;
   }> = [];

   try {
     const db = getDb();
     products = await db
       .select({
         id: schema.products.id,
         name: schema.products.name,
         brand: schema.products.brand,
         imageUrl: schema.products.imageUrl,
         priceCents: schema.products.priceCents,
       })
       .from(schema.products)
       .orderBy(desc(schema.products.createdAt));
   } catch {
     // If NEON_DATABASE_URL is missing or DB not provisioned
   }

   return (
     <div className="font-sans min-h-screen p-8 sm:p-12">
       <header className="mb-8">
         <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
         <p className="text-sm text-gray-500 mt-1">Powered by Drizzle ORM + Neon</p>
       </header>

       {products.length === 0 ? (
         <div className="text-gray-600">
           No products found. Ensure your database is configured and seeded. See env.example.
         </div>
       ) : (
         <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
           {products.map((p) => (
             <li key={p.id} className="rounded-lg border border-gray-200 overflow-hidden">
               <div className="relative w-full h-56 bg-gray-50">
                 <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
               </div>
               <div className="p-4 flex items-start justify-between gap-3">
                 <div>
                   <h3 className="font-semibold leading-tight">{p.name}</h3>
                   <p className="text-xs text-gray-500">{p.brand}</p>
                 </div>
                 <div className="font-medium">₹{(p.priceCents / 100).toFixed(2)}</div>
               </div>
             </li>
           ))}
         </ul>
       )}
     </div>
   );
 }
