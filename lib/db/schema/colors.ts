import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseSchema } from './enums';
import { productVariants } from './product-variants';

// Colors table
export const colors = pgTable('colors', {
  ...baseSchema,
  name: text('name').notNull(),
  hexCode: text('hex_code').notNull(),
});

// Relations
export const colorsRelations = relations(colors, ({ many }) => ({
  productVariants: many(productVariants),
}));

// Types
export type Color = typeof colors.$inferSelect;
export type NewColor = typeof colors.$inferInsert;
