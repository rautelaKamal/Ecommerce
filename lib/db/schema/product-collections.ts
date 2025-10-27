import { pgTable, uuid, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { products } from './products';
import { collections } from './collections';

// Product Collections table (junction table for many-to-many relationship)
export const productCollections = pgTable('product_collections', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  collectionId: uuid('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
  position: integer('position').default(0),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const productCollectionsRelations = relations(productCollections, ({ one }) => ({
  product: one(products, {
    fields: [productCollections.productId],
    references: [products.id],
  }),
  collection: one(collections, {
    fields: [productCollections.collectionId],
    references: [collections.id],
  }),
}));

// Zod schemas
export const insertProductCollectionSchema = z.object({
  productId: z.string().uuid(),
  collectionId: z.string().uuid(),
  position: z.number().int().optional(),
  isFeatured: z.boolean().optional(),
});

// Types
export type ProductCollection = typeof productCollections.$inferSelect;
export type InsertProductCollection = z.infer<typeof insertProductCollectionSchema>;