import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

// Debug: Check if env vars are loaded
console.log('Environment variables:', {
  envPath,
  NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ? '***REDACTED***' : 'NOT FOUND',
  NODE_ENV: process.env.NODE_ENV || 'development'
});

import { getDb } from '../db/client';
import { products } from '../db/schema';
import { eq } from 'drizzle-orm';

const db = getDb();

const log = (...args: unknown[]) => console.log('[seed]', ...args);
const err = (...args: unknown[]) => console.error('[seed:error]', ...args);

async function seed() {
  try {
    log('Seeding products...');

    const productData = [
      { name: 'Nike Air Max 1', brand: 'Nike', imageUrl: '/shoes/shoe-1.jpg', priceCents: 12999 },
      { name: 'Nike Air Max 90', brand: 'Nike', imageUrl: '/shoes/shoe-2.webp', priceCents: 14999 },
      { name: 'Nike Air Max 95', brand: 'Nike', imageUrl: '/shoes/shoe-3.webp', priceCents: 15999 },
      { name: 'Nike Air Max 97', brand: 'Nike', imageUrl: '/shoes/shoe-4.webp', priceCents: 16999 },
      { name: 'Nike Air Max 270', brand: 'Nike', imageUrl: '/shoes/shoe-5.avif', priceCents: 17999 },
    ];

    for (const product of productData) {
      const existing = await db
        .select()
        .from(products)
        .where(eq(products.name, product.name))
        .limit(1);
      
      if (existing.length === 0) {
        await db.insert(products).values(product);
        log(`Added product: ${product.name}`);
      } else {
        log(`Skipping existing product: ${product.name}`);
      }
    }

    log('Seeding complete!');
  } catch (e) {
    err('Error seeding database:', e);
    process.exit(1);
  }
}

seed();
