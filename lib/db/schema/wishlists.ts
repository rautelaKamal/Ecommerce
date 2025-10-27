import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseSchema } from './enums';
import { users } from './user';
import { products } from './products';

// Wishlists table
export const wishlists = pgTable('wishlists', {
  ...baseSchema,
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  // Optional: Allow users to organize wishlist items into custom categories
  category: text('category'),
}, (t) => ({
  // A user can only have a product in their wishlist once
  unq: { unique: { columns: [t.userId, t.productId] }},
}));

// Relations
export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlists.productId],
    references: [products.id],
  }),
}));

// Types
export type WishlistItem = typeof wishlists.$inferSelect;
export type NewWishlistItem = typeof wishlists.$inferInsert;
