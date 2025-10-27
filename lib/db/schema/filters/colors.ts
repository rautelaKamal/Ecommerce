import { pgTable, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseSchema } from '../enums';
import { productVariants } from '../product-variants';
import { z } from 'zod';

// Colors table
export const colors = pgTable('colors', {
  ...baseSchema,
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  hexCode: text('hex_code').notNull(),
});

export const insertColorSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  hexCode: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const selectColorSchema = insertColorSchema.extend({
  id: z.string().uuid(),
});

// Relations
export const colorsRelations = relations(colors, ({ many }) => ({
  productVariants: many(productVariants),
}));

// Types
export type Color = typeof colors.$inferSelect;
export type SelectColor = Color;
export type NewColor = typeof colors.$inferInsert;
