import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseSchema } from './enums';
import { productVariants } from './product-variants';

// Sizes table
export const sizes = pgTable('sizes', {
  ...baseSchema,
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  category: text('category'), // e.g., 'clothing', 'shoes', 'accessories'
});

// Relations
export const sizesRelations = relations(sizes, ({ many }) => ({
  productVariants: many(productVariants),
}));

// Types
export type Size = typeof sizes.$inferSelect;
export type NewSize = typeof sizes.$inferInsert;
