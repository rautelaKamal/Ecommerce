import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseSchema } from '../enums';
import { productVariants } from '../product-variants';

// Sizes table
export const sizes = pgTable('sizes', {
  ...baseSchema,
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  sortOrder: integer('sort_order').notNull(),
});

// Relations
export const sizesRelations = relations(sizes, ({ many }) => ({
  productVariants: many(productVariants),
}));

// Types
export type Size = typeof sizes.$inferSelect;
export type SelectSize = Size;
export type NewSize = typeof sizes.$inferInsert;
