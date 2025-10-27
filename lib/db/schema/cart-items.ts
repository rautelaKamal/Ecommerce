import { pgTable, uuid, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseSchema } from './enums';
import { carts } from './carts';
import { productVariants } from './product-variants';

// Cart Items table
export const cartItems = pgTable('cart_items', {
  ...baseSchema,
  cartId: uuid('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
  productVariantId: uuid('product_variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
}, (t) => ({
  // Ensure a variant can only be in a cart once
  unq: { unique: { columns: [t.cartId, t.productVariantId] }},
}));

// Relations
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  productVariant: one(productVariants, {
    fields: [cartItems.productVariantId],
    references: [productVariants.id],
  }),
}));

// Types
export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;
