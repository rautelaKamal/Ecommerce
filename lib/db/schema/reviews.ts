import { pgTable, text, timestamp, uuid, integer, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { users } from './user';
import { products } from './products';

// Reviews table
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1-5 stars
  title: text('title').notNull(),
  comment: text('comment').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  isPublished: boolean('is_published').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

// Zod Schemas
export const insertReviewSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(200),
  comment: z.string().min(1).max(2000),
  isVerified: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const selectReviewSchema = insertReviewSchema.extend({
  id: z.string().uuid(),
});

// Types
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type SelectReview = z.infer<typeof selectReviewSchema>;
