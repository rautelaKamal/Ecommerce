import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseSchema } from '../enums';
import { productVariants } from '../product-variants';
import { z } from 'zod';

// Sizes table
export const sizes = pgTable('sizes', {
  ...baseSchema,
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  sortOrder: integer('sort_order').notNull(),
});

export const insertSizeSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  sortOrder: z.number().int(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const selectSizeSchema = insertSizeSchema.extend({
  id: z.string().uuid(),
});

// Relations
export const sizesRelations = relations(sizes, ({ many }) => ({
  productVariants: many(productVariants),
}));

// Types
export type Size = typeof sizes.$inferSelect;
export type SelectSize = Size;
export type NewSize = typeof sizes.$inferInsert;
