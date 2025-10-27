import { pgTable, text } from 'drizzle-orm/pg-core';
import { baseSchema } from '../enums';

// Brands table
export const brands = pgTable('brands', {
  ...baseSchema,
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  logoUrl: text('logo_url'),
});

// Relations are defined in the central relations file

// Types
export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;
