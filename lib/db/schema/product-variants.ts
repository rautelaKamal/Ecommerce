import { pgTable, text, uuid, numeric, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseSchema } from './enums';
import { products } from './products';
import { colors } from './filters/colors';
import { sizes } from './filters/sizes';

// Product Variants table
export const productVariants = pgTable('product_variants', {
  ...baseSchema,
  productId: uuid('product_id').notNull(),
  sku: text('sku').unique().notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric('sale_price', { precision: 10, scale: 2 }),
  colorId: uuid('color_id'),
  sizeId: uuid('size_id'),
  inStock: integer('in_stock').default(0).notNull(),
  weight: numeric('weight', { precision: 10, scale: 2 }),
  dimensions: jsonb('dimensions').$type<{ length: number; width: number; height: number }>(),
});

// Types
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;

// Relations
export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  color: one(colors, {
    fields: [productVariants.colorId],
    references: [colors.id],
  }),
  size: one(sizes, {
    fields: [productVariants.sizeId],
    references: [sizes.id],
  }),
}));
