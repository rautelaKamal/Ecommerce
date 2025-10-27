import { pgTable, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseSchema } from '../enums';
import { products } from '../products';
import { productVariants } from '../product-variants';

// Genders table
export const genders = pgTable('genders', {
  ...baseSchema,
  label: text('label').notNull(),
  slug: text('slug').unique().notNull(),
});

// Types
export type Gender = typeof genders.$inferSelect;
export type SelectGender = Gender;
export type NewGender = typeof genders.$inferInsert;

// Relations
export const gendersRelations = relations(genders, ({ many }) => ({
  products: many(products),
  productVariants: many(productVariants),
}));
