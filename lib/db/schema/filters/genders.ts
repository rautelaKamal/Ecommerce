import { pgTable, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseSchema } from '../enums';
import { products } from '../products';
import { productVariants } from '../product-variants';
import { z } from 'zod';

// Genders table
export const genders = pgTable('genders', {
  ...baseSchema,
  label: text('label').notNull(),
  slug: text('slug').unique().notNull(),
});

export const insertGenderSchema = z.object({
  label: z.string().min(1),
  slug: z.string().min(1),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const selectGenderSchema = insertGenderSchema.extend({
  id: z.string().uuid(),
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
